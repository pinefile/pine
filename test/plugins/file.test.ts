import { pkg } from '../../src/plugins/file';

describe('file', () => {
  it('can read closest package.json', async () => {
    const p = pkg();
    expect(p.bin).toEqual({ pine: 'bin/pine' });
  });
});
