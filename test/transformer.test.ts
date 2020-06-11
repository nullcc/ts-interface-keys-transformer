import { keys } from '../index';

describe('Test transformer.', () => {
  test('Should get keys of interface which contains simple key types.', () => {
    interface Foo {
      a: string;
      b: number;
      c: boolean;
      d: Function;
      e: any;
      f: object;
      g: null;
    }
    expect(keys<Foo>()).toMatchObject([
      {
        "name": "a",
        "modifiers": [],
        "optional": false,
        "type": "string"
      },
      {
        "name": "b",
        "modifiers": [],
        "optional": false,
        "type": "number"
      },
      {
        "name": "c",
        "modifiers": [],
        "optional": false,
        "type": "boolean"
      },
      {
        "name": "d",
        "modifiers": [],
        "optional": false,
        "type": "Function"
      },
      {
        "name": "e",
        "modifiers": [],
        "optional": false,
        "type": "any"
      },
      {
        "name": "f",
        "modifiers": [],
        "optional": false,
        "type": "object"
      },
      {
        "name": "g",
        "modifiers": [],
        "optional": false,
        "type": "null"
      }
    ]);
  });

  test('Should get keys of interface which contains nest key types.', () => {
    interface Foo {
      a: {
        a1: number;
        a2: string;
      };
      b: {
        b1: boolean;
        b2: {
          b21: string;
          b22: number;
        };
      };
    }
    expect(keys<Foo>()).toMatchObject([
      {
        "name": "a",
        "modifiers": [],
        "optional": false,
        "type": "object"
      },
      {
        "name": "a.a1",
        "modifiers": [],
        "optional": false,
        "type": "number"
      },
      {
        "name": "a.a2",
        "modifiers": [],
        "optional": false,
        "type": "string"
      },
      {
        "name": "b",
        "modifiers": [],
        "optional": false,
        "type": "object"
      },
      {
        "name": "b.b1",
        "modifiers": [],
        "optional": false,
        "type": "boolean"
      },
      {
        "name": "b.b2",
        "modifiers": [],
        "optional": false,
        "type": "object"
      },
      {
        "name": "b.b2.b21",
        "modifiers": [],
        "optional": false,
        "type": "string"
      },
      {
        "name": "b.b2.b22",
        "modifiers": [],
        "optional": false,
        "type": "number"
      }
    ]);
  });

  test('Should get keys of interface which contains keys with array type (element is primitive type).', () => {
    interface Foo {
      a: string[];
      b: number[];
      c: boolean[];
      d: Function[];
      e: any[];
      f: object[];
    }
    expect(keys<Foo>()).toMatchObject([
      {
        "name": "a",
        "modifiers": [],
        "optional": false,
        "type": "array",
        "elementType": "string"
      },
      {
        "name": "b",
        "modifiers": [],
        "optional": false,
        "type": "array",
        "elementType": "number"
      },
      {
        "name": "c",
        "modifiers": [],
        "optional": false,
        "type": "array",
        "elementType": "boolean"
      },
      {
        "name": "d",
        "modifiers": [],
        "optional": false,
        "type": "array",
        "elementType": "Function"
      },
      {
        "name": "e",
        "modifiers": [],
        "optional": false,
        "type": "array",
        "elementType": "any"
      },
      {
        "name": "f",
        "modifiers": [],
        "optional": false,
        "type": "array",
        "elementType": "object"
      }
    ]);
  });

  test('Should get keys of interface which contains keys modified by modifiers.', () => {
    interface Foo {
      readonly a: string;
    }
    expect(keys<Foo>()).toMatchObject([
      {
        "name": "a",
        "modifiers": [
          "readonly"
        ],
        "optional": false,
        "type": "string"
      }
    ]);
  });

  test('Should get keys of interface which contains keys with question token.', () => {
    interface Foo {
      a?: string;
    }
    expect(keys<Foo>()).toMatchObject([
      {
        "name": "a",
        "modifiers": [],
        "optional": true,
        "type": "string"
      }
    ]);
  });

  test('Should get keys of interface which contains keys with an intersection type 1.', () => {
    interface Foo {
      a: string;
    }
    interface Bar {
      b: string;
    }
    expect(keys<Foo & Bar>()).toMatchObject([
      {
        "name": "a",
        "modifiers": [],
        "optional": false,
        "type": "string"
      },
      {
        "name": "b",
        "modifiers": [],
        "optional": false,
        "type": "string"
      }
    ]);
  });

  test('Should get keys of interface which contains keys with an intersection type 2.', () => {
    interface Foo {
      a: string | number;
    }
    interface Bar {
      b: string;
    }
    expect(keys<Foo & Bar>()).toMatchObject([
      {
        "name": "a",
        "modifiers": [],
        "optional": false,
        "type": [
          "string",
          "number"
        ]
      },
      {
        "name": "b",
        "modifiers": [],
        "optional": false,
        "type": "string"
      }
    ]);
  });

  test('Should get keys of interface which contains keys with an union type 1.', () => {
    interface Foo {
      a: string;
    }
    interface Bar {
      a: string;
      b: string;
    }
    expect(keys<Foo | Bar>()).toMatchObject([
      {
        "name": "a",
        "modifiers": [],
        "optional": false,
        "type": "string"
      }
    ]);
  });

  test('Should get keys of interface which contains keys with an union type 2.', () => {
    interface Foo {
      a: string;
    }
    interface Bar {
      a: number;
      b: string;
    }
    expect(keys<Foo | Bar>()).toMatchObject([
      {
        "name": "a",
        "modifiers": [],
        "optional": false,
        "type": [
          "string",
          "number"
        ]
      }
    ]);
  });
});
