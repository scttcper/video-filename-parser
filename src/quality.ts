import { parseResolutionFromTitle, Resolution } from './resolution.js';
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
  sourceGroups: SourceGroups;
  parsedSources?: Source[];
  parsedResolution?: Resolution;
  codec?: VideoCodec;
  revision: Revision;
  modifier: QualityModifier | null;
}

type SourceGroups = ReturnType<typeof parseSourceGroups>;
type QualityResultOverrides = Partial<Pick<QualityModel, 'sources' | 'resolution' | 'modifier'>>;

type QualityPolicy = {
  matches: (context: QualityContext) => boolean;
  getOverrides: (context: QualityContext) => QualityResultOverrides;
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
  const { resolution } = parseResolutionFromTitle(normalizedTitle);
  codec ??= parseVideoCodec(title).codec;

  const context: QualityContext = {
    title,
    normalizedTitle,
    sourceGroups,
    parsedResolution: resolution,
    codec,
    revision,
    modifier: parseQualityModifier(normalizedTitle, sourceGroups),
  };

  for (const policy of qualityPolicies) {
    if (policy.matches(context)) {
      return createQualityResult(context, policy.getOverrides(context));
    }
  }

  return createQualityResult(context);
}

function parseQualityModifier(
  normalizedTitle: string,
  sourceGroups: SourceGroups,
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
  overrides: QualityResultOverrides = {},
): QualityModel {
  return {
    sources: overrides.sources ?? getDefaultSources(context),
    resolution: overrides.resolution ?? context.parsedResolution ?? getDefaultResolution(context),
    revision: context.revision,
    modifier: overrides.modifier ?? context.modifier,
  };
}

function getDefaultResolution(context: QualityContext): Resolution | undefined {
  return getParsedSources(context).includes(Source.DVD) ? Resolution.R480P : undefined;
}

function getDefaultSources(context: QualityContext): Source[] {
  if (context.modifier === QualityModifier.BRDISK || context.modifier === QualityModifier.REMUX) {
    return [Source.BLURAY];
  }

  if (context.modifier === QualityModifier.RAWHD) {
    return [Source.TV];
  }

  return getParsedSources(context);
}

function getParsedSources(context: QualityContext): Source[] {
  context.parsedSources ??= parseSource(context.normalizedTitle, context.sourceGroups);
  return context.parsedSources;
}

const qualityPolicies: QualityPolicy[] = [
  {
    matches: ({ sourceGroups }) => sourceGroups.bluray,
    getOverrides: context =>
      getXvidDvdOverrides(context) ?? {
        sources: [Source.BLURAY],
        resolution: getBlurayResolution(context),
      },
  },
  {
    matches: ({ sourceGroups }) => sourceGroups.webdl || sourceGroups.webrip,
    getOverrides: context => ({
      sources: getParsedSources(context),
      resolution: getWebResolution(context),
    }),
  },
  {
    matches: ({ sourceGroups }) => sourceGroups.hdtv,
    getOverrides: context => ({
      sources: [Source.TV],
      resolution: getHdtvResolution(context),
    }),
  },
  {
    matches: ({ sourceGroups }) =>
      sourceGroups.pdtv || sourceGroups.sdtv || sourceGroups.dsr || sourceGroups.tvrip,
    getOverrides: context => ({
      sources: [Source.TV],
      resolution: highDefPdtvRegex.test(context.normalizedTitle)
        ? Resolution.R720P
        : Resolution.R480P,
    }),
  },
  {
    matches: ({ sourceGroups }) => sourceGroups.bdrip || sourceGroups.brrip,
    getOverrides: context =>
      getXvidDvdOverrides(context) ?? {
        sources: [Source.BLURAY],
        resolution: context.parsedResolution ?? Resolution.R480P,
      },
  },
  sourcePolicy(({ sourceGroups }) => sourceGroups.workprint, Source.WORKPRINT),
  sourcePolicy(({ sourceGroups }) => sourceGroups.cam, Source.CAM),
  sourcePolicy(({ sourceGroups }) => sourceGroups.ts, Source.TELESYNC),
  sourcePolicy(({ sourceGroups }) => sourceGroups.tc, Source.TELECINE),
  sourcePolicy(
    context => !context.modifier && isHighDefinition(context.parsedResolution),
    Source.WEBDL,
  ),
];

function sourcePolicy(
  matches: (context: QualityContext) => boolean,
  source: Source,
): QualityPolicy {
  return {
    matches,
    getOverrides: () => ({ sources: [source] }),
  };
}

function getXvidDvdOverrides(context: QualityContext): QualityResultOverrides | null {
  if (context.codec !== VideoCodec.XVID) {
    return null;
  }

  return {
    sources: [Source.DVD],
    resolution: Resolution.R480P,
  };
}

function isHighDefinition(resolution?: Resolution): boolean {
  return (
    resolution === Resolution.R2160P ||
    resolution === Resolution.R1080P ||
    resolution === Resolution.R720P
  );
}

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
