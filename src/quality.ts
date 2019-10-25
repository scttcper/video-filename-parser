/* eslint-disable complexity */
import { extname } from 'path';

import { parseResolution, Resolution } from './resolution';
import { Source, parseSourceGroups, parseSource } from './source';
import { parseVideoCodec, VideoCodec } from './videoCodec';
import { getSourceForExtension, getResolutionForExtension } from './extensions';

const properRegex = /\b(?<proper>proper|repack|rerip)\b/i;
const realRegex = /\b(?<real>REAL)\b/; // not insensitive
const versionExp = /(?<version>v\d\b|\[v\d\])/i;

const remuxExp = /\b(?<remux>(BD|UHD)?Remux)\b/i;
const bdiskExp = /\b(COMPLETE|ISO|BDISO|BD25|BD50|BR.?DISK)\b/i;
const rawHdExp = /\b(?<rawhd>RawHD|1080i[-_. ]HDTV|Raw[-_. ]HD|MPEG[-_. ]?2)\b/i;

const highDefPdtvRegex = /hr[-_. ]ws/i;

export enum QualityModifier {
  REMUX = 'REMUX',
  SCREENER = 'SCREENER',
  BRDISK = 'BRDISK',
  REGIONAL = 'REGIONAL',
  RAWHD = 'RAWHD',
}

export enum QualitySource {
  NAME = 'NAME',
  EXTENSION = 'EXTENSION',
  MEDIAINFO = 'MEDIAINFO',
}

export interface QualityModel {
  sources: Source[];
  modifier: QualityModifier | null;
  resolution: Resolution | null;
  revision: Revision;
  qualitySource: QualitySource;
}

export interface Revision {
  version: number;
  real: number;
}

export const Quality = {
  // is a "regional" tag necessary?
  // Pre-release
  WORKPRINT: {
    name: 'WORKPRINT',
    source: Source.WORKPRINT,
  },
  CAM: {
    name: 'CAM',
    source: Source.CAM,
  },
  TELESYNC: {
    name: 'TELESYNC',
    source: Source.TELESYNC,
  },
  TELECINE: {
    name: 'TELECINE',
    source: Source.TELECINE,
  },
  DVDSCR: {
    name: 'DVDSCR',
    source: Source.DVD,
    modifier: QualityModifier.SCREENER,
    resolution: Resolution.R480P,
  },

  // SD
  SDTV: {
    name: 'SDTV',
    source: Source.TV,
    resolution: Resolution.R480P,
  },
  DVD: {
    name: 'DVD',
    source: Source.DVD,
    resolution: Resolution.R480P,
  },
  DVDR: {
    name: 'DVD-R',
    source: Source.DVD,
    resolution: Resolution.R480P,
    modifier: QualityModifier.REMUX,
  },

  // HDTV
  HDTV720P: {
    name: 'HDTV-720p',
    source: Source.TV,
    resolution: Resolution.R720P,
  },
  HDTV1080P: {
    name: 'HDTV-1080p',
    source: Source.TV,
    resolution: Resolution.R1080P,
  },
  HDTV2160P: {
    name: 'HDTV-2160p',
    source: Source.TV,
    resolution: Resolution.R2160P,
  },

  // Web-DL
  WEBDL480P: {
    name: 'WEBDL-480p',
    source: Source.WEBDL,
    resolution: Resolution.R480P,
  },
  WEBDL720P: {
    name: 'WEBDL-720p',
    source: Source.WEBDL,
    resolution: Resolution.R720P,
  },
  WEBDL1080P: {
    name: 'WEBDL-1080p',
    source: Source.WEBDL,
    resolution: Resolution.R1080P,
  },
  WEBDL2160P: {
    name: 'WEBDL-2160p',
    source: Source.WEBDL,
    resolution: Resolution.R2160P,
  },

  // Bluray
  BLURAY480P: {
    name: 'BLURAY-480p',
    source: Source.BLURAY,
    resolution: Resolution.R480P,
  },
  BLURAY576P: {
    name: 'BLURAY-576p',
    source: Source.BLURAY,
    resolution: Resolution.R576P,
  },
  BLURAY720P: {
    name: 'BLURAY-720p',
    source: Source.BLURAY,
    resolution: Resolution.R720P,
  },
  BLURAY1080P: {
    name: 'BLURAY-1080p',
    source: Source.BLURAY,
    resolution: Resolution.R1080P,
  },
  BLURAY2160P: {
    name: 'BLURAY-2160p',
    source: Source.BLURAY,
    resolution: Resolution.R2160P,
  },

  // remux
  REMUX1080P: {
    name: 'REMUX-1080p',
    source: Source.BLURAY,
    resolution: Resolution.R1080P,
    modifier: QualityModifier.REMUX,
  },
  REMUX2160P: {
    name: 'REMUX-2160p',
    source: Source.BLURAY,
    resolution: Resolution.R2160P,
    modifier: QualityModifier.REMUX,
  },

  BRDISK: {
    name: 'BR-DISK',
    source: Source.BLURAY,
    modifier: QualityModifier.BRDISK,
  },
} as const;

