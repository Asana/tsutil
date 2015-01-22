import Handle = require("./handle");

class PerishableNode<T> implements Handle<T> {
    private _value: T;
    private _callback: () => any;
    private _prev: PerishableNode<T>;
    private _next: PerishableNode<T>;

    constructor(value: T, callback: () => any, prev: PerishableNode<T> = null) {
        this._value = value;
        this._callback = callback;
        this._prev = prev;
        this._next = null;
        if (this.hasPrev()) {
            this._next = this._prev._next;
            this._prev._next = this;
        }
        if (this.hasNext()) {
            this._next._prev = this;
        }
    }

    hasPrev(): boolean {
        return this._prev !== null;
    }

    hasNext(): boolean {
        return this._next !== null;
    }

    value(): T {
        return this._value;
    }

    release(): void {
        if (this.hasPrev()) {
            this._prev._next = this._next;
        }
        if (this.hasNext()) {
            this._next._prev = this._prev;
        }
    }

    pop(): void {
        if (this.hasNext()) {
            this._next.pop();
            this._next = null;
        }
        this._callback();
    }
}

/**
 * An immutable reference that handles the value becoming stale
 */
class Perishable<T> {
    private _value: T;
    private _head: PerishableNode<T>;

    /**
     * Create a new perishable
     * @param value The value to reference
     * @param onUnused The callback for when the reference become unused
     */
    constructor(value: T, onUnused: () => any) {
        this._value = value;
        this._head = new PerishableNode<T>(value, onUnused);
    }

    /**
     * The value of the perishable
     * @returns {T}
     */
    value(): T {
        return this._value;
    }

    /**
     * Whether or not the reference is stale
     * @returns {boolean}
     */
    isStale(): boolean {
        return this._head === null;
    }

    /**
     * Whether or not the perishable has any handles
     * @returns {boolean}
     */
    isUnused(): boolean {
        return this.isStale() || !this._head.hasNext();
    }

    /**
     * Create a new handle
     * @param onStale The callback for when the reference goes stale
     * @returns {PerishableNode<T>} A handle for the reference
     */
    createHandle(onStale: () => any): Handle<T> {
        if (this.isStale()) {
            throw new Error("Cannot createHandle when stale");
        }
        return new PerishableNode<T>(this._value, onStale, this._head);
    }

    /**
     * Make the reference stale and notify all handles
     */
    makeStale(): void {
        if (!this.isStale()) {
            this._head.pop();
            this._head = null;
        }
    }
}

export = Perishable;
