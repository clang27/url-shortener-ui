import {JSX, useEffect, useState} from "react";
import {Alert, Fade, Snackbar} from "@mui/material";


function FeedbackPopup({feedback, enable, onClose}): JSX.Element {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(enable);
    }, [enable]);

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            slots={{ transition: Fade }}
            open={open}
            onClose={() => {onClose();}}
            autoHideDuration={2000}
        >
            <Alert
                severity={feedback.feedbackType}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {feedback.message}
            </Alert>
        </Snackbar>
    );
}

export default FeedbackPopup;
