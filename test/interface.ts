export interface Foo {
  a: string;
  bar: Bar
  bazArray1: Array<{
    a: number;
    b: string;
  }>;
  bazArray2: {
    a: number;
    b: string;
  }[];
  bazArray3: Array<Baz>;
  bazArray4: Baz[];
}

interface Bar {
  a: number;
  b: string;
}

interface Baz {
  a: number;
  b: string;
}