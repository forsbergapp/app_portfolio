/**
 * @module apps/app8/src/functions/solver3/algorithm-shortener
 */

//import combiner from 'array-element-combiner';
const combiner = await import('./module/combiner/index.js');

/**
 * @name parallelMoves
 * @description parallelMoves
 * @constant
 */
const parallelMoves = {
	F: 'B',
	R: 'L',
	U: 'D'
};

/**
 * @name algorithmShortener
 * @description algorithmShortener
 * @param {[]|string} notations - The array of move notations.
 * @function
 * @param {*} notations
 * @returns {string}
 */
const algorithmShortener = notations => {
	if (typeof notations === 'string') {
		/**@ts-ignore */
		notations = notations.split(' ');
	}

	const options = {
		/**
		 * @name compare
		 * @param {*} a
		 * @param {*} b
		 * @returns {*}
		 */
		compare(a, b) {
			return a[0] === b[0];
		},
		/**
		 * @name combine
		 * @param {*} a
		 * @param {*} b
		 * @returns {*}
		 */
		combine(a, b) {
			const aDir = a.includes('2') ? 2 : (a.includes('prime') ? -1 : 1);
			const bDir = b.includes('2') ? 2 : (b.includes('prime') ? -1 : 1);

			let totalDir = aDir + bDir;

			if (totalDir === 4) totalDir = 0;
			if (totalDir === -2) totalDir = 2;
			if (totalDir === 3) totalDir = -1;

			if (totalDir === 0) {
				return '';
			}

			const dirString = totalDir === 2 ? '2' : (totalDir === -1 ? 'prime' : '');

			return `${a[0]}${dirString}`;
		},
		/**
		 * @name cancel
		 * @param {*} value
		 * @returns {*}
		 */
		cancel(value) {
			return value === '';
		},
		/**
		 * @name ignore
		 * @param {*} a
		 * @param {*} b
		 * @returns {*}
		 */
		ignore(a, b) {
			/**@ts-ignore */
			return (parallelMoves[a[0]] === b[0] || parallelMoves[b[0]] === a[0]);
		}
	};
	//return combiner(notations, options).join(' ');
	const Combiner = new combiner.Combiner(notations, options).run();
	return Combiner.join(' ');
};

export { algorithmShortener };
