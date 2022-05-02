export class OutOfRangeError extends Error {
    constructor(msg = "") {
        super(msg);
        this.name = "OutOfRangeError";
    }
}