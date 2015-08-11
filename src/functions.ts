/**
 * Returns the same value
 * @param value
 * @returns {T}
 */
export function identity<T>(value: T): T {
    return value;
}

/**
 * A type- and argument-agnostic function that returns null.
 * @param args
 * @returns {any}
 */
export function noop(...args: any[]): any {
    return undefined;
}
