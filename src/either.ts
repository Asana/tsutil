import Optional = require("./optional");

/**
 * Either wraps a left or right value, but not both.
 * To represent a computation that is an Error/Result, use Try.
 */
class Either<Left, Right> {
    private _left: Left = undefined;
    private _right: Right = undefined;

    /**
     * Returns an Either with the provided left value.
     * @param left
     * @returns {*}
     */
    static left<Left, Right>(left: Left): Either<Left, Right> {
        return new Either(left, undefined);
    }

    /**
     * Returns an Either with the provided right value.
     * @param right
     * @returns {*}
     */
    static right<Left, Right>(right: Right): Either<Left, Right> {
        return new Either(undefined, right);
    }

    private static _isDefined(value: any): boolean {
        return typeof value !== "undefined";
    }

    /**
     * You must provide left xor right.
     *
     * That is one of left and right must be defined and not null,
     * but not both of them.
     * @param left
     * @param right
     */
    constructor(left: Left, right: Right) {
        var leftDefined = Either._isDefined(left);
        var rightDefined = Either._isDefined(right);

        if (!leftDefined && !rightDefined) {
            throw new Error("Either#constructor(): Left or right must be defined");
        } else if (leftDefined && rightDefined) {
            throw new Error("Either#constructor(): Left and right cannot both be defined");
        }

        if (leftDefined) {
            this._left = left;
        } else {
            this._right = right;
        }
    }

    /**
     * Calls and returns the result of onLeft on the left if it's defined,
     * otherwise calls and returns the result of onRight on the right.
     * @param onLeft
     * @param onRight
     * @returns {*}
     */
    fold<X>(onLeft: (left: Left) => X, onRight: (right: Right) => X): X {
        if (this.isLeft()) {
            return onLeft(this._left);
        } else {
            return onRight(this._right);
        }
    }

    /**
     * Whether left is defined.
     * @returns {*}
     */
    isLeft(): boolean {
        return Either._isDefined(this._left);
    }

    /**
     * Whether right is defined.
     * @returns {*}
     */
    isRight(): boolean {
        return Either._isDefined(this._right);
    }

    /**
     * Returns an Optional over left, or Optional.NONE if it is not defined.
     * @returns {*}
     */
    left(): Optional<Left> {
        return new Optional(this._left);
    }

    /**
     * Returns left or null if it is not defined.
     * Use of this method is discouraged. Prefer using use #left(), #fold(),
     * etc. instead.
     * @returns {*}
     */
    leftOrNull(): Left {
        if (this.isLeft()) {
            return this._left;
        } else {
            return null;
        }
    }

    /**
     * Returns an Optional over right, or Optional.NONE if it is not defined.
     * @returns {*}
     */
    right(): Optional<Right> {
        return new Optional(this._right);
    }

    /**
     * Returns right or null if it is not defined.
     * Use of this method is discouraged. Prefer using use #right(), #fold(),
     * etc. instead.
     * @returns {*}
     */
    rightOrNull(): Right {
        if (this.isRight()) {
            return this._right;
        } else {
            return null;
        }
    }

    /**
     * Returns a new Either whose right is this' left,
     * and whose left is this' right.
     * @returns {*}
     */
    swap(): Either<Right, Left> {
        return new Either(this._right, this._left);
    }
}

export = Either;
