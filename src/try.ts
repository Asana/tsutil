import Optional = require("./optional");

/**
 * The Try class is used to represent an error xor a value
 */
class Try<E extends Error, T> {
    private _err: E;
    private _value: T;

    /**
     * Attempts to flatten an array of tries
     * @param tries The list of tries to flatten
     * @returns {Try<T[]>}
     */
    static all<E extends Error, T>(tries: Try<E, T>[]): Try<E, T[]> {
        return Try.attempt<E, T[]>(() => {
            return tries.reduce((acc: T[], elem: Try<E, T>) => {
                acc.push(elem.getOrThrow());
                return acc;
            }, []);
        });
    }

    /**
     * Attempts a function and returns a Try for its success
     * @param fn The function to attempt
     * @param filter? If provided, any errors not matched by filter are thrown.
     *   Otherwise, all errors encountered during the execution of fn will be
     *   caught and stored.
     * @returns {Try<T>}
     */
    static attempt<E extends Error, T>(fn: () => T, filter?: (err: E) => boolean): Try<E, T> {
        try {
            var value = fn();
            return new Try<E, T>(null, value);
        } catch (err) {
            if (!filter || filter(err)) {
                return new Try<E, T>(err, null);
            } else {
                throw err;
            }
        }
    }

    /**
     * Create a new successful Try
     * @param value The value for the Try
     * @returns {Try<T>}
     */
    static success<E extends Error, T>(value: T): Try<E, T> {
        return new Try<E, T>(null, value);
    }

    /**
     * Create a new failed Try
     * @param err The error for the Try
     * @returns {Try<T>}
     */
    static failure<E extends Error, T>(err: E): Try<E, T> {
        return new Try<E, T>(err, null);
    }

    /**
     * Creates a new Try assuming success
     * @param value The value for the Try
     * @param err The optional error that will override the value
     */
    constructor(err: E, value: T) {
        this._value = value;
        this._err = err;
    }

    /**
     * The error of the try
     * @returns {Error}
     */
    error(): E {
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
    filter(predicate: (value: T) => boolean): Try<Error, T> {
        if (this.isFailure() || predicate(this._value)) {
            return this;
        }
        return Try.failure<Error, T>(new Error("Try#filter(): No such element"));
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
    map<U>(mapper: (value: T) => U): Try<Error, U> {
        if (this.isSuccess()) {
            return Try.attempt<Error, U>(() => {
                return mapper(this._value);
            });
        }
        return (<Try<E, U>><{}>this);
    }

    /**
     * Map a try to a new try and flatten
     * @param mapper A map function that returns a try
     * @returns {Try<U>}
     */
    flatMap<F extends E, U>(mapper: (value: T) => Try<F, U>): Try<E, U> {
        if (this.isSuccess()) {
            return mapper(this._value);
        }
        return (<Try<E, U>><{}>this);
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
    getOrElse<U extends T>(other: (err: E) => U): T {
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
    orElse<U extends T>(other: (err: E) => Try<E, U>): Try<Error, T> {
        if (this.isSuccess()) {
            return this;
        }
        return other(this._err);
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
    transform<F extends Error, U>(onSuccess: (value: T) => Try<F, U>, onFailure: (err: Error) => Try<F, U>): Try<F, U> {
        if (this.isSuccess()) {
            return onSuccess(this._value);
        }
        return onFailure(this._err);
    }
}

export = Try;
