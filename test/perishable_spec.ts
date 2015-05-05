import chai = require("chai");
import tsutil = require("../src/index");
import sinon = require("sinon");

var assert = chai.assert;

describe("Perishable", () => {
    var VALUE = "asana";

    describe("constructor", () => {
        it("should create a perishable", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            assert.instanceOf(perishable, tsutil.Perishable);
        });

        it("should call onUnused", () => {
            var onUnused = sinon.spy();
            var perishable = new tsutil.Perishable(VALUE, onUnused, sinon.spy());
            perishable.createHandle(null).release();
            sinon.assert.calledOnce(onUnused);
        });

        it("should call onUnused every time", () => {
            var spy = sinon.spy();
            var perishable = new tsutil.Perishable(VALUE, spy, sinon.spy());
            perishable.createHandle(null).release();
            perishable.createHandle(null).release();
            sinon.assert.calledTwice(spy);
        });
    });

    describe("value", () => {
        it("should return the value", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            assert.equal(perishable.value(), VALUE);
        });
    });

    describe("isStale", () => {
        it("should return false by default", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            assert.isFalse(perishable.isStale());
        });
    });

    describe("isUnused", () => {
        it("should be unused by default", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            assert.isTrue(perishable.isUnused());
        });
    });

    describe("Handle", () => {
        it("should update isReleased() when release() is called", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            var handle = perishable.createHandle(null);
            assert(!handle.isReleased());
            handle.release();
            assert(handle.isReleased());
        });

        it("should assert if release() is called twice", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            var handle = perishable.createHandle(null);
            handle.release();
            assert.throws(() => {
                handle.release();
            }, /Only release a perishable node once/);
        });
    });

    describe("createHandle", () => {
        it("should create a handle", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            var spy = sinon.spy();
            var handle = perishable.createHandle(spy);
            assert.equal(handle.value(), VALUE);
            sinon.assert.notCalled(spy);
        });

        it("should throw if stale", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            perishable.makeStale();
            assert.throws(() => {
                perishable.createHandle(null);
            }, "Cannot createHandle when stale");
        });
    });

    describe("makeStale", () => {
        it("should make the projection stale", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            perishable.makeStale();
            assert.isTrue(perishable.isStale());
        });

        it("should notify a handle", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            var spy = sinon.spy();
            perishable.createHandle(spy);
            perishable.makeStale();
            sinon.assert.calledOnce(spy);
        });

        it("should notify multiple handles", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            var first = sinon.spy();
            var second = sinon.spy();
            perishable.createHandle(first);
            perishable.createHandle(second);
            perishable.makeStale();
            sinon.assert.calledOnce(first);
            sinon.assert.calledOnce(second);
        });

        it("should not notify a handle when stale", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            var spy = sinon.spy();
            perishable.createHandle(spy);
            perishable.makeStale();
            perishable.makeStale();
            sinon.assert.calledOnce(spy);
        });

        it("should not notify a released handle", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            var spy = sinon.spy();
            var handle = perishable.createHandle(spy);
            handle.release();
            perishable.makeStale();
            sinon.assert.notCalled(spy);
        });

        it("should not notify a released handle at the beginning of the list", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            var first = sinon.spy();
            var second = sinon.spy();
            perishable.createHandle(first).release();
            perishable.createHandle(second);
            perishable.makeStale();
            sinon.assert.notCalled(first);
            sinon.assert.calledOnce(second);
        });

        it("should not notify a released handle at the end of the list", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            var first = sinon.spy();
            var second = sinon.spy();
            perishable.createHandle(first);
            perishable.createHandle(second).release();
            perishable.makeStale();
            sinon.assert.calledOnce(first);
            sinon.assert.notCalled(second);
        });

        it("should not notify a released handle in a list", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            var first = sinon.spy();
            var second = sinon.spy();
            var third = sinon.spy();
            perishable.createHandle(first);
            var toRelease = perishable.createHandle(second);
            perishable.createHandle(third);
            toRelease.release();
            perishable.makeStale();
            sinon.assert.calledOnce(first);
            sinon.assert.notCalled(second);
            sinon.assert.calledOnce(third);
        });

        it("should still be used after makeStale", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            perishable.createHandle(sinon.spy());
            perishable.createHandle(sinon.spy());
            perishable.makeStale();
            assert.isFalse(perishable.isUnused());
        });

        it("should handle first release after correctly", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            var first = perishable.createHandle(sinon.spy());
            perishable.createHandle(sinon.spy());
            perishable.makeStale();
            first.release();
        });

        it("should handle second release after correctly", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            perishable.createHandle(sinon.spy());
            var second = perishable.createHandle(sinon.spy());
            perishable.makeStale();
            second.release();
        });

        it("should be stale once make stale is called", () => {
            var perishable = new tsutil.Perishable(VALUE, sinon.spy(), sinon.spy());
            perishable.createHandle(() => { assert.isTrue(perishable.isStale()); });
            perishable.createHandle(() => { assert.isTrue(perishable.isStale()); });
            perishable.makeStale();
        });

        it("should not call onUnused if it is already unused", () => {
            var spy = sinon.spy();
            var perishable = new tsutil.Perishable(VALUE, spy, sinon.spy());
            perishable.makeStale();
            sinon.assert.notCalled(spy);
        });

        it("should call onStale when becoming stale", () => {
            var onUnused = sinon.spy();
            var onStale = sinon.spy();
            var perishable = new tsutil.Perishable(VALUE, onUnused, onStale);
            perishable.makeStale();
            sinon.assert.notCalled(onUnused);
            sinon.assert.calledOnce(onStale);
        });

        it("should call onUnused once during a makeStale", () => {
            // Iff the makeStale() makes the perishable unused.
            var onUnused = sinon.spy();
            var perishable = new tsutil.Perishable(VALUE, onUnused, sinon.spy());

            var toRelease = perishable.createHandle(() => {
                toRelease.release();
            });
            perishable.makeStale();
            sinon.assert.calledOnce(onUnused);
        });

        it("should handle another release call during makeStale", () => {
            var onUnused = sinon.spy();
            var spy = sinon.spy();
            var perishable = new tsutil.Perishable(VALUE, onUnused, sinon.spy());
            var toRelease: tsutil.Releasable;
            perishable.createHandle(() => {
                toRelease.release();
            });
            toRelease = perishable.createHandle(spy);
            perishable.makeStale();
            sinon.assert.notCalled(onUnused);
            sinon.assert.calledOnce(spy);
        });
    });
});
