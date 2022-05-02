export class AxiosRequestError extends Error {
    constructor(msg = "") {
        super(msg);
        this.name = "AxiosRequestError";
    }
}