"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
describe('Test transformer.', function () {
    test('Should get keys of interface 1.', function () {
        expect([{"name":"a","modifiers":[],"optional":false,"type":"string"}, {"name":"b","modifiers":[],"optional":true,"type":"number"}, {"name":"c","modifiers":[],"optional":false,"type":"boolean"}, {"name":"d","modifiers":[],"optional":false,"type":"Function"}, {"name":"e","modifiers":[],"optional":false,"type":"unknown"}, {"name":"f","modifiers":[],"optional":false,"type":"any"}, {"name":"g","modifiers":[],"optional":false,"type":"unknown"}, {"name":"h","modifiers":[],"optional":false,"type":"unknown"}, {"name":"i","modifiers":[],"optional":true,"type":["number","unknown"]}, {"name":"j","modifiers":[],"optional":false,"type":"array","elementType":"number"}, {"name":"k","modifiers":[],"optional":false,"type":["array","unknown"]}, {"name":"l","modifiers":[],"optional":false,"type":"object"}, {"name":"l.a","modifiers":[],"optional":false,"type":"string"}, {"name":"l.b","modifiers":[],"optional":false,"type":"number"}, {"name":"m","modifiers":[],"optional":false,"type":"Bar"}, {"name":"n","modifiers":[],"optional":false,"type":"X"}, {"name":"n.a","modifiers":[],"optional":false,"type":"number"}, {"name":"n.b","modifiers":[],"optional":false,"type":"string"}, {"name":"n.c","modifiers":[],"optional":false,"type":"Y"}, {"name":"n.c.a","modifiers":[],"optional":false,"type":"number"}, {"name":"n.c.b","modifiers":[],"optional":false,"type":"string"}, {"name":"n.c.c","modifiers":[],"optional":false,"type":"Z"}, {"name":"n.c.c.a","modifiers":[],"optional":false,"type":"number"}, {"name":"n.c.c.b","modifiers":[],"optional":false,"type":"string"}, {"name":"n.c.c.c","modifiers":[],"optional":false,"type":"any"}, {"name":"o","modifiers":[],"optional":false,"type":"T"}, {"name":"p","modifiers":[],"optional":false,"type":["Bar","Baz"]}, {"name":"q","modifiers":[],"optional":false,"type":["Bar","Baz"]}]).toMatchObject([
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
        expect([{"name":"a","modifiers":[],"optional":false,"type":"unknown"}, {"name":"b","modifiers":[],"optional":false,"type":"unknown"}]).toMatchObject([
            { name: 'a', optional: false },
            { name: 'b', optional: false }
        ]);
    });
    test('Should get keys of interface 3.', function () {
        expect([{"name":"a","modifiers":[],"optional":false,"type":"unknown"}, {"name":"b","modifiers":[],"optional":false,"type":"unknown"}, {"name":"c","modifiers":[],"optional":false,"type":"boolean"}, {"name":"d","modifiers":[],"optional":false,"type":"object"}, {"name":"d.a","modifiers":[],"optional":false,"type":"number"}, {"name":"d.b","modifiers":[],"optional":true,"type":"string"}]).toMatchObject([
            { name: 'a', optional: false },
            { name: 'b', optional: false },
            { name: 'c', optional: false },
            { name: 'd', optional: false },
            { name: 'd.a', optional: false },
            { name: 'd.b', optional: true }
        ]);
    });
    test('Should get keys of interface 4.', function () {
        expect([{"name":"a","modifiers":[],"optional":false,"type":"number"}, {"name":"b","modifiers":[],"optional":false,"type":"string"}, {"name":"c","modifiers":[],"optional":false,"type":"Y"}, {"name":"c.a","modifiers":[],"optional":false,"type":"number"}, {"name":"c.b","modifiers":[],"optional":false,"type":"string"}, {"name":"c.c","modifiers":[],"optional":false,"type":"Z"}, {"name":"c.c.a","modifiers":[],"optional":false,"type":"number"}, {"name":"c.c.b","modifiers":[],"optional":false,"type":"string"}, {"name":"c.c.c","modifiers":[],"optional":false,"type":"any"}]).toMatchObject([
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
    test('Should get keys of interface 5.', function () {
        var Bar = /** @class */ (function () {
            function Bar() {
            }
            return Bar;
        }());
        console.log(JSON.stringify([{"name":"a","modifiers":[],"optional":false,"type":"array","elementType":"string"}, {"name":"b","modifiers":["readonly"],"optional":false,"type":"array","elementKeys":[{"name":"b1","modifiers":["readonly"],"optional":false,"type":"string"},{"name":"b2","modifiers":[],"optional":false,"type":"number"},{"name":"b3","modifiers":[],"optional":false,"type":"object"},{"name":"b3.b31","modifiers":[],"optional":false,"type":"string"},{"name":"b3.b32","modifiers":[],"optional":false,"type":"string"}]}, {"name":"c","modifiers":[],"optional":false,"type":"number"}, {"name":"d","modifiers":[],"optional":false,"type":"boolean"}, {"name":"e","modifiers":[],"optional":false,"type":"Set"}, {"name":"f","modifiers":[],"optional":false,"type":"Symbol"}, {"name":"g","modifiers":[],"optional":false,"type":"Map"}, {"name":"h","modifiers":[],"optional":false,"type":"Bar"}, {"name":"i","modifiers":[],"optional":true,"type":"Function"}, {"name":"j","modifiers":[],"optional":false,"type":"Function"}], null, 4));
    });
});
