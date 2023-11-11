export const forward = <T extends (...args: any[]) => any, U extends Parameters<T>>(fn: T, ...args: U): ReturnType<T> =>
  fn(...args);

export type Forward = typeof forward;