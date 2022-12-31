/* eslint-disable @typescript-eslint/ban-ts-comment */

import { forward } from '../utils';

describe('FunctionUtils', () => {
  test('forward', () => {
    const error = new Error('test');
    const fn1 = (a: number, b: number) => a + b;
    const fn2 = () => 'fn';
    const fn3 = () => {
      throw error;
    };

    // runtime
    expect(forward(fn1, 5, 10)).toBe(15);
    expect(forward(fn2)).toBe('fn');
    expect(() => forward(fn3)).toThrowError(error);

    // typecheck
    // @ts-expect-error
    forward(fn1);
    // @ts-expect-error
    forward(fn1, 1);
    // @ts-expect-error
    forward(fn1, 'str', false);
  });
});
