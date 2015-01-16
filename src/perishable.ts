import Handle = require("./handle");

interface PerishableNodePointer<T> {
    next(): PerishableNode<T>;
    setNext(node: PerishableNode<T>): void;
}

class PerishableSentinel<T> implements PerishableNodePointer<T> {
    private _next: PerishableNode<T>;
    private _onUnused: () => any;

    constructor(onUnused: () => any) {
        this._next = null;
        this._onUnused = onUnused;
    }

    isUnused(): boolean {
        return this._next === null;
    }

    next(): PerishableNode<T> {
        return this._next;
    }

    setNext(node: PerishableNode<T>): void {
        this._next = node;
        if (this._next === null && this._onUnused) {
            this._onUnused();
        }
    }
}

class PerishableNode<T> implements Handle<T>, PerishableNodePointer<T> {
    private _value: T;
    private _onStale: () => any;
    _prev: PerishableNodePointer<T>;
    _next: PerishableNode<T>;

    constructor(value: T, onStale: () => any, prev: PerishableNodePointer<T>) {
        this._value = value;
        this._onStale = onStale;
        this._prev = prev;
        this._next = this._prev.next();
        this._prev.setNext(this);
        if (this.hasNext()) {
            this._next._prev = this;
        }
    }

    value(): T {
        return this._value;
    }

    release(): void {
        this._prev.setNext(this._next);
        if (this.hasNext()) {
            this._next._prev = this._prev;
        }
    }

    next(): PerishableNode<T> {
        return this._next;
    }

    setNext(node: PerishableNode<T>): void {
        this._next = node;
    }

    hasNext(): boolean {
        return this._next !== null;
    }

    onStale(): void {
        if (this._onStale) {
            this._onStale();
        }
    }
}

/**
 * An immutable reference that handles the value becoming stale
 */
class Perishable<T> {
    private _value: T;
    private _onUnused: () => any;
    private _isStale: boolean;
    private _sentinel: PerishableSentinel<T>;

    /**
     * Create a new perishable
     * @param value The value to reference
     * @param onUnused The callback for when the reference become unused
     */
    constructor(value: T, onUnused: () => any) {
        this._value = value;
        this._onUnused = onUnused;
        this._isStale = false;
        this._sentinel = new PerishableSentinel<T>(this._onUnused);
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
        return this._isStale;
    }

    /**
     * Whether or not the perishable has any handles
     * @returns {boolean}
     */
    isUnused(): boolean {
        return this._sentinel.isUnused();
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
        return new PerishableNode<T>(this._value, onStale, this._sentinel);
    }

    /**
     * Make the reference stale and notify all handles
     */
    makeStale(): void {
        if (!this.isStale()) {
            var iterator: PerishableNode<T>;
            iterator = (<PerishableNode<T>>this._sentinel.next());
            while (iterator !== null) {
                iterator.onStale();
                iterator = (<PerishableNode<T>>iterator.next());
            }
            this._isStale = true;
            this._sentinel = null;
        }
    }
}

export = Perishable;
