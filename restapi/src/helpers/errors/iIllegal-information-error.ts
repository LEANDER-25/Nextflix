export class IllegalInformationError extends Error {
    constructor(msg = "") {
        super(msg);
        this.name = "IllegalInformationError";
    }
}