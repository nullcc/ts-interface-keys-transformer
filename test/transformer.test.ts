import { keys } from '../src/index';
import { X } from './interface';

describe('Test transformer.', () => {
  test('Should get keys of interface 1.', () => {
    interface Foo {
      a: string;
      b?: number;
      c: boolean;
      d: Function;
      e: object;
      f: any;
      g: null;
      h: keyof {};
      i?: number | null;
      j: number[];
      k: string[] | null;
      l: {
        a: string;
        b: number;
      };
      m: Bar;
      n: X;
      o: T;
      p: Bar | Baz;
      q: Bar & Baz;
    }
    interface Bar {
      a: number;
      b: boolean;
      c: Baz;
    }
    interface Baz {
      a: Function;
      b: number;
    }
    type T = {
      a: number[];
      b: string;
    }
    expect(keys<Foo>()).toMatchObject([
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

  test('Should get keys of interface 2.', () => {
    interface Foo {
      a: string;
      b: number;
      c: boolean;
    }
    interface Bar {
      a: string;
      b: number;
    }
    expect(keys<Foo | Bar>()).toMatchObject([
      { name: 'a', optional: false },
      { name: 'b', optional: false }
    ]);
  });

  test('Should get keys of interface 3.', () => {
    interface Foo {
      a: string;
      b: number;
      c: boolean;
    }
    interface Bar {
      a: string;
      b: number;
      d: {
        a: number;
        b?: string;
      }
    }
    expect(keys<Foo & Bar>()).toMatchObject([
      { name: 'a', optional: false },
      { name: 'b', optional: false },
      { name: 'c', optional: false },
      { name: 'd', optional: false },
      { name: 'd.a', optional: false },
      { name: 'd.b', optional: true }
    ]);
  });

  test('Should get keys of interface 4.', () => {
    expect(keys<X>()).toMatchObject([
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
