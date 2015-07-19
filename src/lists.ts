/**
 * find([1,2,3,4,5], (x) => x === 3);
 *
 * @param {Array<T>} list
 * @param {(x: T) => boolean} predicate
 * @param {Object} thisArg?
 * @returns {T?}
 */
export function find<T>(
    list: T[],
    predicate: (x: T, index: number, list: T[]) => boolean,
    thisArg?: {}): T {

    var length = list.length;
    var value: T;
    for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
            return value;
        }
    }
    return undefined;
}

/**
 * Whether the list includes the given element
 * @param {Array<T>} list
 * @param element {T}
 * @returns {boolean} True iff the element passed in equals() any element
 *     that can be iterated over.
 */
export function includes<T>(list: T[], element: T): boolean {
    return -1 !== list.indexOf(element);
}

/**
 * Whether the list is empty
 * @param {Array<T>} list
 * @returns {boolean} True iff the iterable has no elements to iterate over.
 */
export function isEmpty<T>(list: T[]): boolean {
    return list.length === 0;
}
