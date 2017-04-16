function serialGen(generator) {
  var gen = generator();

  if (typeof Promise !== 'function') {
    throw Error('Maybe your environment don\'t support Promise.');
  }

  if (typeof gen.next !== 'function') {
    throw Error('You must provide the Generator function.');
  }

  function process(iteratorObj) {
    var done = iteratorObj.done;
    var value = iteratorObj.value;
    var promiseKeys;
    var valArr;

    if (done) return Promise.resolve(value);

    // yield an array
    if (value.constructor.name === 'Array') {
      return Promise.all(value);
    }

    // yield Promise within object
    if (value.constructor.name === 'Object') {
      promiseKeys = [];
      valArr = Object.keys(value).map(function (v) {
        promiseKeys.push(v);
        return value[v];
      });

      return Promise.all(valArr).then(function (computedArr) {
        var resultObj = {};

        computedArr.forEach(function (computedVal, i) {
          resultObj[promiseKeys[i]] = computedVal;
        });
        return resultObj;
      });
    }

    // yield a Promise
    if (typeof value.then === 'function') {
      return value.then(function (result) {
        return process(gen.next(result));
      });
    }

    // otherwise
    return process(gen.next(value));
  }

  return process(gen.next());
}

module.exports = serialGen;
