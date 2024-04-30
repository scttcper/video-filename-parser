import { expect, it } from 'vitest';

import { parseVideoCodec, VideoCodec } from '../src/index.js';

const cases: [string, ReturnType<typeof parseVideoCodec>['codec']][] = [
  ['Terminator 3 Rise of The Machines 2003 HDDVD XvidHD 720p-NPW', VideoCodec.XVID],
  ['Cloverfield 2008 BRRip XvidHD 720p-NPW', VideoCodec.XVID],
  ['The Interview 2014 1080p WEB-DL x264 AAC MerryXmas', VideoCodec.X264],
  ['Half Baked 1998 HDRip XviD AC3-FLAWL3SS', VideoCodec.XVID],
  ['Hidden Figures 2016 DVDSCR XVID-FrangoAssado', VideoCodec.XVID],
  ['Vice 2018 DVDScr Xvid AC3 HQ Hive-CM8', VideoCodec.XVID],
  ['The Dark Knight[2008]DvDrip-aXXo [pendhu]', undefined],
  ['Bridesmaids[2011][Unrated Edition]DvDrip AC3-aXXo', undefined],
  ['Get Out 2017 BluRay 10Bit 1080p DD5 1 H265-d3g', VideoCodec.H265],
  ['Minions 2015 720p HC HDRip X265 AC3 TiTAN', VideoCodec.X265],
  ["Marvel's The Avengers 2012 BluRay 1080p DD5 1 10Bit H265-d3g", VideoCodec.H265],
  ['Exodus Gods and Kings 2014 MULTi 2160p UHD BluRay x265-SESKAPiLE', VideoCodec.X265],
  ['The Incredibles 2004 BluRay x264-jlw', VideoCodec.X264],
  ['Jack Reacher 2012 720p BluRay X264-AMIABLE', VideoCodec.X264],
  ['Super Troopers 2 2018 1080p WEB-DL H264 AC3-EVO', VideoCodec.H264],
  ['The.Middle.720p.HEVC-MeGusta-Pre', VideoCodec.X265],
  ['Cloud.Atlas.2012.BluRay.1080p.VC1.5.1.WMV-INSECTS', VideoCodec.WMV],
  ['The.Book.Of.Eli.2010.Bluray.VC1.1080P.5.1.WMV-NOVO', VideoCodec.WMV],
];

for (const [title, result] of cases) {
  it(`parse codec for "${title}"`, () => {
    expect(parseVideoCodec(title).codec).toEqual(result);
  });
}
