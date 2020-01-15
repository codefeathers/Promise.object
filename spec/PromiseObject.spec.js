'use strict';

const expect = require("chai").expect;
Promise.object = require('../index.js');

/* global describe it expect */
describe("Promise.object", () => {

	// it("Should resolve promises in a simple object", () => {
	// 	const test = {
	// 		foo: Promise.resolve(1),
	// 		bar: {
	// 			foobar: Promise.resolve(2),
	// 		},
	// 	};

	// 	const resolved = {
	// 		foo: 1,
	// 		bar: {
	// 			foobar: 2
	// 		},
	// 	};
	// 	return Promise.object(test)
	// 		.then(obj => expect(obj).to.deep.equal(resolved));
	// });

	it("Should resolve nested promises with circular references", () => {
		const test = {
			foo: Promise.resolve(1),
			bar: {
				foobar: Promise.resolve(2)
			},
			baz: [ 1, "two", Promise.resolve(3) ],
		};

		test.link1 = test;
		test.link2 = { link3: test };

		const resolved = {
			foo: 1,
			bar: {
				foobar: 2,
			},
			baz: [ 1, "two", 3 ],
		};

		resolved.link1 = resolved;
		resolved.link2 = { link3: resolved };

		return Promise.object(test)
			.then(obj => (console.log({obj}), expect(obj).to.deep.equal(resolved)));
	})

	// it("Should resolve deeply nested promises", () => {
	// 	const test = Promise.resolve({
	// 		foo: Promise.resolve({
	// 			bar: Promise.resolve(
	// 				Promise.resolve(5)
	// 			),
	// 		}),
	// 	});

	// 	const resolved = {
	// 		foo: {
	// 			bar: 5,
	// 		},
	// 	};

	// 	return Promise.object(test)
	// 		.then(obj => expect(obj).to.deep.equal(resolved));
	// });

	// it("Should resolve toplevel arrays", () => {
	// 	return Promise.object([
	// 		Promise.resolve(1),
	// 		2,
	// 		Promise.resolve(3)
	// 	]).then(obj => expect(obj).to.deep.equal([
	// 		1,
	// 		2,
	// 		3
	// 	]));
	// });

	// it("Should resolve cyclic arrays", () => {
	// 	const arr = [];
	// 	arr.push(arr);
	// 	arr.push(Promise.resolve(arr));
	// 	Promise.object(arr).then(arr => {
	// 		return expect(
	// 			arr[0] === arr && arr[1] === arr
	// 		).to.be.true;
	// 	});
	// });

})