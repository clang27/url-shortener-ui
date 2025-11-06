import {JSX, RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {MaterialReactTable, useMaterialReactTable,} from 'material-react-table';
import type {GetTotalCountResponse} from "../models/GetTotalCountResponse.ts";
import {getTotalCount} from "../services/ApiService.ts";
import {AxiosError} from "axios";
import {Feedback, FeedbackType} from "../models/Feedback.ts";
import FeedbackPopup from "../components/FeedbackPopup.tsx";
import {CircularProgress} from "@mui/material";
import * as React from "react";

function TotalClicks(): JSX.Element {
    let defaultResponse: GetTotalCountResponse = {slug: "", target: "", count: 0};

    const [data, setData] = useState(defaultResponse);
    const feedback: RefObject<Feedback> = useRef({feedbackType: FeedbackType.ERROR, message: "Error"});
    const [showFeedback, setShowFeedback] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        getTotalCount().then((result) => {
            setData(result.data);
        }).catch((err: AxiosError) => {
            setShowFeedback(true);
            feedback.current.message = "Error Fetching Data";
            feedback.current.feedbackType = FeedbackType.ERROR;
        }).finally(() => { setLoading(false); })
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'slug',
                header: 'Slug',
                maxSize: 200,
                minSize: 200,
                size: 200,
            },
            {
                accessorKey: 'target',
                header: 'Target URL',
                maxSize: 450,
                minSize: 450,
                size: 450,
                Cell: ({ cell }) => {
                    const maxLength = 60;
                    const tooBig = cell.getValue().length > maxLength;
                    const value = tooBig ? cell.getValue().slice(0, maxLength).concat('...') : cell.getValue();

                    return (
                        <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                             title={cell.getValue()}
                        >
                            {value}
                        </div>
                    )
                },
            },
            {
                accessorKey: 'count',
                header: 'Count',
                maxSize: 50,
                minSize: 50,
                size: 50,
            },
        ],
        [],
    );

    const colorOne = '#DDD';
    const colorTwo = '#BBB';

    const table = useMaterialReactTable({
        columns,
        data,
        muiTableBodyCellProps: {
            sx: {
                backgroundColor: colorOne,
                borderColor: colorTwo,
            }
        },
        muiTableHeadCellProps: {
            sx: {
                backgroundColor: colorOne,
                borderColor: colorTwo,
            }
        },
        muiTableBodyRowProps: {
            sx: {
                backgroundColor: colorOne,
            }
        },
        muiTableHeadRowProps: {
            sx: {
                backgroundColor: colorOne,
            }
        },
        muiTopToolbarProps: {
            sx: {
                backgroundColor: colorOne,
            }
        },
        muiBottomToolbarProps: {
            sx: {
                backgroundColor: colorOne,
            }
        },
    });

    return (
        <>
            { !loading && (<MaterialReactTable table={table}/>) }
            { loading && <CircularProgress color={"secondary"}/> }
            <FeedbackPopup feedback={feedback.current} enable={showFeedback} onClose={() => setShowFeedback(false)}/>
        </>
    );
}

export default TotalClicks;
