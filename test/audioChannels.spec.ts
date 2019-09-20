import { Channels, parseAudioChannels } from '../src/audioChannels';

describe('parseAudioChannels', () => {
  const audioChannelCases: Array<[string, ReturnType<typeof parseAudioChannels>]> = [
    [
      'Hannibal 2001 4K UHD Dolby Vision MP4 DD+5 1 H265-d3g',
      { channels: Channels.SIX, source: '5 1' },
    ],
    ['Aladdin 2019 720p BluRay x264 AC3 5 1-OMEGA', { channels: Channels.SIX, source: '5 1' }],
    [
      'Trespass Against Us (2017) 1080p BluRay x265 6ch -Dtech mkv',
      { channels: Channels.SIX, source: '6ch' },
    ],
    [
      'Abbot and Costello Meet Frankenstein 1948 BluRay 1080p HEVC Dts Stereo-D3FiL3R',
      { channels: Channels.STEREO, source: 'Stereo' },
    ],
    [
      'The.Daily.Show.2015.07.01.Kirsten.Gillibrand.Extended.720p.Comedy.Central.WEBRip.AAC2.0.x264-BTW.mkv',
      { channels: Channels.STEREO, source: '2.0' },
    ],
  ];
  it.each(audioChannelCases)('should parse channel "%s"', (title, channel) => {
    expect(parseAudioChannels(title)).toEqual(channel);
  });
});
