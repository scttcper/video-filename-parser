const x265Exp = /(?<x265>x265)/i;
const h265Exp = /(?<h265>h265)/i;
const x264Exp = /(?<x264>x264)/i;
const h264Exp = /(?<h264>h264)/i;
const xvidhdExp = /(?<xvidhd>XvidHD)/i;
const xvidExp = /(?<xvid>X-?vid)/i;
const divxExp = /(?<divx>divx)/i;
const hevcExp = /(?<hevc>HEVC)/i;

const codecExp = new RegExp(
  [
    x265Exp.source,
    h265Exp.source,
    x264Exp.source,
    h264Exp.source,
    xvidhdExp.source,
    xvidExp.source,
    divxExp.source,
    hevcExp.source,
  ].join('|'),
  'i',
);

export enum VideoCodec {
  X265 = 'x265',
  X264 = 'x264',
  XVID = 'xvid',
}

export function parseVideoCodec(title: string): { codec?: VideoCodec; source?: string } {
  const result = codecExp.exec(title);
  if (result === null || result.groups === undefined) {
    return {};
  }

  const { groups } = result;

  if (groups.x265 || groups.h265 || groups.hevc) {
    return { codec: VideoCodec.X265, source: groups.x265 || groups.h265 || groups.hevc };
  }

  if (groups.x264 || groups.h264) {
    return { codec: VideoCodec.X264, source: groups.x264 || groups.h264 };
  }

  if (groups.xvidhd || groups.xvid || groups.divx) {
    return { codec: VideoCodec.XVID, source: groups.xvidhd || groups.xvid || groups.divx };
  }

  return {};
}
