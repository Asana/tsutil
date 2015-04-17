/**
 * There can be only one.
 *
 * Useful for when you want a type of which there is guaranteed to ever only be
 * one value. Examples include: indicating success or using it as a sentinel.
 * null also fills this role, except you cannot refer to the Null type.
 */
class Unit {
    // Public for tests.
    static _instance: Unit;

    /**
     * instance returns the single Unit value.
     */
    public static instance(): Unit {
        return this._instance || new Unit();
    }

    /* tslint:disable no-unused-variable */
    // For nominal type safety.
    private _isUnit: Unit;
    /* tslint:enable no-unused-variable */

    /**
     * While Unit's constructor will still guarantee that it will not create
     * duplicate values, you should prefer to call Unit.instance() instead,
     * since its name captures the semantics of this behavior better.
     */
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
