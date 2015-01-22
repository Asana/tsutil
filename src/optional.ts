/**
 * The Optional class is used to represent the possible existence of a value
 */
class Optional<T> {
    /**
     * NONE is a global singleton to represent the empty option
     * @type {Optional<any>}
     */
    static NONE = new Optional<any>(null);

    private static _isEmpty(value: any): boolean {
        return typeof value === "undefined" || value === null;
    }

    /**
     * Flattens an array of optionals by filtering out the empty optionals
     * @param optionals The list of optionals to flatten
     * @returns {T{]}
     */
    public static flatten<T>(optionals: Optional<T>[]): T[] {
        return optionals.reduce((acc, elem) => {
            elem.forEach((value: T) => {
                acc.push(value);
            });
            return acc;
        }, []);
    }

    private _value: T;

    /**
     * Create an option from the value
     * @param value
     * @returns {*}
     */
    constructor(value: T) {
        if (!Optional._isEmpty(Optional.NONE) && Optional._isEmpty(value)) {
            return Optional.NONE;
        }
        this._value = value;
        return this;
    }

    /**
     * Whether or not the option is empty
     * @returns {boolean}
     */
    isEmpty(): boolean {
        return Optional._isEmpty(this._value);
    }

    /**
     * Whether or not the option has a value
     * @returns {boolean}
     */
    isNonEmpty(): boolean {
        return !this.isEmpty();
    }

    /**
     * Return an option based on whether or not the value matches the filter
     * @param filterer A filter function to check the value against
     * @returns {*}
     */
    filter(filterer: (value: T) => boolean): Optional<T> {
        if (this.isNonEmpty() && filterer(this._value)) {
            return this;
        }
        return Optional.NONE;
    }

    /**
     * A side effect callback for accessing the value that will only be called if there is a value
     * @param callback The callback for the value
     */
    forEach(callback: (value: T) => any): void {
        if (this.isNonEmpty()) {
            callback(this._value);
        }
    }

    /**
     * Map an option to a new option
     * @param mapper A map function to create a new value
     * @returns {*}
     */
    map<U>(mapper: (value: T) => U): Optional<U> {
        if (this.isNonEmpty()) {
            return new Optional<U>(mapper(this._value));
        }
        return Optional.NONE;
    }

    /**
     * Map an option to a new option and flatten options
     * @param mapper A map function that returns an option
     * @returns {*}
     */
    flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
        if (this.isNonEmpty()) {
            return mapper(this._value);
        }
        return Optional.NONE;
    }

    /**
     * Retrieves the value and throws an error if the option is empty
     * @returns {T}
     */
    getOrThrow(): T {
        if (this.isEmpty()) {
            throw new Error("Called getOrThrow on an empty Optional");
        }
        return this._value;
    }

    /**
     * Retrieves the value and falls back to another value
     * @param other The fallback accessor
     * @returns {*}
     */
    getOrElse<U extends T>(other: () => U): T {
        if (this.isNonEmpty()) {
            return this._value;
        }
        return other();
    }

    /**
     * Retrieves the value and falls back to another option
     * @param other The fallback option accessor
     * @returns {*}
     */
    orElse<U extends T>(other: () => Optional<U>): Optional<T> {
        if (this.isNonEmpty()) {
            return this;
        }
        return other();
    }
}

export = Optional;
