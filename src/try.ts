import Optional = require("./optional");

/**
 * The Try class is used to represent an error xor a value
 */
class Try<T> {
    private _err: Error;
    private _value: T;

    /**
     * Attempts to flatten an array of tries
     * @param tries The list of tries to flatten
     * @returns {Try<T[]>}
     */
    static all<T>(tries: Try<T>[]): Try<T[]> {
        return Try.attempt<T[]>(() => {
            return tries.reduce((acc, elem) => {
                acc.push(elem.getOrThrow());
                return acc;
            }, []);
        });
    }

    /**
     * Attemps a function and returns a Try for its success
     * @param fn The function to attempt
     * @returns {Try<T>}
     */
    static attempt<T>(fn: () => T): Try<T> {
        try {
            var value = fn();
            return new Try<T>(value);
        } catch (err) {
            return new Try<T>(null, err);
        }
    }

    static create<T>(fn: () => T, filter?: (err: Error) => boolean): Try<T> {
        var t = Try.attempt<T>(fn);
        if (!filter || filter(t.error())) {
            return t;
        }
        throw t.error();
    }

    /**
     * Create a new successful Try
     * @param value The value for the Try
     * @returns {Try<T>}
     */
    static success<T>(value: T): Try<T> {
        return new Try<T>(value);
    }

    /**
     * Create a new failed Try
     * @param err The error for the Try
     * @returns {Try<T>}
     */
    static failure<T>(err: Error): Try<T> {
        return new Try<T>(null, err);
    }

    /**
     * Creates a new Try assuming success
     * @param value The value for the Try
     * @param err The optional error that will override the value
     */
    constructor(value: T, err: Error = null) {
        this._value = value;
        this._err = err;
    }

    /**
     * The error of the try
     * @returns {Error}
     */
    error(): Error {
        return this._err;
    }

    /**
     * Whether or not the try is failed
     * @returns {boolean}
     */
    isFailure(): boolean {
        return this._err !== null;
    }

    /**
     * Whether or not the try is successful
     * @returns {boolean}
     */
    isSuccess(): boolean {
        return !this.isFailure();
    }

    /**
     * Return a try based on whether or not the value matches the filter
     * @param filterer A filter function to check the value against
     * @returns {*}
     */
    filter(filterer: (value: T) => boolean): Try<T> {
        if (this.isFailure() || filterer(this._value)) {
            return this;
        }
        return Try.failure<T>(new Error("Try.filter: No such element"));
    }

    /**
     * A side effect callback for accessing the value that will only be called if there is a value
     * @param callback The callback for the value
     */
    forEach(callback: (value: T) => any): void {
        if (this.isSuccess()) {
            callback(this._value);
        }
    }

    /**
     * Map a try to a new try
     * @param mapper A map function to create the new value
     * @returns {Try<U>}
     */
    map<U>(mapper: (value: T) => U): Try<U> {
        if (this.isSuccess()) {
            return Try.attempt<U>(() => {
                return mapper(this._value);
            });
        }
        return (<Try<U>><{}>this);
    }

    /**
     * Map a try to a new try and flatten
     * @param mapper A map function that returns a try
     * @returns {Try<U>}
     */
    flatMap<U>(mapper: (value: T) => Try<U>): Try<U> {
        if (this.isSuccess()) {
            return mapper(this._value);
        }
        return (<Try<U>><{}>this);
    }

    /**
     * Access the value or throw the error
     */
    getOrThrow(): T {
        if (this.isFailure()) {
            throw this._err;
        }
        return this._value;
    }

    /**
     * Retrieves the value and falls back to another value in case of error
     * @param other The fallback accessor
     * @returns {*}
     */
    getOrElse<U extends T>(other: (err: Error) => U): T {
        if (this.isSuccess()) {
            return this._value;
        }
        return other(this._err);
    }

    /**
     * Retrieves the value and falls back to another try
     * @param other The fallback try accessor
     * @returns {*}
     */
    orElse<U extends T>(other: () => Try<U>): Try<T> {
        if (this.isSuccess()) {
            return this;
        }
        return other();
    }

    /**
     * Converts the try to an optional. Returns Optional.NONE if the try is not successful
     * @returns {*}
     */
    toOptional(): Optional<T> {
        if (this.isSuccess()) {
            return new Optional(this._value);
        }
        return Optional.NONE;
    }

    /**
     * Transforms a try based on the success and failure conditions
     * @param onSuccess The callback for when the try is successful
     * @param onFailure The callback for when the try is failed
     * @returns {Try<U>}
     */
    transform<U>(onSuccess: (value: T) => Try<U>, onFailure: (err: Error) => Try<U>): Try<U> {
        if (this.isSuccess()) {
            return onSuccess(this._value);
        }
        return onFailure(this._err);
    }
}

export = Try;
