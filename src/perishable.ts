import Handle = require("./handle");

class PerishableNode<T> implements Handle<T> {
    private _value: T;
    private _onStale: () => any;
    _prev: PerishableNode<T>;
    _next: PerishableNode<T>;

    constructor(value: T, onStale: () => any = null, prev: PerishableNode<T> = null) {
        this._value = value;
        this._onStale = onStale;
        this._prev = prev;
        this._next = null;
        if (this.hasPrev()) {
            this._next = this._prev._next;
            this._prev._next = this;
            if (this.hasNext()) {
                this._next._prev = this;
            }
        }

    }

    value(): T {
        return this._value;
    }

    release(): void {
        this._prev._next = this._next;
        if (this.hasNext()) {
            this._next._prev = this._prev;
        }
    }

    hasPrev(): boolean {
        return this._prev !== null;
    }

    hasNext(): boolean {
        return this._next !== null;
    }

    onStale(): void {
        if (this._onStale !== null) {
            this._onStale();
        }
    }
}

class Perishable<T> {
    private _value: T;
    private _onUnused: () => any;
    private _isStale: boolean;
    private _head: PerishableNode<T>;

    constructor(value: T, onUnused: () => any) {
        this._value = value;
        this._onUnused = onUnused;
        this._isStale = false;
        this._head = new PerishableNode<T>(null);
    }

    value(): T {
        return this._value;
    }

    isStale(): boolean {
        return this._isStale;
    }

    isUnused(): boolean {
        return !this._head.hasNext();
    }

    createHandle(onStale: () => any): Handle<T> {
        if (this.isStale()) {
            throw new Error("Cannot createHandle when stale");
        }
        return new PerishableNode<T>(this._value, onStale, this._head);
    }

    makeStale(): void {
        if (!this.isStale()) {
            var iterator = this._head._next;
            while (iterator !== null) {
                iterator.onStale();
                iterator = iterator._next;
            }
            this._isStale = true;
            this._head = null;
        }
    }
}

export = Perishable;
