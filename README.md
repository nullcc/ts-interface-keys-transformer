# ts-interface-keys-transformer

`ts-interface-keys-transformer` is inspired by [ts-transformer-keys](https://github.com/kimamula/ts-transformer-keys).
It uses a custom transformer to parse the keys in 'interface' and 'type' in compile stage in TypeScript 
which support nested keys and optionality.

## Usage

```bash
$ npm i -D typescript ttypescript ts-interface-keys-transformer
```

and then add following to "compilerOptions" field in tsconfig.json:

```json
"plugins": [
      { "transform": "ts-interface-keys-transformer/transformer" }
    ]
```

Use following command to run (assume index.js is the compiled file of index.ts):

```bash
$ ttsc -p tsconfig.json && node index.js
```

### Works With Simple Interface
```typescript
import { keys } from 'ts-interface-keys-transformer';

interface Foo {
  a: string;
  readonly b: number;
  c?: boolean;
}
// [ { name: 'a', modifiers: [], optional: false, type: 'string' },
//   { name: 'b', modifiers: [ 'readonly' ], optional: false, type: 'number' },
//   { name: 'c', modifiers: [], optional: true, type: 'boolean' } ]
console.log(keys<Foo>());
```

### Works With Complex Interface
```typescript
import { keys } from 'ts-interface-keys-transformer';

interface Foo {
  a: string;
  b: {
    b1: string;
    b2: number;
  },
  c: string[];
  d: Array<{
    d1: string;
    d2: number;
  }>;
}
// [ { "name": "a", "modifiers": [], "optional": false, "type": "string" },
//   { "name": "b", "modifiers": [], "optional": false, "type": "object" },
//   { "name": "b.b1", "modifiers": [], "optional": false, "type": "string" },
//   { "name": "b.b2", "modifiers": [], "optional": false, "type": "number" },
//   { "name": "c", "modifiers": [], "optional": false, "type": "array", "elementType": "string" },
//   { 
//     "name": "d",
//     "modifiers": [],
//     "optional": false,
//     "type": "Array",
//     "elementKeys": [
//       {
//         "name": "d1",
//         "modifiers": [],
//         "optional": false,
//         "type": "string"
//       },
//       {
//         "name": "d2",
//         "modifiers": [],
//         "optional": false,
//         "type": "number"
//       }
//     ]
//   } ]
console.log(keys<Foo>());
```

### Works With Intersection Type
```typescript
import { keys } from 'ts-interface-keys-transformer';

interface Foo {
  a: string;
}
interface Bar {
  b: string;
}
// [ { "name": "a", "modifiers": [], "optional": false, "type": "string" },
//   { "name": "b", "modifiers": [], "optional": false, "type": "string" } ]
console.log(keys<Foo & Bar>());
```

### Works With Union Type
```typescript
import { keys } from 'ts-interface-keys-transformer';

interface Foo {
  a: string;
}
interface Bar {
  a: string;
  b: string;
}
// [ { "name": "a", "modifiers": [], "optional": false, "type": "string"} ]
console.log(keys<Foo | Bar>());
```

See more test cases in [Tests](./test/transformer.test.ts)

## Build

```bash
npm run build
```

## Run Tests

```bash
npm test
```
