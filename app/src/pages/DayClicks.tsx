import * as React from 'react';
import {JSX, RefObject, useEffect, useRef, useState} from 'react';
import {getTotalCountByDay} from "../services/ApiService.ts";
import AxiosResponse from "axios";
import {Feedback, FeedbackType} from "../models/Feedback.ts";
import FeedbackPopup from "../components/FeedbackPopup.tsx";
import type {GetTotalCountResponseByDay} from "../models/GetTotalCountByDayResponse.ts";
import Box from '@mui/material/Box';
import {LineChart} from '@mui/x-charts/LineChart';
import FormControl from '@mui/material/FormControl';
import type {AllSeriesType} from "@mui/x-charts";
import type {SelectChangeEvent} from "@mui/material";
import {CircularProgress} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {enrichDayCountsWithZeroes, sortByDate} from "../utilities/utility.ts";

function DayClicks(): JSX.Element {
    let defaultResponse: GetTotalCountResponseByDay[] = [{ day: new Date(), slug: "", target: "", count: 0 }];

    const [slug, setSlug] = useState('');
    const [allSlugs, setAllSlugs] = useState(['']);

    const [countData, setCountData] = useState(defaultResponse);
    const feedback: RefObject<Feedback> = useRef({feedbackType: FeedbackType.ERROR, message: "Error"});
    const [showFeedback, setShowFeedback] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        getTotalCountByDay().then((result: AxiosResponse<GetTotalCountResponseByDay[]>) => {
            const countsByDay = result.data as GetTotalCountResponseByDay[];
            const uniqueSlugs = [...new Set(countsByDay.map((data) => data.slug))]
            const enrichedCounts = enrichDayCountsWithZeroes(countsByDay);

            setCountData(enrichedCounts);

            // Show slug with the biggest count as the initial graph for the best impression
            setSlug(
                enrichedCounts
                    .sort((a, b) => a.count - b.count)[0]
                    .slug
            );

            setAllSlugs(uniqueSlugs);
        }).catch(() => {
            setShowFeedback(true);
            feedback.current.message = "Error Fetching Data";
            feedback.current.feedbackType = FeedbackType.ERROR;
        }).finally(() => { setLoading(false); })
    }, []);

    const handleChange = (event: SelectChangeEvent<unknown>) => {
        setSlug(event.target.value as string);
    };

    const series = [{
        type: 'line',
        yAxisId: 'clicks',
        color: 'black',
        label: 'Clicks',
        data: countData
            .filter((d) => d.slug === slug)
            .sort(sortByDate)
            .map((d) => d.count),
        highlightScope: { highlight: 'item' },
    }] as AllSeriesType[];

    return (
        <>
            {!loading && (
                <Box sx={{ width: 700, height: 500 }}>
                <LineChart
                    series={series}
                    xAxis={[
                        {
                            id: 'day',
                            data: countData
                                .filter((d) => d.slug === slug)
                                .sort(sortByDate)
                                .map((data: GetTotalCountResponseByDay) => data.day)
                            ,
                            scaleType: 'band',
                            height: 40,
                        },
                    ]}
                    yAxis={[
                        {
                            id: 'clicks',
                            tickMinStep: 1,
                            min: 0,
                            scaleType: 'linear',
                            position: 'left',
                            width: 50
                        },
                    ]}
                />
                </Box>
            )}
            { loading && <CircularProgress color={"secondary"}/> }
            { !loading &&  (
                <FormControl sx={{ width: 250 }} style={{ marginTop: '20px' }}>
                    <InputLabel id="demo-simple-select-label">Slug</InputLabel>
                    <Select
                        labelId="slug-label"
                        id="slug"
                        value={slug}
                        label="Slug"
                        onChange={handleChange}
                    >
                        {
                            allSlugs
                            .map((slug) =>
                                (<MenuItem value={slug}>{slug}</MenuItem>)
                            )
                        }
                    </Select>
                </FormControl>
            )}
            <FeedbackPopup feedback={feedback.current} enable={showFeedback} onClose={() => setShowFeedback(false)} />
        </>
    );
}

export default DayClicks;
