const isObject = (value) =>
	value !== null && typeof value === "object";

const { isArray } = Array;

const PromiseObject = async (obj) => {

	const seen = new Map();

	const resolve = async (obj) => {

		obj = await obj;

		// Are you sending me a primitive? We don't do that here.
		if (!isObject(obj)) return obj;
		// Are you sending me an array? I'll resolve everything in it and give you a resolved array!
		if (isArray(obj)) return Promise.all(obj.map(each => resolve(each)));

		if (seen.has(obj)) return seen.get(obj);

		const ret = {};
		seen.set(obj, ret);

		for (const key in obj) {

			const curr = await obj[key];

			if (curr === obj) {

				ret[key] = ret;

			} else if (isObject(curr)) {
				
				if (seen.has(curr)) {

					ret[key] = seen.get(curr);

				} else if (isArray(curr)) {

					ret[key] = [];

					await Promise.all(curr.map(async x => {
						ret[key] = await resolve(x);
					}));

				} else {

					ret[key] = await resolve(curr);
					seen.set(curr, ret[key]);

				}

			} else {

				ret[key] = await obj[key];

			}
		}

		return ret;
	};

	const ret = await resolve(obj);

	return ret;
};

module.exports = PromiseObject;
