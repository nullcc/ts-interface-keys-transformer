const path = require('path');
const compile = require('../lib/compile').default;

compile([path.join(__dirname, './transformer.test.ts')]);
