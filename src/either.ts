import Optional = require("./optional");

/**
 * Either wraps a left or right value, but not both.
 * To represent a computation that is an Error/Result, use Try.
 */
class Either<Left, Right> {
    private _left: Left = null;
    private _right: Right = null;

    /**
     * Returns an Either with the provided left value.
     * @param left
     * @returns {*}
     */
    static left<Left, Right>(left: Left): Either<Left, Right> {
        return new Either(left, null);
    }

    /**
     * Returns an Either with the provided right value.
     * @param right
     * @returns {*}
     */
    static right<Left, Right>(right: Right): Either<Left, Right> {
        return new Either(null, right);
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
        var leftDefined = typeof left !== "undefined" && left !== null;
        var rightDefined = typeof right !== "undefined" && right !== null;

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
        return this._left !== null;
    }

    /**
     * Whether right is defined.
     * @returns {*}
     */
    isRight(): boolean {
        return !this.isLeft();
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
     * @returns {*}
     */
    leftOrNull(): Left {
        return this._left;
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
     * @returns {*}
     */
    rightOrNull(): Right {
        return this._right;
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
