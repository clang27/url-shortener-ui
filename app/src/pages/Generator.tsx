import {JSX, RefObject, useCallback, useRef, useState} from 'react';
import {getShortUrl} from "../services/ApiService.ts";
import FeedbackPopup from "../components/FeedbackPopup.tsx";
import {Grid, TextField} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type {Feedback} from "../models/Feedback.ts";
import {FeedbackType} from "../models/Feedback.ts";
import type {AxiosError} from "axios";

function Generator(): JSX.Element {
    const cooldownTimer = useRef(false);
    const cooldoonRepeat = useRef(true);

    const [targetUrl, setTargetUrl] = useState("");
    const [generatedUrl, setGeneratedUrl] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);

    const feedback: RefObject<Feedback> = useRef({feedbackType: FeedbackType.ERROR, message: "Error"});

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setShowFeedback(true);
            feedback.current.message = "URL copied";
            feedback.current.feedbackType = FeedbackType.SUCCESS;
        } catch (err) {
            setShowFeedback(true);
            feedback.current.message = "Failed to copy text";
            feedback.current.feedbackType = FeedbackType.ERROR;
        }
    }, []);

    const getUrl = (): void => {
        // They entered the same URL, so just return
        if (cooldoonRepeat.current) { return; }

        if (cooldoonRepeat.current || targetUrl.length < 8) {
            setShowFeedback(true);
            feedback.current.message = "Invalid URL";
            feedback.current.feedbackType = FeedbackType.ERROR;
            return;
        }
        // They are hitting the API too fast
        if (cooldownTimer.current) {
            setShowFeedback(true);
            feedback.current.message = "Please wait a few seconds before trying again";
            feedback.current.feedbackType = FeedbackType.ERROR;
            return;
        }

        cooldoonRepeat.current = true;
        cooldownTimer.current = true;
        setTimeout(() => cooldownTimer.current = false, 2000);

        getShortUrl(targetUrl).then((result) => {
            setGeneratedUrl(result.data);
        }).catch((err: AxiosError) => {
            setShowFeedback(true);
            feedback.current.message = feedback.current.message = (err.status === 400) ? "Invalid URL" : "Error Hitting API";
            feedback.current.feedbackType = FeedbackType.ERROR;
        });
    }

    return (
        <>
            <Grid container rowSpacing={2} width={500} justifyContent={"center"} alignItems={"center"}>
                <Grid size={10}>
                    <TextField fullWidth
                               disabled={true}
                               style={{ visibility: generatedUrl.length > 0 ? "visible" : "hidden" }}
                               value={generatedUrl} />
                </Grid>
                <Grid size={2}>
                    { generatedUrl.length > 0 && (<ContentCopyIcon style={{color: "black", cursor: "pointer"}}
                                                                   onClick={() => copy(generatedUrl)} />) }
                </Grid>
                <Grid size={12}>
                    <TextField fullWidth label="Target URL" variant="filled"
                               onChange={(val) => {
                                   cooldoonRepeat.current = false;
                                   setTargetUrl(val.target.value);
                               }}/>
                </Grid>
                <Grid size={12}>
                    <button type="button" onClick={getUrl}>Generate URL</button>
                </Grid>
            </Grid>
            <FeedbackPopup feedback={feedback.current} enable={showFeedback} onClose={() => setShowFeedback(false)}/>
        </>
    );
}

export default Generator;
