export interface X {
  a: number;
  b: string;
  c: Y;
}

interface Y {
  a: number;
  b: string;
  c: Z;
}

interface Z {
  a: number;
  b: string;
  c: any;
}
