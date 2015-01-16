/**
 * The Releasable represents a generic resource that can be released
 */
interface Releasable {
    /**
     * Releases the resource
     */
    release(): void;
}

export = Releasable;
