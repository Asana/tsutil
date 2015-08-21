import Set = require("./set");
import collections = require("./collections");

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

/**
 * Dedupes a list of lists, choosing the first occurrence of each element from
 * the first list it appears in
 */
export function dedupeLists<T>(listOfLists: T[][], hash: (obj: T) => string): T[][] {
    var all: Set = {};
    var resultList: T[][] = [];

    listOfLists.forEach((list) => {
        var results: T[] = [];

        list.forEach((obj) => {
            var key = hash(obj);
            if (collections.get(all, key).isEmpty()) {
                all[key] = true;
                results.push(obj);
            }
        });

        resultList.push(results);
    });

    return resultList;
}
