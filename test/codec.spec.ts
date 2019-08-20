import { parseCodec, Codec } from '../src';

describe('parseCodec', () => {
  const cases: Array<[string, Codec | null]> = [
    ['Terminator 3 Rise of The Machines 2003 HDDVD XvidHD 720p-NPW', Codec.XVID],
    ['Cloverfield 2008 BRRip XvidHD 720p-NPW', Codec.XVID],
    ['The Interview 2014 1080p WEB-DL x264 AAC MerryXmas', Codec.X264],
    ['Half Baked 1998 HDRip XviD AC3-FLAWL3SS', Codec.XVID],
    ['Hidden Figures 2016 DVDSCR XVID-FrangoAssado', Codec.XVID],
    ['Vice 2018 DVDScr Xvid AC3 HQ Hive-CM8', Codec.XVID],
    ['The Dark Knight[2008]DvDrip-aXXo [pendhu]', null],
    ['Bridesmaids[2011][Unrated Edition]DvDrip AC3-aXXo', null],
    ['Get Out 2017 BluRay 10Bit 1080p DD5 1 H265-d3g', Codec.X265],
    ['Minions 2015 720p HC HDRip X265 AC3 TiTAN', Codec.X265],
    ['Marvel\'s The Avengers 2012 BluRay 1080p DD5 1 10Bit H265-d3g', Codec.X265],
    ['Exodus Gods and Kings 2014 MULTi 2160p UHD BluRay x265-SESKAPiLE', Codec.X265],
    ['The Incredibles 2004 BluRay x264-jlw', Codec.X264],
    ['Jack Reacher 2012 720p BluRay X264-AMIABLE', Codec.X264],
    ['Super Troopers 2 2018 1080p WEB-DL H264 AC3-EVO', Codec.X264],
  ];
  test.each(cases)('should parse codec for "%s"', (title, expected) => {
    expect(parseCodec(title)).toBe(expected);
  });
});
