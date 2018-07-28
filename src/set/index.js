const copy = require('../copy');
const isArray = require('../isArray');
const isEmpty = require('../isEmpty');
const isFunction = require('../isFunction');
const isNumber = require('../isNumber');
const isShape = require('../isShape');
const isString = require('../isString');
const isObject = require('../isObject');
const isUndefined = require('../isUndefined');
const toNumber = require('../toNumber');
const toString = require('../toString');

const getBase = (key, pointer) => {
  if (isNumber(key)) {
    if (isArray(pointer)) {
      return [...pointer];
    }
    return [];
  }
  if (isObject(pointer)) {
    return { ...pointer };
  }
  return {};
};

const getKeys = value => {
  const raw = (() => {
    if (isString(value)) {
      return value.match(/[^\{\[\]\."']+/g) || [];
    }
    if (isArray(value)) {
      return value;
    }
    return [value];
  })();
  return raw.map(item => {
    const num = item * 1;
    if (num === 0 || num > 0) {
      return num;
    }
    return item;
  });
};

const setArray = (target, comparer, setter) =>
  target.map((item, index) =>
    comparer(item, index, target)
      ? setter(item, index, target)
      : item
  );

const setArrayOrObject = (target, path, setter) => {
  const keys = getKeys(path);
  const result = getBase(keys[0], target);
  let ref = result;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      ref[key] = setter(ref[key]);
    } else {
      ref[key] = getBase(keys[index + 1], ref[key]);
      ref = ref[key];
    }
  });
  return result;
};

const setNumber = (target, comparer, setter) =>
  toNumber(
    toString(target)
      .split('')
      .map((item, index) =>
        comparer(toNumber(item), index, target)
          ? setter(toNumber(item), index, target)
          : item
      )
      .join(''),
  );

const setString = (target, comparer, setter) =>
  target
    .split('')
    .map((item, index) =>
      comparer(item, index, target)
        ? setter(item, index, target)
        : item
    )
    .join('');

module.exports = (target, comparer, setter) => {
  if (isUndefined(comparer) && isUndefined(setter)) {
    return target;
  }
  const setterFn = isFunction(setter)
    ? setter
    : () => setter;
  if (
    isEmpty(target)
    || isObject(target)
    || (isArray(target) && (isString(comparer) || isArray(comparer)))
  ) {
    return setArrayOrObject(target, comparer, setterFn);
  }
  const comparerFn = (() => {
    if (isFunction(comparer)) {
      return comparer;
    }
    if (isNumber(comparer) && !isNumber(target)) {
      return (item, index) => index === comparer;
    }
    return item => item === comparer;
  })();
  if (isString(target)) {
    return setString(target, comparerFn, setterFn);
  }
  if (isNumber(target)) {
    return setNumber(target, comparerFn, setterFn);
  }
  if (isArray(target)) {
    return setArray(target, comparerFn, setterFn);
  }
  return target;
};