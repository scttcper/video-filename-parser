const x265Exp = /(?<x265>x265)/i;
const h265Exp = /(?<h265>h265)/i;
const x264Exp = /(?<x264>x264)/i;
const h264Exp = /(?<h264>h264)/i;
const xvidhdExp = /(?<xvidhd>XvidHD)/i;
const xvidExp = /(?<xvid>X-?vid)/i;
const divxExp = /(?<divx>divx)/i;
const hevcExp = /(?<hevc>HEVC)/i;

const mp3Exp = /\b(?<mp3>(MP3)|(LAME)|(LAME(?:\d)+-?(?:\d)+))\b/i;
// rebulk.regex("MP3", "LAME", r"LAME(?:\d)+-?(?:\d)+", value="MP3")
// rebulk.string("MP2", value="MP2")
// rebulk.regex('Dolby', 'DolbyDigital', 'Dolby-Digital', 'DD', 'AC3D?', value='Dolby Digital')
// rebulk.regex('Dolby-?Atmos', 'Atmos', value='Dolby Atmos')
// rebulk.string("AAC", value="AAC")
// rebulk.string('EAC3', 'DDP', 'DD+', value='Dolby Digital Plus')
// rebulk.string("Flac", value="FLAC")
// rebulk.string("DTS", value="DTS")
// rebulk.regex('DTS-?HD', 'DTS(?=-?MA)', value='DTS-HD', conflict_solver=lambda match, other: other if other.name == 'audio_codec' else '__default__')
// rebulk.regex('True-?HD', value='Dolby TrueHD')
// rebulk.string('Opus', value='Opus')
// rebulk.string('Vorbis', value='Vorbis')
// rebulk.string('PCM', value='PCM')
// rebulk.string('LPCM', value='LPCM')


// rebulk.defaults(clear=True, name='audio_profile', disabled=lambda context: is_disabled(context, 'audio_profile'))
// rebulk.string('MA', value='Master Audio', tags=['audio_profile.rule', 'DTS-HD'])
// rebulk.string('HR', 'HRA', value='High Resolution Audio', tags=['audio_profile.rule', 'DTS-HD'])
// rebulk.string('ES', value='Extended Surround', tags=['audio_profile.rule', 'DTS'])
// rebulk.string('HE', value='High Efficiency', tags=['audio_profile.rule', 'AAC'])
// rebulk.string('LC', value='Low Complexity', tags=['audio_profile.rule', 'AAC'])
// rebulk.string('HQ', value='High Quality', tags=['audio_profile.rule', 'Dolby Digital'])
// rebulk.string('EX', value='EX', tags=['audio_profile.rule', 'Dolby Digital'])


const eightChannelExp = /\b(?<eight>7.?[01])\b/i;
const sixChannelExp = /\b(?<six>(6[\W]0(?:ch)?)(?=[^\\d]|$)|(5[\W][01](?:ch)?)(?=[^\\d]|$)|5ch|6ch)\b/i;
const stereoChannelExp = /\b(?<stereo>((2[\\W_]0(?:ch)?)(?=[^\\d]|$))|stereo)\b/i;
const monoChannelExp = /\b(?<mono>(1[\W]0(?:ch)?)(?=[^\\d]|$)|(mono)|(1ch))\b/i;

const channelExp = new RegExp(
  [
    eightChannelExp.source,
    sixChannelExp.source,
    stereoChannelExp.source,
    monoChannelExp.source,
  ].join('|'),
  'i',
);

export enum Channel {
  SEVEN = '7.1',
  SIX = '5.1',
  STEREO = 'stereo',
  MONO = 'mono',
}

export enum AudioCodec {
  X265 = 'x265',
  X264 = 'x264',
  XVID = 'xvid',
}

export function parseAudioCodec(title: string): { codec: AudioCodec | null; source: string | null } {
  const channelResult = channelExp.exec(title);
  return { codec: null, source: null };
}

export function parseAudioChannels(title: string): { channels: Channel | null; source: string | null } {
  const channelResult = channelExp.exec(title);
  if (!channelResult || !channelResult.groups) {
    return { channels: null, source: null };
  }

  const { groups } = channelResult;

  if (groups.eight) {
    return { channels: Channel.SEVEN, source: groups.eight };
  }

  if (groups.six) {
    return { channels: Channel.SIX, source: groups.six };
  }

  if (groups.stereo) {
    return { channels: Channel.STEREO, source: groups.stereo };
  }

  if (groups.mono) {
    return { channels: Channel.MONO, source: groups.mono };
  }

  return { channels: null, source: null };
}
