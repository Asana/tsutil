import Map = require("./map");
import Optional = require("./optional");

/**
 * Map Iterator interface
 */
export interface Iterator<T, K> {
    (value: T, key: string, map: Map<T>): K;
}

/**
 * Map Reducer interface
 */
export interface Reducer<T, K> {
    (previousValue: K, value: T, key: string, map: Map<T>): K;
}

/**
 * Gets a key from a map
 * @param  {Map<T>}      map The map to retrieve the key
 * @param  {string}      key The key for the map
 * @return {Optional<T>}     The optional value of the map
 */
export function get<T>(map: Map<T>, key: string): Optional<T> {
    return new Optional(map[key]);
}

/**
 * Iterates through a map
 * @param {Map<T>}           map      The map to iterate through
 * @param {Iterator<T, Any>} iterator The iteration callback
 */
export function forEach<T>(map: Map<T>, iterator: Iterator<T, any>): void {
    var keys = Object.keys(map);
    var length = keys.length;
    for (var i = 0; i < length; i++) {
        iterator(map[keys[i]], keys[i], map);
    }
}

/**
 * Whether every key, value pair in the map matches
 * @param  {Map<T>}               map    The map to iterate through
 * @param  {Iterator<T, boolean>} filter The filter callback
 * @return {boolean}                     Whether every key, value pair matches
 */
export function every<T>(map: Map<T>, filter: Iterator<T, boolean>): boolean {
    var everyMatch = true;
    forEach(map, (value, key, map) => {
        everyMatch = everyMatch && filter(value, key, map);
    });
    return everyMatch;
}

/**
 * Whether any key, value pair in the map matches
 * @param  {Map<T>}               map    The map to iterate through
 * @param  {Iterator<T, boolean>} filter The filter callback
 * @return {boolean}                     Whether any key, value pair matches
 */
export function some<T>(map: Map<T>, filter: Iterator<T, boolean>): boolean {
    var someMatch = false;
    forEach(map, (value, key, map) => {
        someMatch = someMatch || filter(value, key, map);
    });
    return someMatch;
}

/**
 * Filters the map
 * @param  {Map<T>}               map    The map to iterate through
 * @param  {Iterator<T, boolean>} filter The filter callback
 * @return {Map<T>}                      The filtered map
 */
export function filter<T>(map: Map<T>, filter: Iterator<T, boolean>): Map<T> {
    var filteredMap = <Map<T>>{};
    forEach(map, (value, key, map) => {
        if (filter(value, key, map)) {
            filteredMap[key] = value;
        }
    });
    return filteredMap;
}

/**
 * Transfroms the map
 * @param  {Map<T>}         map       The map to iterate through
 * @param  {Iterator<T, K>} transform The transform callback
 * @return {Map<K>}                   The transformed map
 */
export function map<T, K>(map: Map<T>, transform: Iterator<T, K>): Map<K> {
    var transformedMap = <Map<K>>{};
    forEach(map, (value, key, map) => {
        transformedMap[key] = transform(value, key, map);
    });
    return transformedMap;
}

/**
 * Reduces the map using the first key as the initial value
 * @param  {Map<T>}        map     The map to iterate through
 * @param  {Reducer<T, T>} reducer The reducer callback
 * @return {T}                     The reduced value
 */
export function fold<T>(map: Map<T>, reducer: Reducer<T, T>): T {
    var result: T = null;
    forEach(map, (value, key, map) => {
        if (result === null) {
            result = value;
        } else {
            result = reducer(result, value, key, map);
        }
    });
    return result;
}

/**
 * Reduces the map using the initial value passed in
 * @param  {Map<T>}        map          The map to iterate through
 * @param  {Reducer<T, K>} reducer      The reducer callback
 * @param  {K}             initialValue The starting value
 * @return {K}                          The reduced value
 */
export function reduce<T, K>(map: Map<T>, reducer: Reducer<T, K>, initialValue: K): K {
    var result: K = initialValue;
    forEach(map, (value, key, map) => {
        result = reducer(result, value, key, map);
    });
    return result;
}
