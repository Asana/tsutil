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
        this._prev._setNext(this._next);
        if (this._hasNext()) {
            this._next._setPrev(this._prev);
        }
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

    private _isUnused: boolean;
    private _isStale: boolean;

    /**
     * Create a new perishable
     * @param value The value to reference
     * @param onUnused The callback for when the reference become unused
     */
    constructor(value: T, onUnused: () => any) {
        this._value = value;
        this._head = new PerishableNode<T>(value, () => {
          if (!this.isUnused()) {
            this._isUnused = true;
            onUnused();
          }
        });
        this._isUnused = true;
        this._isStale = false;
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
        return this._isUnused;
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
        this._isUnused = false;
        return new PerishableNode<T>(this._value, onStale, this._head);
    }

    /**
     * Make the reference stale and notify all handles
     */
    makeStale(): void {
        if (!this.isStale()) {
            this._isStale = true;
            var callbacks: Array<() => void> = [];
            for (var node = this._head; node !== null; node = node._next) {
              callbacks.push(node._callback);
            }
            for (var i = callbacks.length - 1; i >= 0; i--) {
                callbacks[i]();
            }
        }
    }
}

export = Perishable;
