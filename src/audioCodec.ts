export enum AudioCodec {
  MP3 = 'MP3',
  MP2 = 'MP2',
  DOLBY = 'Dolby Digital',
  EAC3 = 'Dolby Digital Plus',
  AAC = 'AAC',
  FLAC = 'FLAC',
  DTS = 'DTS',
  DTSHD = 'DTS-HD',
  TRUEHD = 'Dolby TrueHD',
  OPUS = 'Opus',
  VORBIS = 'Vorbis',
  PCM = 'PCM',
  LPCM = 'LPCM',
}

interface AudioCodecPattern {
  name: string;
  codec: AudioCodec;
  regex: RegExp;
}

const audioCodecPatterns: AudioCodecPattern[] = [
  { name: 'dolby-atmos', codec: AudioCodec.EAC3, regex: /\bDolby[-_. ]?Atmos\b/i },
  { name: 'eac3', codec: AudioCodec.EAC3, regex: /\b(?:EAC3|DDP|DD\+)\b/i },
  { name: 'truehd', codec: AudioCodec.TRUEHD, regex: /\bTrue-?HD\b/i },
  { name: 'dolby', codec: AudioCodec.DOLBY, regex: /\b(?:Dolby-?Digital|Dolby|DD|AC3D?)\b/i },
  { name: 'dts-hd', codec: AudioCodec.DTSHD, regex: /\b(?:DTS-?HD|DTS-?MA|DTS-X)\b/i },
  { name: 'dts', codec: AudioCodec.DTS, regex: /\bDTS\b/i },
  { name: 'aac', codec: AudioCodec.AAC, regex: /\bAAC(?=(?:\d(?:[.\s]?\d)?)?(?:ch)?\b)/i },
  { name: 'flac', codec: AudioCodec.FLAC, regex: /\bFLAC\b/i },
  { name: 'mp3', codec: AudioCodec.MP3, regex: /\b(?:LAME(?:\d)+-?(?:\d)+|mp3)\b/i },
  { name: 'mp2', codec: AudioCodec.MP2, regex: /\bmp2\b/i },
  { name: 'lpcm', codec: AudioCodec.LPCM, regex: /\bLPCM\b/i },
  { name: 'pcm', codec: AudioCodec.PCM, regex: /\bPCM\b/i },
  { name: 'opus', codec: AudioCodec.OPUS, regex: /\bOpus\b/i },
  { name: 'vorbis', codec: AudioCodec.VORBIS, regex: /\bVorbis\b/i },
];

export function parseAudioCodec(title: string): { codec?: AudioCodec; source?: string } {
  for (const { codec, regex } of audioCodecPatterns) {
    const result = regex.exec(title);
    if (result) {
      return { codec, source: result[0] };
    }
  }

  return {};
}
