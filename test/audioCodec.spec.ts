import { Channel, parseAudioChannels } from '../src/audioCodec';

describe('audioCodec', () => {
  const audioChannelCases: Array<[string, { channels: Channel | null; source: string | null }]> = [
    ['Hannibal 2001 4K UHD Dolby Vision MP4 DD+5 1 H265-d3g', {channels: Channel.SIX, source: '5 1' }],
    ['Aladdin 2019 720p BluRay x264 AC3 5 1-OMEGA', {channels: Channel.SIX, source: '5 1' }],
    ['Trespass Against Us (2017) 1080p BluRay x265 6ch -Dtech mkv', {channels: Channel.SIX, source: '6ch' }],
    ['Abbot and Costello Meet Frankenstein 1948 BluRay 1080p HEVC Dts Stereo-D3FiL3R', {channels: Channel.STEREO, source: 'Stereo' }],
  ];
  it.each(audioChannelCases)('should parse channel "%s"', (title, channel) => {
    expect(parseAudioChannels(title)).toEqual(channel)
  });
});
