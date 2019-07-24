const path = require('path');
const compile = require('../src/compile').default;

compile([path.join(__dirname, './transformer.test.ts')]);
