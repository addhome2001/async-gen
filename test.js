import ava from 'ava';
import asyncGen from './';

ava('yield pure Promise', t =>
  asyncGen(function* () {
    return yield Promise.resolve('promise');
  }).then((result) => {
    t.is(result, 'promise');
  }),
);

ava('yield primitives type', t =>
  asyncGen(function* () {
    return yield 'primitives';
  }).then((result) => {
    t.is(result, 'primitives');
  }),
);

ava('yield Function', t =>
  asyncGen(function* () {
    const fn = () => 'function';
    const result = yield fn;
    return result;
  }).then((result) => {
    t.deepEqual(result, 'function');
  }),
);

ava('yield Generator', t =>
  asyncGen(function* () {
    const gen = function* () {
      const result1 = yield 'generator1';
      const result2 = yield 'generator2';
      return [result1, result2];
    };
    return yield* gen();
  }).then((result) => {
    t.deepEqual(result, ['generator1', 'generator2']);
  }),
);

ava('yield Promise of array', t =>
  asyncGen(function* () {
    const result1 = yield Promise.resolve('array1');
    const result2 = yield Promise.resolve('array2');
    return [result1, result2];
  }).then((result) => {
    t.deepEqual(result, ['array1', 'array2']);
  }),
);

ava('yield Promise of array', t =>
  asyncGen(function* () {
    const a = Promise.resolve('array1');
    const b = Promise.resolve('array2');
    const c = Promise.resolve('array3');
    return yield [a, b, c];
  }).then((result) => {
    t.deepEqual(result, ['array1', 'array2', 'array3']);
  }),
);

ava('yield Promise of object', t =>
  asyncGen(function* () {
    yield {
      1: Promise.resolve('object1'),
      2: Promise.resolve('object2'),
    };
  }).then(result => t.deepEqual(result, { 1: 'object1', 2: 'object2' })),
);

ava('throw error when reject by Promise', t =>
  asyncGen(function* () {
    yield Promise.reject(new Error('boom'));
  }).catch(err => t.is(err.message, 'boom')),
);

ava('throw error if dose not receive a Generator function', (t) => {
  const fn = () => asyncGen(() => 'Throw an Error');
  const error = t.throws(() => {
    fn();
  }, Error);
  t.is(error.message, 'You must provide the Generator function.');
});
