/**
  * A simple Spy proxy that tracks and forward function calls.
  * NB: this immediately replaces obj's func.
  */
export class Spy {
    constructor(obj, func) {
        this._called = 0;
        this._callargs = [];
        let og_func = obj[func];
        let spy = (...args) => {
            ++this._called;
            this._callargs.push(args);
            return og_func.apply(obj, args);
        };
        obj[func] = spy;

        this._reset = () => {
            this._called = 0;
            this._callargs = [];
        };
    }
}
