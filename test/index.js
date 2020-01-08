const path = require('path');
const compile = require('../compile').default;

compile([path.join(__dirname, './transformer.test.ts')]);
