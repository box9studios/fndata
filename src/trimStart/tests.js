import trimStart from './';

export default {
  'do not trim trailing whitespace': [
    'hello world  \n ',
    () => trimStart('    hello world  \n '),
  ],
};