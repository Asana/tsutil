import Releasable = require("./releasable");

interface Handle<T> extends Releasable {
    value(): T;
}

export = Handle;
