/**
 * @module apps/app8/src/functions/solver3/module/combiner
 */

/**
 * Copied from array-element-combiner
 * removed debug functionality
 */

/**
 * @name DEFAULTS
 * @cdescription DEFAULTS
 * @constant
 */
const DEFAULTS = {
	cancel() {
		return false;
	},
	ignore() {
		return false;
	}
};
/**
 * @name Combiner
 * @description Combiner
 * @class
 */
class Combiner {
	/**
	 * @param {*} input
	 * @param {*} options
	 */
	constructor(input, options) {
		this.options = Object.assign({}, DEFAULTS, options);

		this.input = input.slice();
		/**@ts-ignore */
		this.output = [];
	}
	/**
	 * @name run
	 * @description run
	 * @method
	 * @returns {*}
	 */
	run() {
		if (this.input.length <= 1) {
			return this.input;
		}
		/**@ts-ignore */
		this.temp = [this.input.shift()];

		while (this.temp.length > 0) {
			// find the first element that shouldn't be ignored
			let notIgnoredIdx, notIgnoredEl;

			if (this.temp.length === 1) {
				notIgnoredIdx = 0;
				notIgnoredEl = this.input[notIgnoredIdx];

				while (notIgnoredIdx < this.input.length && this.options.ignore(this.temp[0], notIgnoredEl)) {
					notIgnoredEl = this.input[++notIgnoredIdx];
				}

				if (notIgnoredIdx < this.input.length) {
					this.temp.push(notIgnoredEl);
				}
			}

			if (this.temp.length === 0) {
				break;
			}

			if (this.temp.length === 1) {
				this.output.push(this.temp.pop());
				this.populateTempForward();

				continue;
			}

			if (this.options.compare(this.temp[0], this.temp[1])) {
				// remove the combined element from the input array
				if (notIgnoredIdx !== undefined) {
					this.input.splice(notIgnoredIdx, 1);
				}
				/**@ts-ignore */
				const value = this.options.combine(this.temp[0], this.temp[1]);

				this.temp = this.options.cancel(value) ? [] : [value];

				this.populateTempBackward();
				if (this.temp.length === 0) {
					this.populateTempForward();
				}
			} else {
				this.output.push(this.temp.shift());

				// This keeps elements in order.
				// if (notIgnoredIdx === 0) {
				// 	this.input.splice(notIgnoredIdx, 1);
				// } else {
				// 	this.temp = this.input.splice(0, 1);
				// }

				if (notIgnoredIdx !== undefined) {
					if (notIgnoredIdx > 0) {
						this.temp = this.input.splice(0, 1);
					} else {
						this.input.splice(notIgnoredIdx, 1);
					}
				}
			}
		}

		return this.output;
	}
	/**
	 * @name populateTempBackward
	 * @description populateTempBackward
	 * @method
	 * @returns {*}
	 */
	populateTempBackward() {
		if (this.output.length > 0) {
			this.temp.unshift(this.output.pop());
		}
	}
	/**
	 * @name populateTempForward
	 * @description populateTempForward
	 * @method
	 * @returns {*}
	 */
	populateTempForward() {
		if (this.input.length > 0) {
			this.temp.push(this.input.shift());
		}
	}
}

export {Combiner};