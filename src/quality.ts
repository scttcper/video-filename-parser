import { parseResolutionFromTitle, Resolution } from './resolution.js';
import { parseSource, parseSourceGroups, Source } from './source.js';
import { parseVideoCodec, VideoCodec } from './videoCodec.js';

const properRegex = /\b(?<proper>proper)\b/i;
const realRegex = /\b(?<real>REAL)\b/; // not insensitive
const realGlobalExp = new RegExp(realRegex.source, 'g');
const repackRegex = /\b(?<repack>repack\d?|rerip\d?)\b/i;
// A bare `v2` only counts after the year, otherwise titles like "Movie.V2.2021" bump the version
const versionExp =
  /\d[-._ ]?v(\d)[-._ ]|\bv(\d)\b(?!.*\b(?:19|20)\d{2}\b)|\[v(\d)\]|repack(\d)|rerip(\d)/i;

const remuxExp =
  /(?:[_. [(]|\d{4}p-|\bHybrid-)(?:(?:BD|UHD)[-_. ]?)?Remux\b|(?:(?:BD|UHD)[-_. ]?)?Remux[_. ]\d{4}p/i;
const bdiskExp =
  /\b(COMPLETE|ISO|BDISO|BDMux|BDMV|BD25|BD50|BD66|BD100|BD[-_. ]?(?:25|50|66|100)|BR[-_. ]?DISK|Full[-_. ]?Blu[-_. ]?ray|3D[-_. ]?BD)\b/i;
const discCodecExp = /\b(AVC|HEVC|VC[-_. ]?1|MVC|MPEG[-_. ]?2)\b/i;
const brDiskExclusionExp =
  /\b((?<!HD[._ -]|HD)DVD|BDRip|720p|MKV|XviD|WMV|d3g|(BD)?REMUX|[xh][-_. ]?26[45])\b/i;
const hardBrDiskExclusionExp = /\b((?<!HD[._ -]|HD)DVD|BDRip|720p|MKV|XviD|WMV|d3g|(BD)?REMUX)\b/i;
const brDiskSourceExp = /(?:blu[-_. ]?ray|hd[-_. ]?dvd)/i;
const rawHdExp = /\b(?<rawhd>RawHD|Raw[-_. ]HD|MPEG[-_. ]?2)\b/i;
const extensionExp = /\.[a-z0-9-]+$/i;
const sdtvExtensionSet = new Set([
  '.m4v',
  '.3gp',
  '.nsv',
  '.ty',
  '.strm',
  '.rm',
  '.rmvb',
  '.m3u',
  '.ifo',
  '.mov',
  '.qt',
  '.divx',
  '.xvid',
  '.bivx',
  '.nrg',
  '.pva',
  '.wmv',
  '.asf',
  '.asx',
  '.ogm',
  '.ogv',
  '.m2v',
  '.avi',
  '.bin',
  '.dat',
  '.dvr-ms',
  '.mpg',
  '.mpeg',
  '.mp4',
  '.avc',
  '.vp3',
  '.svq3',
  '.nuv',
  '.viv',
  '.dv',
  '.fli',
  '.flv',
  '.wpl',
  '.ts',
  '.wtv',
]);

const highDefPdtvRegex = /hr[-_. ]ws/i;
const sceneCodecMarker = String.raw`(?:[xh][-. ]?26[45]|h[-. ]?26[45])`;
const commonSceneBlurayExp = new RegExp(
  String.raw`\b(?:1080p|2160p)(?:[-_. ]uhd)?[-_. ]bluray[-_. ]${sceneCodecMarker}\b`,
  'i',
);
const commonSceneWebExp = new RegExp(
  String.raw`\b(?:1080p|2160p)[-_. ]web[-_. ]${sceneCodecMarker}\b`,
  'i',
);
const animeWebDlExp = /\[WEB\]|[\[(]WEB[ .]/i;
// Upper case only, a trailing `web` word is not a source
const trailingWebExp = /[. ]WEB$/;
// x264 with no source or resolution is an SD TV release, like upstream's codec fallback
const bareX264Exp = /\bx264\b/;
// Upstream's German heuristics as token checks. Their regexes (`(?<=\d{4}).*German.*` with
// lookaheads) backtrack badly on long input, see the adversarial tests.
const germanTokenExp = /\bgerman/;
const yearTokenExp = /\d{4}/;
const germanDualLanguageExp = /[dm]l\b/;
const germanDiscCodecExp = /\b(?:avc|hevc|vc[-_. ]?1|mvc|mpeg[-_. ]?2)/;
const germanBlurayExp = /blu-?ray/;
const uncommonXvidExp = /x-?vid|divx/i;
// `HD TV` without the HDTV token is HD, like upstream's other source fallback
const hdtvTokenExp = /\bhdtv\b/;

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
  isRepack?: true;
}

interface QualityContext {
  title: string;
  normalizedTitle: string;
  sourceGroups: SourceGroups;
  parsedSources?: Source[];
  parsedResolution?: Resolution;
  extensionQuality?: Pick<QualityModel, 'sources' | 'resolution'> | null;
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
  const versionText = versionResult?.slice(1).find(Boolean);
  const version = versionText === undefined ? undefined : Number.parseInt(versionText, 10);

  if (versionResult && version !== undefined && !Number.isNaN(version)) {
    result.version = version;
  }

  let realCount = 0;
  // use non normalized title to prevent insensitive REAL matching
  while (realGlobalExp.test(title)) {
    realCount += 1;
  }

  result.real = realCount;

  if (properRegex.test(normalizedTitle)) {
    result.version = version === undefined || Number.isNaN(version) ? 2 : version + 1;
  }

  if (repackRegex.test(normalizedTitle)) {
    result.version = version === undefined || Number.isNaN(version) ? 2 : version + 1;
    result.isRepack = true;
  }

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
  const { resolution } = parseResolutionFromTitle(normalizedTitle);

  const commonSceneQuality = parseCommonSceneQuality(normalizedTitle, revision, resolution, codec);
  if (commonSceneQuality !== null) {
    return commonSceneQuality;
  }

  codec ??= parseVideoCodec(title).codec;
  const sourceGroups = parseSourceGroups(normalizedTitle);
  if (trailingWebExp.test(title.trim())) {
    sourceGroups.webdl = true;
  }
  if (!Object.values(sourceGroups).some(Boolean) && animeWebDlExp.test(title)) {
    sourceGroups.webdl = true;
  }
  const context: QualityContext = {
    title: title,
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

  if (
    !context.modifier &&
    getDefaultSources(context).length === 0 &&
    bareX264Exp.test(normalizedTitle)
  ) {
    return createQualityResult(context, {
      sources: [Source.TV],
      resolution: context.parsedResolution ?? Resolution.R480P,
    });
  }

  return createQualityResult(context);
}

function parseCommonSceneQuality(
  normalizedTitle: string,
  revision: Revision,
  resolution?: Resolution,
  codec?: VideoCodec,
): QualityModel | null {
  if (!isModernSceneResolution(resolution) || codec === VideoCodec.XVID) {
    return null;
  }

  if (codec === undefined && uncommonXvidExp.test(normalizedTitle)) {
    return null;
  }

  if (commonSceneBlurayExp.test(normalizedTitle)) {
    return createCommonSceneQuality(Source.BLURAY, revision, resolution);
  }

  if (commonSceneWebExp.test(normalizedTitle)) {
    return createCommonSceneQuality(Source.WEBDL, revision, resolution);
  }

  return null;
}

function isModernSceneResolution(
  resolution?: Resolution,
): resolution is Resolution.R1080P | Resolution.R2160P {
  return resolution === Resolution.R1080P || resolution === Resolution.R2160P;
}

function createCommonSceneQuality(
  source: Source.BLURAY | Source.WEBDL,
  revision: Revision,
  resolution: Resolution,
): QualityModel {
  return {
    sources: [source],
    resolution,
    revision,
    modifier: null,
  };
}

function parseQualityModifier(
  normalizedTitle: string,
  sourceGroups: SourceGroups,
): QualityModifier | null {
  if (isBrDisk(normalizedTitle, sourceGroups)) {
    return QualityModifier.BRDISK;
  }

  if (
    ((normalizedTitle.includes('remux') && remuxExp.test(normalizedTitle)) ||
      isGermanRemux(normalizedTitle)) &&
    !sourceGroups.webdl &&
    !sourceGroups.hdtv
  ) {
    return QualityModifier.REMUX;
  }

  if (rawHdExp.test(normalizedTitle)) {
    return QualityModifier.RAWHD;
  }

  return null;
}

function isBrDisk(normalizedTitle: string, sourceGroups: SourceGroups): boolean {
  if (!sourceGroups.bluray || hardBrDiskExclusionExp.test(normalizedTitle)) {
    return false;
  }

  // Explicit disc markers (BD50, BDMV, COMPLETE...) win over the German codec heuristic
  if (bdiskExp.test(normalizedTitle)) {
    return true;
  }

  if (hasGermanBrDiskExclusion(normalizedTitle)) {
    return false;
  }

  if (brDiskExclusionExp.test(normalizedTitle)) {
    return false;
  }

  return brDiskSourceExp.test(normalizedTitle) && discCodecExp.test(normalizedTitle);
}

/** Text after `german` when a year comes before it, upstream's `(?<=\d{4}).*German` */
function afterGermanWithYear(normalizedTitle: string): string | null {
  const germanIndex = normalizedTitle.search(germanTokenExp);
  if (germanIndex === -1 || !yearTokenExp.test(normalizedTitle.slice(0, germanIndex))) {
    return null;
  }

  return normalizedTitle.slice(germanIndex + 'german'.length);
}

// German.DL, or a year then German then a disc codec: German releases name the codec on remuxes
function hasGermanBrDiskExclusion(normalizedTitle: string): boolean {
  const germanIndex = normalizedTitle.search(germanTokenExp);
  if (germanIndex === -1) {
    return false;
  }

  if (germanDualLanguageExp.test(normalizedTitle.slice(germanIndex + 'german'.length))) {
    return true;
  }

  const afterGerman = afterGermanWithYear(normalizedTitle);
  return afterGerman !== null && germanDiscCodecExp.test(afterGerman);
}

// A year, German, then a disc codec and Blu-ray, upstream's GermanRemuxRegex
function isGermanRemux(normalizedTitle: string): boolean {
  const afterGerman = afterGermanWithYear(normalizedTitle);
  return (
    afterGerman !== null &&
    germanDiscCodecExp.test(afterGerman) &&
    germanBlurayExp.test(afterGerman)
  );
}

function createQualityResult(
  context: QualityContext,
  overrides: QualityResultOverrides = {},
): QualityModel {
  const resolution =
    overrides.resolution ?? context.parsedResolution ?? getDefaultResolution(context);
  let modifier = overrides.modifier ?? context.modifier;
  // Upstream has no remux quality below 1080p, a 720p remux is plain Blu-ray. Only an explicit
  // resolution counts, not a default like .mkv meaning 720p.
  if (
    modifier === QualityModifier.REMUX &&
    context.parsedResolution !== undefined &&
    context.parsedResolution !== Resolution.R1080P &&
    context.parsedResolution !== Resolution.R2160P
  ) {
    modifier = null;
  }
  return {
    sources: overrides.sources ?? getDefaultSources(context),
    resolution,
    revision: context.revision,
    modifier,
  };
}

function getDefaultResolution(context: QualityContext): Resolution | undefined {
  if (context.modifier === QualityModifier.RAWHD) {
    return Resolution.R1080P;
  }
  const extensionQuality = getExtensionQuality(context);
  if (extensionQuality) {
    return extensionQuality.resolution;
  }

  return getParsedSources(context).includes(Source.DVD) ? Resolution.R480P : undefined;
}

function getDefaultSources(context: QualityContext): Source[] {
  if (context.modifier === QualityModifier.BRDISK || context.modifier === QualityModifier.REMUX) {
    return [Source.BLURAY];
  }

  if (context.modifier === QualityModifier.RAWHD) {
    return [Source.TV];
  }

  const parsedSources = getParsedSources(context);
  if (parsedSources.length > 0) {
    return parsedSources;
  }

  return getExtensionQuality(context)?.sources ?? [];
}

function getParsedSources(context: QualityContext): Source[] {
  context.parsedSources ??= parseSource(context.normalizedTitle, context.sourceGroups);
  return context.parsedSources;
}

function getExtensionQuality(
  context: QualityContext,
): Pick<QualityModel, 'sources' | 'resolution'> | null {
  if (context.extensionQuality === undefined) {
    context.extensionQuality = getQualityFromExtension(context.title);
  }

  return context.extensionQuality;
}

function getQualityFromExtension(
  title: string,
): Pick<QualityModel, 'sources' | 'resolution'> | null {
  const extension = extensionExp.exec(title.trim())?.[0].toLowerCase();

  switch (extension) {
    case '.mkv':
    case '.mk3d': {
      return { sources: [Source.WEBDL], resolution: Resolution.R720P };
    }
    case '.m2ts': {
      return { sources: [Source.BLURAY], resolution: Resolution.R720P };
    }
    case '.img':
    case '.iso':
    case '.vob': {
      return { sources: [Source.DVD] };
    }
    case '.webm':
    case undefined: {
      return null;
    }
    default: {
      return sdtvExtensionSet.has(extension)
        ? { sources: [Source.TV], resolution: Resolution.R480P }
        : null;
    }
  }
}

const qualityPolicies: QualityPolicy[] = [
  {
    matches: ({ sourceGroups }) => sourceGroups.bluray,
    getOverrides: context =>
      getXvidBlurayOverrides(context) ?? {
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
      resolution:
        context.parsedResolution ??
        (highDefPdtvRegex.test(context.normalizedTitle) ? Resolution.R720P : Resolution.R480P),
    }),
  },
  {
    matches: ({ sourceGroups }) => sourceGroups.bdrip || sourceGroups.brrip,
    getOverrides: context =>
      getXvidBlurayOverrides(context) ?? {
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

function getXvidBlurayOverrides(context: QualityContext): QualityResultOverrides | null {
  if (context.codec !== VideoCodec.XVID) {
    return null;
  }

  return {
    sources: [Source.BLURAY],
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
  if (context.modifier === QualityModifier.BRDISK) {
    return Resolution.R1080P;
  }

  if (context.parsedResolution) {
    return context.parsedResolution;
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

  return context.title.includes('[WEBDL]') || animeWebDlExp.test(context.title)
    ? Resolution.R720P
    : Resolution.R480P;
}

function getHdtvResolution(context: QualityContext): Resolution | undefined {
  if (context.parsedResolution) {
    return context.parsedResolution;
  }

  return context.title.includes('[HDTV]') || !hdtvTokenExp.test(context.normalizedTitle)
    ? Resolution.R720P
    : Resolution.R480P;
}
