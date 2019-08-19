const x264Exp = /(?<x264>x264)/i;
const h264Exp = /(?<h264>h264)/i;
const xvidhdExp = /(?<xvidhd>XvidHD)/i;
const xvidExp = /(?<xvid>X-?vid)/i;
const divxExp = /(?<divx>divx)/i;

const codecExp = new RegExp(
  [x264Exp.source, h264Exp.source, xvidhdExp.source, xvidExp.source, divxExp.source].join('|'),
  'ig',
);
