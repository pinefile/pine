import { pkg, readJSON } from '../../src/plugins/file';

jest.mock('../../src/plugins/file', () => ({
  pkg: () => ({ name: 'mock' }),
  readJSON: () => ({}),
}));

describe('file', () => {
  it('can read package.json', () => {
    const p = pkg();
    expect(p.name).toBe('mock');
  });

  it('can read json', () => {
    const r = readJSON();
    expect(typeof r).toBe('object');
  });
});
