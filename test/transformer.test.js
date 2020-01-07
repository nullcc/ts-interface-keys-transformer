"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../src/index");
describe('Test transformer.', function () {
    test('Should get keys of interface 1.', function () {
        expect([{"name":"a","optional":false}, {"name":"b","optional":true}, {"name":"c","optional":false}, {"name":"d","optional":false}, {"name":"e","optional":false}, {"name":"f","optional":false}, {"name":"g","optional":false}, {"name":"h","optional":false}, {"name":"i","optional":true}, {"name":"j","optional":false}, {"name":"k","optional":false}, {"name":"l","optional":false}, {"name":"l.a","optional":false}, {"name":"l.b","optional":false}, {"name":"m","optional":false}, {"name":"n","optional":false}, {"name":"n.a","optional":false}, {"name":"n.b","optional":false}, {"name":"n.c","optional":false}, {"name":"n.c.a","optional":false}, {"name":"n.c.b","optional":false}, {"name":"n.c.c","optional":false}, {"name":"n.c.c.a","optional":false}, {"name":"n.c.c.b","optional":false}, {"name":"n.c.c.c","optional":false}, {"name":"o","optional":false}, {"name":"p","optional":false}, {"name":"q","optional":false}]).toMatchObject([
            { name: 'a', optional: false },
            { name: 'b', optional: true },
            { name: 'c', optional: false },
            { name: 'd', optional: false },
            { name: 'e', optional: false },
            { name: 'f', optional: false },
            { name: 'g', optional: false },
            { name: 'h', optional: false },
            { name: 'i', optional: true },
            { name: 'j', optional: false },
            { name: 'k', optional: false },
            { name: 'l', optional: false },
            { name: 'l.a', optional: false },
            { name: 'l.b', optional: false },
            { name: 'm', optional: false },
            { name: 'n', optional: false },
            { name: 'n.a', optional: false },
            { name: 'n.b', optional: false },
            { name: 'n.c', optional: false },
            { name: 'n.c.a', optional: false },
            { name: 'n.c.b', optional: false },
            { name: 'n.c.c', optional: false },
            { name: 'n.c.c.a', optional: false },
            { name: 'n.c.c.b', optional: false },
            { name: 'n.c.c.c', optional: false },
            { name: 'o', optional: false },
            { name: 'p', optional: false },
            { name: 'q', optional: false }
        ]);
    });
    test('Should get keys of interface 2.', function () {
        expect([{"name":"a","optional":false}, {"name":"b","optional":false}]).toMatchObject([
            { name: 'a', optional: false },
            { name: 'b', optional: false }
        ]);
    });
    test('Should get keys of interface 3.', function () {
        expect([{"name":"a","optional":false}, {"name":"b","optional":false}, {"name":"c","optional":false}, {"name":"d","optional":false}, {"name":"d.a","optional":false}, {"name":"d.b","optional":true}]).toMatchObject([
            { name: 'a', optional: false },
            { name: 'b', optional: false },
            { name: 'c', optional: false },
            { name: 'd', optional: false },
            { name: 'd.a', optional: false },
            { name: 'd.b', optional: true }
        ]);
    });
    test('Should get keys of interface 4.', function () {
        expect([{"name":"a","optional":false}, {"name":"b","optional":false}, {"name":"c","optional":false}, {"name":"c.a","optional":false}, {"name":"c.b","optional":false}, {"name":"c.c","optional":false}, {"name":"c.c.a","optional":false}, {"name":"c.c.b","optional":false}, {"name":"c.c.c","optional":false}]).toMatchObject([
            { name: 'a', optional: false },
            { name: 'b', optional: false },
            { name: 'c', optional: false },
            { name: 'c.a', optional: false },
            { name: 'c.b', optional: false },
            { name: 'c.c', optional: false },
            { name: 'c.c.a', optional: false },
            { name: 'c.c.b', optional: false },
            { name: 'c.c.c', optional: false }
        ]);
    });
});
