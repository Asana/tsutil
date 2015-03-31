/**
 * There can be only one.
 *
 * Useful for when you want a type of which there is guaranteed to ever only be
 * one value. Examples include: indicating success or using it as a sentinel.
 * null also fills this role, except you cannot refer to the Null type.
 */
class Unit {
    private static _instance: Unit;

    public static instance(): Unit {
        return this._instance || new Unit();
    }

    constructor() {
        if (typeof Unit._instance !== "undefined" && Unit._instance !== null) {
            return Unit._instance;
        } else {
            Unit._instance = this;
            return this;
        }
    }
}

export = Unit;
