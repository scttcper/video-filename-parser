import { parseResolution, Resolution } from './resolution.js';
import { parseSource, parseSourceGroups, Source } from './source.js';
import { parseVideoCodec, VideoCodec } from './videoCodec.js';

const properRegex = /\b(?<proper>proper|repack|rerip)\b/i;
const realRegex = /\b(?<real>REAL)\b/; // not insensitive
const realGlobalExp = new RegExp(realRegex.source, 'g');
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

interface QualityContext {
  title: string;
  normalizedTitle: string;
  sourceGroups: ReturnType<typeof parseSourceGroups>;
  parsedSources: Source[];
  parsedResolution?: Resolution;
  codec?: VideoCodec;
  revision: Revision;
  modifier: QualityModifier | null;
}

type QualityPolicy = {
  matches: (context: QualityContext) => boolean;
  apply: (context: QualityContext) => QualityModel;
};

export function parseQualityModifyers(title: string): Revision {
  const normalizedTitle = title.trim().replaceAll('_', ' ').trim().toLowerCase();

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
    const digits = /\d/i.exec(versionResult.groups.version ?? '');
    if (digits) {
      const value = Number.parseInt(digits[0] ?? '', 10);
      if (!Number.isNaN(value)) {
        result.version = value;
      }
    }
  }

  let realCount = 0;
  // use non normalized title to prevent insensitive REAL matching
  while (realGlobalExp.test(title)) {
    realCount += 1;
  }

  result.real = realCount;

  return result;
}

export function parseQuality(title: string, codec?: VideoCodec): QualityModel {
  const normalizedTitle = title
    .trim()
    .replaceAll('_', ' ')
    .replaceAll('[', ' ')
    .replaceAll(']', ' ')
    .trim()
    .toLowerCase();

  const revision = parseQualityModifyers(title);
  const sourceGroups = parseSourceGroups(normalizedTitle);
  const parsedSources = parseSource(normalizedTitle, sourceGroups);
  const { resolution } = parseResolution(normalizedTitle, parsedSources);
  codec ??= parseVideoCodec(title).codec;

  const context: QualityContext = {
    title,
    normalizedTitle,
    sourceGroups,
    parsedSources,
    parsedResolution: resolution,
    codec,
    revision,
    modifier: parseQualityModifier(normalizedTitle, sourceGroups),
  };

  for (const policy of qualityPolicies) {
    if (policy.matches(context)) {
      return policy.apply(context);
    }
  }

  if (
    !context.modifier &&
    (resolution === Resolution.R2160P ||
      resolution === Resolution.R1080P ||
      resolution === Resolution.R720P)
  ) {
    return createQualityResult(context, { sources: [Source.WEBDL] });
  }

  return createQualityResult(context);
}

function parseQualityModifier(
  normalizedTitle: string,
  sourceGroups: ReturnType<typeof parseSourceGroups>,
): QualityModifier | null {
  if (bdiskExp.test(normalizedTitle) && sourceGroups.bluray) {
    return QualityModifier.BRDISK;
  }

  if (remuxExp.test(normalizedTitle) && !sourceGroups.webdl && !sourceGroups.hdtv) {
    return QualityModifier.REMUX;
  }

  if (rawHdExp.test(normalizedTitle)) {
    return QualityModifier.RAWHD;
  }

  return null;
}

function createQualityResult(
  context: QualityContext,
  overrides: Partial<Pick<QualityModel, 'sources' | 'resolution' | 'modifier'>> = {},
): QualityModel {
  return {
    sources: overrides.sources ?? getDefaultSources(context),
    resolution: overrides.resolution ?? context.parsedResolution,
    revision: context.revision,
    modifier: overrides.modifier ?? context.modifier,
  };
}

function getDefaultSources(context: QualityContext): Source[] {
  if (context.modifier === QualityModifier.BRDISK || context.modifier === QualityModifier.REMUX) {
    return [Source.BLURAY];
  }

  if (context.modifier === QualityModifier.RAWHD) {
    return [Source.TV];
  }

  return context.parsedSources;
}

const qualityPolicies: QualityPolicy[] = [
  {
    matches: ({ sourceGroups }) => sourceGroups.bluray,
    apply: context => {
      if (context.codec === VideoCodec.XVID) {
        return createQualityResult(context, {
          sources: [Source.DVD],
          resolution: Resolution.R480P,
        });
      }

      return createQualityResult(context, {
        sources: [Source.BLURAY],
        resolution: getBlurayResolution(context),
      });
    },
  },
  {
    matches: ({ sourceGroups }) => sourceGroups.webdl || sourceGroups.webrip,
    apply: context =>
      createQualityResult(context, {
        sources: context.parsedSources,
        resolution: getWebResolution(context),
      }),
  },
  {
    matches: ({ sourceGroups }) => sourceGroups.hdtv,
    apply: context =>
      createQualityResult(context, {
        sources: [Source.TV],
        resolution: getHdtvResolution(context),
      }),
  },
  {
    matches: ({ sourceGroups }) =>
      sourceGroups.pdtv || sourceGroups.sdtv || sourceGroups.dsr || sourceGroups.tvrip,
    apply: context =>
      createQualityResult(context, {
        sources: [Source.TV],
        resolution: highDefPdtvRegex.test(context.normalizedTitle)
          ? Resolution.R720P
          : Resolution.R480P,
      }),
  },
  {
    matches: ({ sourceGroups }) => sourceGroups.bdrip || sourceGroups.brrip,
    apply: context => {
      if (context.codec === VideoCodec.XVID) {
        return createQualityResult(context, {
          sources: [Source.DVD],
          resolution: Resolution.R480P,
        });
      }

      return createQualityResult(context, {
        sources: [Source.BLURAY],
        resolution: context.parsedResolution ?? Resolution.R480P,
      });
    },
  },
  {
    matches: ({ sourceGroups }) => sourceGroups.workprint,
    apply: context => createQualityResult(context, { sources: [Source.WORKPRINT] }),
  },
  {
    matches: ({ sourceGroups }) => sourceGroups.cam,
    apply: context => createQualityResult(context, { sources: [Source.CAM] }),
  },
  {
    matches: ({ sourceGroups }) => sourceGroups.ts,
    apply: context => createQualityResult(context, { sources: [Source.TELESYNC] }),
  },
  {
    matches: ({ sourceGroups }) => sourceGroups.tc,
    apply: context => createQualityResult(context, { sources: [Source.TELECINE] }),
  },
];

function getBlurayResolution(context: QualityContext): Resolution | undefined {
  if (context.parsedResolution) {
    return context.parsedResolution;
  }

  if (context.modifier === QualityModifier.BRDISK) {
    return Resolution.R1080P;
  }

  if (context.modifier === QualityModifier.REMUX) {
    return Resolution.R2160P;
  }

  return Resolution.R720P;
}

function getWebResolution(context: QualityContext): Resolution | undefined {
  if (context.parsedResolution) {
    return context.parsedResolution;
  }

  return context.title.includes('[WEBDL]') ? Resolution.R720P : Resolution.R480P;
}

function getHdtvResolution(context: QualityContext): Resolution | undefined {
  if (context.parsedResolution) {
    return context.parsedResolution;
  }

  return context.title.includes('[HDTV]') ? Resolution.R720P : Resolution.R480P;
}
