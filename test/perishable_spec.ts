import chai = require("chai");
import tsutil = require("../src/index");
import sinon = require("sinon");

var assert = chai.assert;

describe("Perishable", () => {
    var VALUE = "asana";

    describe("constructor", () => {
        it("should create a perishable", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            assert.instanceOf(perishable, tsutil.Perishable);
        });
    });

    describe("value", () => {
        it("should return the value", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            assert.equal(perishable.value(), VALUE);
        });
    });

    describe("isStale", () => {
        it("should return false by default", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            assert.isFalse(perishable.isStale());
        });
    });

    describe("isUnused", () => {
        it("should be unused by default", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            assert.isTrue(perishable.isUnused());
        });
    });

    describe("createHandle", () => {
        it("should create a handle", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            var spy = sinon.spy();
            var handle = perishable.createHandle(spy);
            assert.equal(handle.value(), VALUE);
            sinon.assert.notCalled(spy);
        });

        it("should throw if stale", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            perishable.makeStale();
            assert.throws(() => {
                perishable.createHandle(null);
            }, "Cannot createHandle when stale");
        });
    });

    describe("makeStale", () => {
        it("should make the projection stale", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            perishable.makeStale();
            assert.isTrue(perishable.isStale());
        });

        it("should notify a handle", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            var spy = sinon.spy();
            perishable.createHandle(spy);
            perishable.makeStale();
            sinon.assert.calledOnce(spy);
        });

        it("should notify multiple handles", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            var first = sinon.spy();
            var second = sinon.spy();
            perishable.createHandle(first);
            perishable.createHandle(second);
            perishable.makeStale();
            sinon.assert.calledOnce(first);
            sinon.assert.calledOnce(second);
        });

        it("should handle a null handle", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            perishable.createHandle(null);
            perishable.makeStale();
        });

        it("should not notify a handle when stale", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            var spy = sinon.spy();
            perishable.createHandle(spy);
            perishable.makeStale();
            perishable.makeStale();
            sinon.assert.calledOnce(spy);
        });

        it("should not notify a released handle", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            var spy = sinon.spy();
            var handle = perishable.createHandle(spy);
            handle.release();
            perishable.makeStale();
            sinon.assert.notCalled(spy);
        });

        it("should not notify a released handle at the beginning of the list", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            var first = sinon.spy();
            var second = sinon.spy();
            perishable.createHandle(first).release();
            perishable.createHandle(second);
            perishable.makeStale();
            sinon.assert.notCalled(first);
            sinon.assert.calledOnce(second);
        });

        it("should not notify a released handle at the end of the list", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
            var first = sinon.spy();
            var second = sinon.spy();
            perishable.createHandle(first);
            perishable.createHandle(second).release();
            perishable.makeStale();
            sinon.assert.calledOnce(first);
            sinon.assert.notCalled(second);
        });

        it("should not notify a released handle in a list", () => {
            var perishable = new tsutil.Perishable(VALUE, null);
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
    });
});
