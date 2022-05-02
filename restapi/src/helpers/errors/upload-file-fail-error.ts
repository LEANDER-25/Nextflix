export class UploadFileFailError extends Error {
    constructor(msg = "") {
        super(msg);
        this.name = "UploadFileFailError";
    }
}