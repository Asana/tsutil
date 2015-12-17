import Optional = require("./optional");

/**
 * Where possible, mutates and returns the same map.
 * Only supports string keys.
 */
class MutableMap<K extends String, V> {
    private _data: {[key: string]: V};

    constructor(object: Object = {}) {
        this._data = <any>object;
    }

    clear(): MutableMap<K, V> {
        this._data = {};
        return this;
    }

    delete(key: K): MutableMap<K, V> {
        delete this._data[<any>key];
        return this;
    }

    filter(predicate: (value: V, key: string, map: MutableMap<K, V>) => boolean): MutableMap<K, V> {
        this.forEach((value, key, map) => {
            if (!predicate(value, key, map)) {
                this.delete(<any>key);
            }
        });
        return this;
    }

    forEach(sideEffect: (value: V, key: string, map: MutableMap<K, V>) => any): number {
        var keys = this.keys();
        for (var i = 0; i < keys.length; ) {
            var key = keys[i];
            i++;
            var continu = sideEffect(this._data[key], key, this);
            if (continu === false) {
                break;
            }
        }
        return i;
    }

    every(predicate: (value: V, key: string, map: MutableMap<K, V>) => boolean): boolean {
        var keys = this.keys();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!predicate(this._data[key], key, this)) {
                return false;
            }
        }
        return true;
    }

    get(key: K): Optional<V> {
        return new Optional(this._data[<any>key]);
    }

    getOrElse<W extends V>(key: K, fallback: () => W): V {
        if (this.has(key)) {
            return this._data[<any>key];
        } else {
            return fallback();
        }
    }

    getOrNull(key: K): V {
        if (this.has(key)) {
            return this._data[<any>key];
        } else {
            return null;
        }
    }

    getOrSet(key: K, setter: () => V): [V, MutableMap<K, V>] {
        if (this.has(key)) {
            return [this._data[<any>key], this];
        } else {
            var value = setter();
            return [value, this.set(key, value)];
        }
    }

    getOrThrow(key: K): V {
        if (this.has(key)) {
            return this._data[<any>key];
        } else {
            throw new Error("MutableMap#getOrThrow(): Key not found " + key);
        }
    }

    has(key: K): boolean {
        return this._data.hasOwnProperty(<any>key);
    }

    isEmpty(): boolean {
        return this.size() === 0;
    }

    keys(): Array<string> {
        return Object.keys(this._data);
    }

    map<M>(mapper: (value: V, key: string, map: MutableMap<K, V>) => M): MutableMap<K, M> {
        var mapped = new MutableMap<K, M>();
        this.forEach((value, key, map) => {
            mapped.set(<any>key, mapper(value, key, map));
        });
        return mapped;
    }

    mapEntries<KM extends String, VM>(mapper: (entry: [string, V], index: number, map: MutableMap<K, V>) => [KM, VM]): MutableMap<KM, VM> {
        var mapped = new MutableMap<KM, VM>();
        var i = 0;
        this.forEach((value, key, map) => {
            var entry = mapper([key, value], i, map);
            mapped.set(<any>entry[0], entry[1]);
            i++;
        });
        return mapped;
    }

    mapKeys<M extends String>(mapper: (key: string, value: V, map: MutableMap<K, V>) => M): MutableMap<M, V> {
        var mapped = new MutableMap<M, V>();
        this.forEach((value, key, map) => {
            mapped.set(mapper(key, value, map), value);
        });
        return mapped;
    }

    reduce<R>(reducer: (reduction: R, value: V, key: string, map: MutableMap<K, V>) => R, initial: R): R {
        var reduction = initial;
        this.forEach((value, key, map) => {
            reduction = reducer(reduction, value, key, map);
        });
        return reduction;
    }

    set(key: K, value: V): MutableMap<K, V> {
        this._data[<any>key] = value;
        return this;
    }

    size(): number {
        return this.keys().length;
    }

    some(predicate: (value: V, key: string, map: MutableMap<K, V>) => boolean): boolean {
        var keys = this.keys();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (predicate(this._data[key], key, this)) {
                return true;
            }
        }
        return false;
    }

    values(): Array<V> {
        return this.reduce<Array<V>>((values, value) => {
            values.push(value);
            return values;
        }, []);
    }
}

export = MutableMap;
