var Event = require('x-event');

var emptyArray = [];

/**
 * @class ObservableList<T>
 * @extends List
 * @param {Array<T>} [elements]
 */
function ObservableList(elements) {
	this.changed = new Event();
	this.elements = [];
	if (elements !== undefined) {
		this.setElements(elements);
	}
}

var prototype = {
	/**
	 * @param {T} element
	 */
	add: function(element) {
		var index = this.elements.length;
		this.elements.push(element);
		this.changed.emit(index, emptyArray, [element]);
	},

	/**
	 * @param {Array<T>} elements
	 */
	addAll: function(elements) {
		if (elements.length > 0) {
			var index = this.elements.length;
			this.elements = this.elements.concat(elements);
			this.changed.emit(index, emptyArray, elements);
		}
	},

	/**
	 * @param {Number} index
	 * @param {T} element
	 */
	insert: function(index, element) {
		if (index < 0 || index > this.elements.length) {
			throw new Error('Index out of bounds.');
		}
		this.elements.splice(index, 0, element);
		this.changed.emit(index, emptyArray, [element]);
	},

	/**
	 * @param {Number} index
	 * @param {Array<T>} elements
	 */
	insertAll: function(index, elements) {
		if (index < 0 || index > this.elements.length) {
			throw new Error('Index out of bounds.');
		}
		if (elements.length > 0) {
			var args = elements.slice();
			args.unshift(index, 0);
			this.elements.splice.apply(this.elements, args);
			this.changed.emit(index, emptyArray, elements);
		}
	},

	/**
	 * @param {T} element
	 * @returns {Boolean}
	 */
	remove: function(element) {
		var index = this.indexOf(element);
		if (index !== -1) {
			var removedElement = this.elements[index];
			this.elements.splice(index, 1);
			this.changed.emit(index, [removedElement], emptyArray);
			return true;
		}
		return false;
	},

	/**
	 * @param {T} element
	 * @returns {Boolean}
	 */
	removeLast: function(element) {
		var index = this.lastIndexOf(element);
		if (index !== -1) {
			var removedElement = this.elements[index];
			this.elements.splice(index, 1);
			this.changed.emit(index, [removedElement], emptyArray);
			return true;
		}
		return false;
	},

	/**
	 * @param {Number} index
	 * @returns {Array<T>}
	 */
	removeAt: function(index) {
		if (index < 0 || index >= this.elements.length) {
			throw new Error('Index out of bounds.');
		}
		var removedElement = this.elements[index];
		this.elements.splice(index, 1);
		this.changed.emit(index, [removedElement], emptyArray);
		return removedElement;
	},

	/**
	 * @param {Number} index
	 * @param {Number} count
	 * @returns {Array<T>}
	 */
	removeRange: function(index, count) {
		if (index < 0 || count < 0 || index + count > this.elements.length) {
			throw new Error('Index out of bounds.');
		}
		if (count > 0) {
			var removedElements = this.elements.splice(index, count);
			this.changed.emit(index, removedElements, emptyArray);
			return removedElements;
		}
		return emptyArray;
	},

	/**
	 * @returns {Array<T>}
	 */
	clear: function() {
		if (this.elements.length > 0) {
			var removedElements = this.elements;
			this.elements = [];
			this.changed.emit(0, removedElements, emptyArray);
			return removedElements;
		}
		return emptyArray;
	},

	/**
	 * @param {Number} index
	 * @param {T} element
	 * @returns {T}
	 */
	set: function(index, element) {
		if (index < 0 || index >= this.elements.length) {
			throw new Error('Index out of bounds.');
		}
		var removedElement = this.elements[index];
		this.elements[index] = element;
		this.changed.emit(index, [removedElement], [element]);
		return removedElement;
	},

	/**
	 * @param {Number} index
	 * @param {Number} count
	 * @param {Array<T>} elements
	 * @returns {Array<T>}
	 */
	replaceRange: function(index, count, elements) {
		if (index < 0 || count < 0 || index + count > this.elements.length) {
			throw new Error('Index out of bounds.');
		}
		if (count > 0 || elements.length > 0) {
			var args = [index, count].concat(elements);
			var removedElements = this.elements.splice.apply(this.elements, args);
			this.changed.emit(index, removedElements, elements);
			return removedElements;
		}
		return emptyArray;
	},

	/**
	 * @param {Array<T>} elements
	 * @returns {Array<T>}
	 */
	setElements: function(elements) {
		if (this.elements.length > 0 || elements.length > 0) {
			var removedElements = this.elements;
			this.elements = elements.slice();
			this.changed.emit(0, removedElements, elements);
			return removedElements;
		}
		return emptyArray;
	},

	/**
	 * @param {T} element
	 * @returns {Boolean}
	 */
	contains: function(element) {
		return this.indexOf(element) !== -1;
	},

	/**
	 * @param {T} element
	 * @returns {Number}
	 */
	indexOf: function(element) {
		for (var i = 0; i < this.elements.length; i++) {
			if (this.elements[i] === element) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * @param {T} element
	 * @returns {Number}
	 */
	lastIndexOf: function(element) {
		for (var i = this.elements.length - 1; i >= 0; i--) {
			if (this.elements[i] === element) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * @param {Number} index
	 * @returns {T}
	 */
	get: function(index) {
		if (index < 0 || index >= this.elements.length) {
			throw new Error('Index out of bounds.');
		}
		return this.elements[index];
	},

	/**
	 * @param {Number} index
	 * @param {Number} count
	 * @returns {Array<T>}
	 */
	getRange: function(index, count) {
		if (index < 0 || index >= this.elements.length || index + count > this.elements.length) {
			throw new Error('Index out of bounds.');
		}
		return this.elements.slice(index, index + count);
	},

	/**
	 * @returns {Array<T>}
	 */
	toArray: function() {
		return this.elements.slice();
	},

	/**
	 * @param {Function} iterator
	 * @param {*} [context]
	 */
	forEach: function(iterator, context) {
		for (var i = 0; i < this.elements.length; i++) {
			iterator.call(context, this.elements[i], i);
		}
	},

	/**
	 * @param {Function} iterator
	 * @param {*} [context]
	 * @returns {Boolean}
	 */
	every: function(iterator, context) {
		for (var i = 0; i < this.elements.length; i++) {
			var value = iterator.call(context, this.elements[i], i);
			if (!value) {
				return false;
			}
		}
		return true;
	},

	/**
	 * @param {Function} iterator
	 * @param {*} [context]
	 * @returns {T}
	 */
	find: function(iterator, context) {
		for (var i = 0; i < this.elements.length; i++) {
			var value = iterator.call(context, this.elements[i], i);
			if (value) {
				return this.elements[i];
			}
		}
	},

	/**
	 * @param {Function} iterator
	 * @param {*} [context]
	 * @returns {T}
	 */
	findLast: function(iterator, context) {
		for (var i = this.elements.length - 1; i >= 0; i--) {
			var value = iterator.call(context, this.elements[i], i);
			if (value) {
				return this.elements[i];
			}
		}
	},

	/**
	 * @param {Function} iterator
	 * @param {*} [context]
	 * @returns {Number}
	 */
	findIndex: function(iterator, context) {
		for (var i = 0; i < this.elements.length; i++) {
			var value = iterator.call(context, this.elements[i], i);
			if (value) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * @param {Function} filter
	 * @param {*} [context]
	 * @returns {Array<T>}
	 */
	filter: function(filter, context) {
		var filteredElements = [];
		for (var i = 0; i < this.elements.length; i++) {
			var element = this.elements[i];
			var value = filter.call(context, element, i);
			if (value) {
				filteredElements.push(element);
			}
		}
		return filteredElements;
	},

	/**
	 * @returns {T}
	 */
	first: function() {
		return this.elements.length > 0 ? this.elements[0] : undefined;
	},

	/**
	 * @returns {T}
	 */
	last: function() {
		return this.elements.length > 0 ? this.elements[this.elements.length - 1] : undefined;
	},

	/**
	 * @param {Function} iterator
	 * @param {*} [context]
	 * @returns {Array}
	 */
	map: function(iterator, context) {
		var values = [];
		for (var i = 0; i < this.elements.length; i++) {
			var value = iterator.call(context, this.elements[i], i);
			values.push(value);
		}
		return values;
	},

	/**
	 * @param {Function} callback
	 * @param {*} initialValue
	 * @param {*} [context]
	 * @returns {*}
	 */
	reduce: function(callback, initialValue, context) {
		var value = initialValue;
		for (var i = 0; i < this.elements.length; i++) {
			value = callback.call(context, value, this.elements[i], i);
		}
		return value;
	},

	/**
	 * @returns {Number}
	 */
	size: function() {
		return this.elements.length;
	},

	/**
	 * @returns {Boolean}
	 */
	isEmpty: function() {
		return this.elements.length === 0;
	}
};

prototype.each = prototype.forEach;
prototype.includes = prototype.contains;

ObservableList.prototype = prototype;

module.exports = ObservableList;