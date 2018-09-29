import isFunction from 'src/isFunction';
import timer from './';

export default {
  'should return a cancel function': [
    true,
    () => isFunction(timer()),
  ],
  'cancel function should return null': [
    null,
    () => timer()(),
  ],
};