export enum FeedbackType {
    SUCCESS="success", ERROR="error"
}

export class Feedback {
    constructor(public feedbackType: FeedbackType, public message: string) { }
}