import Releasable = require("./releasable");

class Handle<T> implements Releasable {
    private _value: T;
    private _onRelease: () => any;

    constructor(value: T, onRelease: () => any) {
        this._value = value;
        this._onRelease = onRelease;
    }

    value(): T {
        return this._value;
    }

    release(): void {
        this._onRelease();
    }
}

export = Handle;
