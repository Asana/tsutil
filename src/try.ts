import Either = require("./either");
import Optional = require("./optional");

/**
 * The Try class is used to represent an error xor a value
 */
class Try<E extends Error, T> extends Either<E, T> {
    /**
     * Attempts to flatten an array of tries
     * @param tries The list of tries to flatten
     * @returns {Try<T[]>}
     */
    static all<E extends Error, T>(tries: Try<E, T>[]): Try<E, T[]> {
        return Try.attempt<E, T[]>(() => {
            return tries.reduce((acc: T[], t: Try<E, T>) => {
                acc.push(t.valueOrThrow());
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
            return new Try<E, T>(undefined, value);
        } catch (err) {
            if (!filter || filter(err)) {
                return new Try<E, T>(err, undefined);
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
        return new Try<E, T>(undefined, value);
    }

    /**
     * Create a new failed Try
     * @param err The error for the Try
     * @returns {Try<T>}
     */
    static failure<E extends Error, T>(err: E): Try<E, T> {
        return new Try<E, T>(err, undefined);
    }

    constructor(error: E, value: T) {
        super(error, value);
        if (this.isFailure() && this.errorOrNull() === null) {
            throw new Error("Try#constructor(): Provided a null error");
        }
    }

    /**
     * Return an Optional of the error, or NONE if it is not defined
     * @returns {Optional<E>}
     */
    error(): Optional<E> {
        return this.left();
    }

    /**
     * The error of the try or null if it does not exist
     * @returns {Error}
     */
    errorOrNull(): E {
        return this.leftOrNull();
    }

    /**
     * Whether or not the try is failed
     * @returns {boolean}
     */
    isFailure(): boolean {
        return this.isLeft();
    }

    /**
     * Whether or not the try is successful
     * @returns {boolean}
     */
    isSuccess(): boolean {
        return this.isRight();
    }

    /**
     * Return a try based on whether or not the value matches the filter
     * @param filterer A filter function to check the value against
     * @returns {*}
     */
    filter(predicate: (value: T) => boolean): Try<Error, T> {
        return this.fold<Try<Error, T>>((err: E) => {
            return this;
        }, (value: T) => {
            if (predicate(value)) {
                return this;
            } else {
                return Try.failure<Error, T>(new Error("Try#filter(): No such element"));
            }
        });
    }

    /**
     * A side effect callback for accessing the value that will only be called if there is a value
     * @param callback The callback for the value
     */
    forEach(callback: (value: T) => any): void {
        if (this.isSuccess()) {
            callback(this.valueOrNull());
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
                return mapper(this.valueOrNull());
            });
        } else {
            return <Try<E, U>><{}>this;
        }
    }

    /**
     * Map a try to a new try and flatten
     * @param mapper A map function that returns a try
     * @returns {Try<U>}
     */
    flatMap<F extends E, U>(mapper: (value: T) => Try<F, U>): Try<E, U> {
        if (this.isSuccess()) {
            return mapper(this.valueOrNull());
        } else {
            return <Try<E, U>><{}>this;
        }
    }

    /**
     * Retrieves the value and falls back to another try
     * @param other The fallback try accessor
     * @returns {*}
     */
    orElse<U extends T>(other: (err: E) => Try<E, U>): Try<Error, T> {
        if (this.isSuccess()) {
            return this;
        } else {
            return other(this.errorOrNull());
        }
    }

    /**
     * Returns an Optional of the successful value, or NONE if it is not defined.
     * @returns {Optional<T>}
     */
    value(): Optional<T> {
        return this.right();
    }

    /**
     * Prefer using Try#value().
     * @returns {T}
     */
    valueOrNull(): T {
        return this.rightOrNull();
    }

    /**
     * Access the value or throw the error
     */
    valueOrThrow(): T {
        if (this.isSuccess()) {
            return this.valueOrNull();
        } else {
            throw this.errorOrNull();
        }
    }

    /**
     * Retrieves the value and falls back to another value in case of error
     * @param other The fallback accessor
     * @returns {*}
     */
    valueOrElse<U extends T>(other: (err: E) => U): T {
        if (this.isSuccess()) {
            return this.valueOrNull();
        } else {
            return other(this.errorOrNull());
        }
    }
}

export = Try;
