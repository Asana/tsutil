import Handle = require("./handle");

class PerishableNode<T> implements Handle<T> {
    _value: T;
    _callback: () => any;
    _prev: PerishableNode<T>;
    _next: PerishableNode<T>;
    _isReleased: boolean;

    constructor(value: T, callback: () => any, prev: PerishableNode<T> = null) {
        this._value = value;
        this._callback = callback;
        this._prev = prev;
        this._next = null;
        if (this._hasPrev()) {
            this._setNext(this._prev._next);
            this._prev._setNext(this);
        }
        if (this._hasNext()) {
            this._next._setPrev(this);
        }
        this._isReleased = false;
    }

    _setPrev(prev: PerishableNode<T>): void {
        this._prev = prev;
    }

    _setNext(next: PerishableNode<T>): void {
        this._next = next;
        // We only automatically call the callback when the head is unused
        if (!this._hasPrev() && !this._hasNext()) {
            this._callback();
        }
    }

    _hasPrev(): boolean {
        return this._prev !== null;
    }

    _hasNext(): boolean {
        return this._next !== null;
    }

    value(): T {
        return this._value;
    }

    release(): void {
        if (this._isReleased) {
            throw new Error("Only release a perishable node once");
        }
        this._prev._setNext(this._next);
        if (this._hasNext()) {
            this._next._setPrev(this._prev);
        }
        // Perishable nodes should only be released once but in case we strip assertions we want to make sure that we
        // don't accidentally add _next into _prev's list if we are removed twice.
        this._prev = null;
        this._next = null;
        this._isReleased = true;
    }

    isReleased(): boolean {
        return this._isReleased;
    }
}

/**
 * An immutable reference that handles the value becoming stale
 */
class Perishable<T> {
    private _value: T;
    private _head: PerishableNode<T>;

    private _isStale: boolean;
    private _onStale: () => any;

    /**
     * Create a new perishable
     * @param value The value to reference
     * @param onUnused Called when the reference becomes unused. Can be called more than once.
     * @param onStale Called when the reference becomes stale. Only called once.
     */
    constructor(value: T, onUnused: () => any, onStale: () => any) {
        this._value = value;
        this._head = new PerishableNode<T>(value, onUnused);
        this._isStale = false;
        this._onStale = onStale;
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
        return !this._head._hasNext();
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
     * Make the reference stale and notify all handles. Safe to call more than once.
     */
    makeStale(): void {
        if (!this.isStale()) {
            this._isStale = true;
            var callbacks: Array<() => void> = [];
            for (var node = this._head._next; node !== null; node = node._next) {
                callbacks.push(node._callback);
            }
            for (var i = callbacks.length - 1; i >= 0; i--) {
                callbacks[i]();
            }
            this._onStale();
        }
    }
}

export = Perishable;
