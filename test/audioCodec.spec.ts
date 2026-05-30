import { expect, it } from 'vitest';

import { AudioCodec, parseAudioCodec } from '../src/index.js';

const audioCodecCases: Array<[string, ReturnType<typeof parseAudioCodec>]> = [
  [
    'Hannibal 2001 4K UHD Dolby Vision MP4 DD+5 1 H265-d3g',
    { codec: AudioCodec.EAC3, source: 'DD+' },
  ],
  ['Movie.Title.2024.1080p.WEB-DL.DDP5.1.H264-GROUP', { codec: AudioCodec.EAC3, source: 'DDP5.1' }],
  ['Movie.Title.2024.1080p.WEB-DL.DD5.1.H264-GROUP', { codec: AudioCodec.DOLBY, source: 'DD5.1' }],
  ['Aladdin 2019 720p BluRay x264 AC3 5 1-OMEGA', { codec: AudioCodec.DOLBY, source: 'AC3' }],
  ['Trespass Against Us (2017) 1080p BluRay x265 6ch -Dtech mkv', {}],
  [
    'Abbot and Costello Meet Frankenstein 1948 BluRay 1080p HEVC Dts Stereo-D3FiL3R',
    { codec: AudioCodec.DTS, source: 'Dts' },
  ],
  [
    'The.Daily.Show.2015.07.01.Kirsten.Gillibrand.Extended.720p.Comedy.Central.WEBRip.AAC2.0.x264-BTW.mkv',
    { codec: AudioCodec.AAC, source: 'AAC' },
  ],
  ['Girl on the Third Floor 2019 BRRip x264 AAC-SSN', { codec: AudioCodec.AAC, source: 'AAC' }],
  [
    'New Eden S01E01 Who Are These Women CRAV WEB-DL AAC2 0 H 264-BTW',
    { codec: AudioCodec.AAC, source: 'AAC' },
  ],
  [
    'South Park S20E08 Members Only Uncensored 1080p WEB-DL HEVC x265 AAC2ch-NEBO666',
    { codec: AudioCodec.AAC, source: 'AAC' },
  ],
  [
    'Behind the Candelabra 2013 BDRip 1080p DTS-HD extra-HighCode',
    { codec: AudioCodec.DTSHD, source: 'DTS-HD' },
  ],
  [
    'Ex Machina 2015 UHD BluRay 2160p DTS-X 7 1 HDR x265 10bit-CHD',
    { codec: AudioCodec.DTSHD, source: 'DTS-X' },
  ],
  [
    'Frozen.2.2019.German.DL.EAC3.1080p.DSNP.WEB.H265-ZeroTwo',
    { codec: AudioCodec.EAC3, source: 'EAC3' },
  ],
  [
    'Movie.Title.2024.1080p.WEB-DL.Dolby.Atmos.H265-GROUP',
    { codec: AudioCodec.EAC3, source: 'Dolby.Atmos' },
  ],
  [
    'Movie.Title.2024.1080p.BluRay.DTS-MA.x264-GROUP',
    { codec: AudioCodec.DTSHD, source: 'DTS-MA' },
  ],
  ['Movie.Title.2024.1080p.BluRay.LPCM.x264-GROUP', { codec: AudioCodec.LPCM, source: 'LPCM' }],
  ['Movie.Title.2024.1080p.BluRay.PCM.x264-GROUP', { codec: AudioCodec.PCM, source: 'PCM' }],
  ['Movie.Title.2024.1080p.BluRay.FLAC.x264-GROUP', { codec: AudioCodec.FLAC, source: 'FLAC' }],
  ['Movie.Title.2024.1080p.WEB.Opus.x265-GROUP', { codec: AudioCodec.OPUS, source: 'Opus' }],
  ['Movie.Title.2024.1080p.WEB.Vorbis.x265-GROUP', { codec: AudioCodec.VORBIS, source: 'Vorbis' }],
  ['Movie.Title.2024.DVDRip.LAME3-99.XviD-GROUP', { codec: AudioCodec.MP3, source: 'LAME3-99' }],
  ['Movie.Title.2024.DVDRip.MP2.XviD-GROUP', { codec: AudioCodec.MP2, source: 'MP2' }],
];

for (const [title, result] of audioCodecCases) {
  it(`parse audio codec from "${title}"`, () => {
    expect(parseAudioCodec(title)).toEqual(result);
  });
}
