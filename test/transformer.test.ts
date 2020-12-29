import { keys } from '../index';
import { Foo } from './interface';

describe('Test transformer.', () => {
  test('Should get keys of interface which contains simple key types.', () => {
    interface Foo {
      /**
       * Note on parameter a
       * Note line 2
       * @description somethings
       * @returns somethings2
       */
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
        "type": "string",
        "title": "Note on parameter a,Note line 2",
        "args": { description: "somethings", returns: "somethings2" }
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

  test('Should get keys of interface which contains keys with array type (element has primitive type).', () => {
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

  test('Should get keys of interface which contains keys with array type (element has complex type).', () => {
    interface Foo {
      a: {
        a1: string;
        a2: number;
      }[];
      b: Array<{
        b1: number;
        b2: boolean;
        b3: string[];
        b4: Array<{
          b41: number;
          b42: string;
          b43: Array<{
            readonly b431: string;
          }>;
        }>;
      }>;
    }
    expect(keys<Foo>()).toMatchObject([
        {
          "name": "a",
          "modifiers": [],
          "optional": false,
          "type": "array",
          "elementKeys": [
            {
              "name": "a1",
              "modifiers": [],
              "optional": false,
              "type": "string"
            },
            {
              "name": "a2",
              "modifiers": [],
              "optional": false,
              "type": "number"
            }
          ]
        },
        {
          "name": "b",
          "modifiers": [],
          "optional": false,
          "type": "Array",
          "elementKeys": [
            {
              "name": "b1",
              "modifiers": [],
              "optional": false,
              "type": "number"
            },
            {
              "name": "b2",
              "modifiers": [],
              "optional": false,
              "type": "boolean"
            },
            {
              "name": "b3",
              "modifiers": [],
              "optional": false,
              "type": "array",
              "elementType": "string"
            },
            {
              "name": "b4",
              "modifiers": [],
              "optional": false,
              "type": "Array",
              "elementKeys": [
                {
                  "name": "b41",
                  "modifiers": [],
                  "optional": false,
                  "type": "number"
                },
                {
                  "name": "b42",
                  "modifiers": [],
                  "optional": false,
                  "type": "string"
                },
                {
                  "name": "b43",
                  "modifiers": [],
                  "optional": false,
                  "type": "Array",
                  "elementKeys": [
                    {
                      "name": "b431",
                      "modifiers": [
                        "readonly"
                      ],
                      "optional": false,
                      "type": "string"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    );
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

  test('Should get keys of interface which contains keys with an array type.', () => {
    expect(keys<Foo>()).toMatchObject( [
      {
        "name": "a",
        "modifiers": [],
        "optional": false,
        "type": "string"
      },
      {
        "name": "bar",
        "modifiers": [],
        "optional": false,
        "type": "Bar"
      },
      {
        "name": "bar.a",
        "modifiers": [],
        "optional": false,
        "type": "number"
      },
      {
        "name": "bar.b",
        "modifiers": [],
        "optional": false,
        "type": "string"
      },
      {
        "name": "bazArray1",
        "modifiers": [],
        "optional": false,
        "type": "Array",
        "elementKeys": [
          {
            "name": "a",
            "modifiers": [],
            "optional": false,
            "type": "number"
          },
          {
            "name": "b",
            "modifiers": [],
            "optional": false,
            "type": "string"
          }
        ]
      },
      {
        "name": "bazArray2",
        "modifiers": [],
        "optional": false,
        "type": "array",
        "elementKeys": [
          {
            "name": "a",
            "modifiers": [],
            "optional": false,
            "type": "number"
          },
          {
            "name": "b",
            "modifiers": [],
            "optional": false,
            "type": "string"
          }
        ]
      },
      {
        "name": "bazArray3",
        "modifiers": [],
        "optional": false,
        "type": "Array",
        "elementKeys": [
          {
            "name": "a",
            "modifiers": [],
            "optional": false,
            "type": "number"
          },
          {
            "name": "b",
            "modifiers": [],
            "optional": false,
            "type": "string"
          }
        ]
      },
      {
        "name": "bazArray4",
        "modifiers": [],
        "optional": false,
        "type": "array",
        "elementKeys": [
          {
            "name": "a",
            "modifiers": [],
            "optional": false,
            "type": "number"
          },
          {
            "name": "b",
            "modifiers": [],
            "optional": false,
            "type": "string"
          }
        ]

      }
    ]);
  });
});
