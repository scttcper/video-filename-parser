export enum VideoCodec {
  X265 = 'x265',
  X264 = 'x264',
  H264 = 'h264',
  H265 = 'h265',
  WMV = 'WMV',
  XVID = 'xvid',
  DVDR = 'dvdr',
}

const codecPatterns: Array<{ codec: VideoCodec; regex: RegExp }> = [
  { codec: VideoCodec.H264, regex: /h264/i },
  { codec: VideoCodec.H265, regex: /h[-_. ]?265/i },
  { codec: VideoCodec.X265, regex: /x265|HEVC/i },
  { codec: VideoCodec.X264, regex: /x264/i },
  { codec: VideoCodec.XVID, regex: /XvidHD|X-?vid|divx/i },
  { codec: VideoCodec.WMV, regex: /WMV/i },
  { codec: VideoCodec.DVDR, regex: /DVDR\b/i },
];

export const codecExp = new RegExp(codecPatterns.map(({ regex }) => regex.source).join('|'), 'i');

export function parseVideoCodec(title: string): { codec?: VideoCodec; source?: string } {
  for (const { codec, regex } of codecPatterns) {
    const match = regex.exec(title);
    if (match) {
      return { codec, source: match[0] };
    }
  }

  return {};
}
