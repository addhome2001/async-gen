# async-gen

#### A Simple Implementation of Generator control flow utility with reference to [co](https://www.npmjs.com/package/co).

### Support
  - promises
  - functions
  - array
  - objects(shallow)
  - generators
  - generator functions

##### promises of array
```js
asyncGen(function* () {
  const a = Promise.resolve('array1');
  const b = Promise.resolve('array2');
  const c = Promise.resolve('array3');
  return yield [a, b, c];
}); // => ['array1', 'array2', 'array3']
```

##### promises of 'shallow' object
```js
asyncGen(function* () {
  yield {
    1: Promise.resolve('object1'),
    2: Promise.resolve('object2'),
  };
}); // => { 1: 'object1', 2: 'object2' }
```
