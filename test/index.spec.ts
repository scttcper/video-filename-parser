import { DummyClass } from '../src/index';

describe('Dummy test', () => {
  let dummy: DummyClass;

  beforeEach(() => {
    dummy = new DummyClass();
  });

  it('should be instantiable', () => {
    expect(dummy).toBeInstanceOf(DummyClass);
  });

  it('should have value true', () => {
    expect(dummy.value).toBeTruthy();
  });

  it('should resolve promise', async () => {
    const text = await dummy.load();
    expect(text).toBe('text');
  });
});
