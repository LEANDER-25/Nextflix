export class ObjectExistedError extends Error {
    constructor(msg = "") {
        super(msg);
        this.name = 'ObjectExistedError';
    }
}