export function parseQualityModifyers(title: string): Revision {
  const normalizedTitle = title
    .trim()
    .replace(/_/g, ' ')
    .trim()
    .toLowerCase();

  const result: Revision = {
    version: 1,
    real: 0,
  };

  if (properRegex.test(normalizedTitle)) {
    result.version = 2;
  }

  const versionResult = versionExp.exec(normalizedTitle);
  if (versionResult && versionResult.groups) {
    // get numbers from version regex
    const digits = /\d/i.exec(versionResult.groups.version);
    if (digits) {
      const value = parseInt(digits[0], 10);
      if (!Number.isNaN(value)) {
        result.version = value;
      }
    }
  }

  let realCount = 0;
  const realGlobalExp = RegExp(realRegex.source, 'g');
  // use non normalized title to prevent insensitive REAL matching
  while (realGlobalExp.exec(title)) {
    realCount += 1;
  }

  result.real = realCount;

  return result;
}

export function parseQuality(title: string): QualityModel {
  const normalizedTitle = title
    .trim()
    .replace(/_/g, ' ')
    .replace(/\[/g, ' ')
    .replace(/\]/g, ' ')
    .trim()
    .toLowerCase();

  const revision = parseQualityModifyers(title);
  const { resolution } = parseResolution(normalizedTitle);
  const sourceGroups = parseSourceGroups(normalizedTitle);
  const source = parseSource(normalizedTitle);
  const { codec } = parseVideoCodec(title);

  const result: QualityModel = {
    sources: source,
    resolution,
    revision,
    modifier: null,
    qualitySource: QualitySource.NAME,
  };

  if (bdiskExp.test(normalizedTitle) && sourceGroups.bluray) {
    result.modifier = QualityModifier.BRDISK;
    result.sources = [Source.BLURAY];
  }

  if (remuxExp.test(normalizedTitle) && !sourceGroups.webdl && !sourceGroups.hdtv) {
    result.modifier = QualityModifier.REMUX;
    result.sources = [Source.BLURAY];
    return result;
  }

  if (rawHdExp.test(normalizedTitle) && result.modifier !== QualityModifier.BRDISK) {
    result.modifier = QualityModifier.RAWHD;
    result.sources = [Source.TV];
    return result;
  }

  if (source !== null) {
    if (sourceGroups.bluray) {
      result.sources = [Source.BLURAY];
      if (codec === VideoCodec.XVID) {
        result.resolution = Resolution.R480P;
        result.sources = [Source.DVD];
      }

      if (resolution === null) {
        // assume bluray is at least 720p
        result.resolution = Resolution.R720P;
      }

      if (resolution === null && result.modifier === QualityModifier.BRDISK) {
        result.resolution = Resolution.R1080P;
      }

      return result;
    }

    if (sourceGroups.webdl) {
      result.sources = [Source.WEBDL];
      if (resolution === null) {
        result.resolution = Resolution.R480P;
      }

      if (resolution === null) {
        result.resolution = Resolution.R480P;
      }

      if (resolution === null && title.includes('[WEBDL]')) {
        result.resolution = Resolution.R720P;
      }

      return result;
    }

    if (sourceGroups.hdtv) {
      result.sources = [Source.TV];
      if (resolution === null) {
        result.resolution = Resolution.R480P;
      }

      if (resolution === null && title.includes('[HDTV]')) {
        result.resolution = Resolution.R720P;
      }

      return result;
    }

    if (sourceGroups.pdtv || sourceGroups.sdtv || sourceGroups.dsr || sourceGroups.tvrip) {
      result.sources = [Source.TV];
      if (highDefPdtvRegex.test(normalizedTitle)) {
        result.resolution = Resolution.R720P;
        return result;
      }

      result.resolution = Resolution.R480P;
      return result;
    }

    if (sourceGroups.bdrip || sourceGroups.brrip) {
      if (codec === VideoCodec.XVID) {
        result.resolution = Resolution.R480P;
        result.sources = [Source.DVD];
        return result;
      }

      if (resolution === null) {
        // bdrips are at least 480p
        result.resolution = Resolution.R480P;
      }

      result.sources = [Source.BLURAY];
      return result;
    }

    if (sourceGroups.workprint) {
      result.sources = [Source.WORKPRINT];
      return result;
    }

    if (sourceGroups.cam) {
      result.sources = [Source.CAM];
      return result;
    }

    if (sourceGroups.ts) {
      result.sources = [Source.TELESYNC];
      return result;
    }

    if (sourceGroups.tc) {
      result.sources = [Source.TELECINE];
      return result;
    }
  }

  if (
    resolution === Resolution.R2160P ||
    resolution === Resolution.R1080P ||
    resolution === Resolution.R720P
  ) {
    result.sources = [Source.WEBDL];
    return result;
  }

  // make vague assumptions based on file extension
  if (result.sources.length === 0) {
    const extension = extname(title)
      .trim()
      .toLowerCase();
    if (extension.length > 0) {
      result.sources = getSourceForExtension(extension);
      result.resolution = getResolutionForExtension(extension);
      result.qualitySource = QualitySource.EXTENSION;
    }
  }

  return result;
}
