import { removeFileExtension } from './extensions.js';
import { simplifyTitle } from './simplifyTitle.js';
import { parseTitleAndYear } from './title.js';

const websitePrefixExp = /^\[\s*[a-z]+(\.[a-z]+)+\s*\][- ]*|^www\.[a-z]+\.(?:com|net)[ -]*/i;
const cleanReleaseGroupExp =
  /(-(RP|1|NZBGeek|Obfuscated|Obfuscation|Scrambled|sample|Pre|postbot|xpost|Rakuv[a-z0-9]*|WhiteRev|BUYMORE|AsRequested|AlternativeToRequested|GEROV|Z0iDS3N|Chamele0n|4P|4Planet|AlteZachen|RePACKPOST))+$/i;
const releaseGroupRegexExp =
  /-(?<releasegroup>[a-z0-9]+)(?<!WEB-DL|WEB-RIP|480p|720p|1080p|2160p|DTS-(HD|X|MA|ES)|([a-zA-Z]{3}-ENG))(?:\b|[-._ ])/i;
const animeReleaseGroupExp = /^(?:\[(?<subgroup>(?!\s).+?(?<!\s))\](?:_|-|\s|\.)?)/i;
const exceptionReleaseGroupRegex =
  /(\[)?(?<releasegroup>(Joy|YIFY|YTS.(MX|LT|AG)|FreetheFish|VH-PROD|FTW-HS|DX-TV|Blu-bits|afm72|Anna|Bandi|Ghost|Kappa|MONOLITH|Qman|RZeroX|SAMPA|Silence|theincognito|D-Z0N3|t3nzin|Vyndros|HDO|DusIctv|DHD|SEV|CtrlHD|-ZR-|ADC|XZVN|RH|Kametsu|r00t|HONE))(\])?$/i;
const globalReleaseGroupExp = new RegExp(releaseGroupRegexExp.source, 'ig');

export function parseGroup(title: string, parsedTitle?: string): string | null {
  const nowebsiteTitle = title.replace(websitePrefixExp, '');
  let releaseTitle = parsedTitle ?? parseTitleAndYear(nowebsiteTitle).title;
  releaseTitle = releaseTitle.replace(/ /g, '.');
  let trimmed = nowebsiteTitle
    .replace(/ /g, '.')
    .replace(releaseTitle === nowebsiteTitle ? '' : releaseTitle, '')
    .replace(/\.-\./g, '.');
  trimmed = simplifyTitle(removeFileExtension(trimmed.trim()));

  if (trimmed.length === 0) {
    return null;
  }

  const exceptionResult = exceptionReleaseGroupRegex.exec(trimmed);
  if (exceptionResult?.groups?.releasegroup) {
    return exceptionResult.groups.releasegroup;
  }

  const animeResult = animeReleaseGroupExp.exec(trimmed);
  if (animeResult?.groups) {
    return animeResult.groups.subgroup ?? '';
  }

  trimmed = trimmed.replace(cleanReleaseGroupExp, '');

  globalReleaseGroupExp.lastIndex = 0;
  let result: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((result = globalReleaseGroupExp.exec(trimmed))) {
    if (!result?.groups) {
      continue;
    }

    const group = result.groups.releasegroup ?? '';

    return group;
  }

  return null;
}
