class Optional<T> {
    static NONE = new Optional<any>(null);

    private static _isEmpty(value: any): boolean {
        return typeof value === "undefined" || value === null;
    }

    private _value: T;

    constructor(value: T) {
        if (!Optional._isEmpty(Optional.NONE) && Optional._isEmpty(value)) {
            return Optional.NONE;
        }
        this._value = value;
        return this;
    }

    isEmpty(): boolean {
        return Optional._isEmpty(this._value);
    }

    isNonEmpty(): boolean {
        return !this.isEmpty();
    }

    filter(filterer: (value: T) => boolean): Optional<T> {
        if (this.isNonEmpty() && filterer(this._value)) {
            return this;
        }
        return Optional.NONE;
    }

    forEach(callback: (value: T) => any): void {
        if (this.isNonEmpty()) {
            callback(this._value);
        }
    }

    map<U>(mapper: (value: T) => U): Optional<U> {
        if (this.isNonEmpty()) {
            return new Optional<U>(mapper(this._value));
        }
        return Optional.NONE;
    }

    flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
        if (this.isNonEmpty()) {
            return mapper(this._value);
        }
        return Optional.NONE;
    }

    getOrThrow(): T {
        if (this.isEmpty()) {
            throw new Error("Called getOrThrow on an empty Optional");
        }
        return this._value;
    }

    getOrElse<U extends T>(other: () => U): T {
        if (this.isNonEmpty()) {
            return this._value;
        }
        return other();
    }

    orElse<U extends T>(other: () => Optional<U>): Optional<T> {
        if (this.isNonEmpty()) {
            return this;
        }
        return other();
    }
}

export = Optional;
