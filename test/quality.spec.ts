import { getSource } from '../src/quality';

it('should get source', () => {
  expect(getSource('Oceans.Thirteen.2007.iNTERNAL.720p.BluRay.x264-MHQ')).toBe(true);
});
