/**
 * Returns the same value
 * @param value
 * @returns {T}
 */
function identity<T>(value: T): T {
    return value;
}

export = identity;
