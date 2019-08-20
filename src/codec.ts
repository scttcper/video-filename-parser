const x265Exp = /(?<x265>x265)/i;
const h265Exp = /(?<h265>h265)/i;
const x264Exp = /(?<x264>x264)/i;
const h264Exp = /(?<h264>h264)/i;
const xvidhdExp = /(?<xvidhd>XvidHD)/i;
const xvidExp = /(?<xvid>X-?vid)/i;
const divxExp = /(?<divx>divx)/i;

const codecExp = new RegExp(
  [
    x265Exp.source,
    h265Exp.source,
    x264Exp.source,
    h264Exp.source,
    xvidhdExp.source,
    xvidExp.source,
    divxExp.source,
  ].join('|'),
  'i',
);

export enum Codec {
  X265 = 'x265',
  X264 = 'x264',
  XVID = 'xvid',
}

export function parseCodec(title: string): Codec | null {
  const result = codecExp.exec(title);
  if (!result || !result.groups) {
    return null;
  }

  const { groups } = result;

  if (groups.x265 || groups.h265) {
    return Codec.X265;
  }

  if (groups.x264 || groups.h264) {
    return Codec.X264;
  }

  if (groups.xvidhd || groups.xvid || groups.divx) {
    return Codec.XVID;
  }

  return null;
}
