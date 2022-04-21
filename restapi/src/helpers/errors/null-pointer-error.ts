export class NullPointerError extends Error {
    constructor(msg = "") {
        super(msg);
        this.name = 'NullPointerError';
    }
}