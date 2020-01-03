# ts-interface-keys-transformer

`ts-interface-keys-transformer` is inspired by [ts-transformer-keys](https://github.com/kimamula/ts-transformer-keys).
It uses custom transformer to parse the keys in 'interface' and 'type' in compile stage in TypeScript 
which support nested keys and optionality.

## Usage

```bash
$ npm i ttypescript
$ npm i ts-interface-keys-transformer
```

then add following to "compilerOptions" field in tsconfig.json:

```json
"plugins": [
      { "transform": "ts-transformer-keys/transformer" }
    ]
```

### Nested interface
```typescript
import { keys } from 'ts-interface-keys-transformer';

interface Foo {
  a: string;
  b: number;
  c: Bar;
}

interface Bar {
  a: string;
  b: number;
}

// [
//   { name: 'a', optional: false },
//   { name: 'b', optional: false },
//   { name: 'c', optional: false },
//   { name: 'c.a', optional: false },
//   { name: 'c.b', optional: false },
//]
console.log(keys<Foo>());
```

### Nested type
```typescript
import { keys } from 'ts-interface-keys-transformer';

type Foo = {
  a: string;
  b: number;
  c: Bar;
}

type Bar = {
  d: string;
  e: number;
  f: boolean;
}

// [
//   { name: 'a', optional: false },
//   { name: 'b', optional: false },
//   { name: 'c', optional: false },
//   { name: 'c.d', optional: false },
//   { name: 'c.e', optional: false },
//   { name: 'c.f', optional: false },
//]
console.log(keys<Foo>());
```

### Mix interface and type
```typescript
import { keys } from 'ts-interface-keys-transformer';

interface Foo {
  a: string;
  b: number;
  c: Bar;
}

type Bar = {
  d: string;
  e: number;
  f: boolean;
}

// [
//   { name: 'a', optional: false },
//   { name: 'b', optional: false },
//   { name: 'c', optional: false },
//   { name: 'c.d', optional: false },
//   { name: 'c.e', optional: false },
//   { name: 'c.f', optional: false },
//]
console.log(keys<Foo>());
```

### Interface properties has question mark
```typescript
import { keys } from 'ts-interface-keys-transformer';

type Foo = {
  a?: string;
  b: number;
  c: Bar; 
}

interface Bar {
  d?: string;
  e?: number;
  f: boolean;
}

// [
//   { name: 'a', optional: true },
//   { name: 'b', optional: false },
//   { name: 'c', optional: false },
//   { name: 'c.d', optional: true },
//   { name: 'c.e', optional: true },
//   { name: 'c.f', optional: false },
//]
console.log(keys<Foo>());
```

## Run tests

```bash
npm test
```
