// jest.d.ts
declare global {
  function describe(name: string, fn: () => void): void;
  function beforeAll(fn: () => void | Promise<void>): void;
  function afterEach(fn: () => void | Promise<void>): void;
  function afterAll(fn: () => void | Promise<void>): void;
  function beforeEach(fn: () => void | Promise<void>): void;
  function test(name: string, fn: () => void | Promise<void>): void;
  function it(name: string, fn: () => void | Promise<void>): void;
  const expect: any;
}

export {};