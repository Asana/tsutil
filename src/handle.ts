import Releasable = require("./releasable");

/**
 * Represent a releasable access to a value
 */
interface Handle<T> extends Releasable {
    /**
     * The value for the handle
     */
    value(): T;

    /**
     * Whether or not this handle has had release() called
     */
    isReleased(): boolean;
}

export = Handle;
