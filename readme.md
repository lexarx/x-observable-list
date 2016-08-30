# Observable list

Observable list is a JavaScript library providing a list implementation
with change notifications.

## Examples

```js
var ObservableList = require('x-observable-list');

var list = new ObservableList([1, 2]);
list.changed.addListener(function(index, oldElements, newElements) {
	// index = 2, oldElements = [], newElements = [3]
});
list.add(3);
```

## Installation

```sh
npm install --save x-observable-list
```