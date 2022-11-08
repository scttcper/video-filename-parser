/* eslint-disable complexity */
import { parseResolution, Resolution } from './resolution.js';
import { parseSource, parseSourceGroups, Source } from './source.js';
import { parseVideoCodec, VideoCodec } from './videoCodec.js';

const properRegex = /\b(?<proper>proper|repack|rerip)\b/i;
const realRegex = /\b(?<real>REAL)\b/; // not insensitive
const versionExp = /(?<version>v\d\b|\[v\d\])/i;

const remuxExp = /\b(?<remux>(BD|UHD)?Remux)\b/i;
const bdiskExp = /\b(COMPLETE|ISO|BDISO|BDMux|BD25|BD50|BR.?DISK)\b/i;
const rawHdExp = /\b(?<rawhd>RawHD|1080i[-_. ]HDTV|Raw[-_. ]HD|MPEG[-_. ]?2)\b/i;

const highDefPdtvRegex = /hr[-_. ]ws/i;

export enum QualityModifier {
  REMUX = 'REMUX',
  BRDISK = 'BRDISK',
  RAWHD = 'RAWHD',
}

export interface QualityModel {
  sources: Source[];
  modifier: QualityModifier | null;
  resolution?: Resolution;
  revision: Revision;
}

export interface Revision {
  version: number;
  real: number;
}

export function parseQualityModifyers(title: string): Revision {
  const normalizedTitle = title.trim().replace(/_/g, ' ').trim().toLowerCase();

  const result: Revision = {
    version: 1,
    real: 0,
  };

  if (properRegex.test(normalizedTitle)) {
    result.version = 2;
  }

  const versionResult = versionExp.exec(normalizedTitle);
  if (versionResult?.groups) {
    // get numbers from version regex
    const digits = /\d/i.exec(versionResult.groups['version'] ?? '');
    if (digits) {
      const value = parseInt(digits[0] ?? '', 10);
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
  };

  if (bdiskExp.test(normalizedTitle) && sourceGroups.bluray) {
    result.modifier = QualityModifier.BRDISK;
    result.sources = [Source.BLURAY];
  }

  if (remuxExp.test(normalizedTitle) && !sourceGroups.webdl && !sourceGroups.hdtv) {
    result.modifier = QualityModifier.REMUX;
    result.sources = [Source.BLURAY];
  }

  if (
    rawHdExp.test(normalizedTitle) &&
    result.modifier !== QualityModifier.BRDISK &&
    result.modifier !== QualityModifier.REMUX
  ) {
    result.modifier = QualityModifier.RAWHD;
    result.sources = [Source.TV];
  }

  if (source !== null) {
    if (sourceGroups.bluray) {
      result.sources = [Source.BLURAY];
      if (codec === VideoCodec.XVID) {
        result.resolution = Resolution.R480P;
        result.sources = [Source.DVD];
      }

      if (!resolution) {
        // assume bluray is at least 720p
        result.resolution = Resolution.R720P;
      }

      if (!resolution && result.modifier === QualityModifier.BRDISK) {
        result.resolution = Resolution.R1080P;
      }

      if (!resolution && result.modifier === QualityModifier.REMUX) {
        result.resolution = Resolution.R2160P;
      }

      return result;
    }

    if (sourceGroups.webdl || sourceGroups.webrip) {
      result.sources = source;
      if (!resolution) {
        result.resolution = Resolution.R480P;
      }

      if (!resolution) {
        result.resolution = Resolution.R480P;
      }

      if (!resolution && title.includes('[WEBDL]')) {
        result.resolution = Resolution.R720P;
      }

      return result;
    }

    if (sourceGroups.hdtv) {
      result.sources = [Source.TV];
      if (!resolution) {
        result.resolution = Resolution.R480P;
      }

      if (!resolution && title.includes('[HDTV]')) {
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

      if (!resolution) {
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
    !result.modifier &&
    (resolution === Resolution.R2160P ||
      resolution === Resolution.R1080P ||
      resolution === Resolution.R720P)
  ) {
    result.sources = [Source.WEBDL];
    return result;
  }

  return result;
}
