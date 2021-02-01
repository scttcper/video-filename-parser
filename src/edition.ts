// (?!\.[0-9]{4}\.) At the end attempts to check for the year
const editionTextExp = /\b(?<edition>((the.?)?((Extended.|Ultimate.)?(Director.?s|Collector.?s|Theatrical|Ultimate|Signature|Final|Rogue(?=(.(Cut|Edition|Version)))|Extended|Special|Despecialized|\d{2,3}(th)?.Anniversary)(.(Cut|Edition|Version))?(.(Extended|Uncensored|Remastered|Unrated|Uncut|IMAX|Fan.?Edit))?|((LIMITED|Uncensored|INTERNAL|Remastered|Unrated|Uncut|IMAX|Fan.?Edit|Edition|HDR|Restored|((2|3|4)in1))(?!\.[0-9]{4}\.)))))\)?\b/i;

const remasteredExp = /\b(Remastered|Anniversary|Restored)\b/i;
const imaxExp = /\b(IMAX)\b/i;
const unratedExp = /\b(Uncensored|Unrated)\b/i;
const extendedExp = /\b(Extended|Uncut|Ultimate|Rogue|Collector)\b/i;
const theatricalExp = /\b(Theatrical)\b/i;
const directorsExp = /\b(Directors?)\b/i;
const fanExp = /\b(Despecialized|Fan.?Edit)\b/i;
const limitedExp = /\b(LIMITED)\b/i;
const hdrExp = /\b(HDR)\b/i;
const internalExp = /\b(INTERNAL)\b/i;

export interface Edition {
  limited?: boolean;
  remastered?: boolean;
  extended?: boolean;
  theatrical?: boolean;
  directors?: boolean;
  unrated?: boolean;
  imax?: boolean;
  fanEdit?: boolean;
  hdr?: boolean;
  internal?: boolean;
}

export function parseEdition(title: string): Edition {
  const editionText = parseEditionText(title);

  const result: Edition = {
    imax: imaxExp.test(editionText) || undefined,
    remastered: remasteredExp.test(editionText) || undefined,
    extended: extendedExp.test(editionText) || undefined,
    theatrical: theatricalExp.test(editionText) || undefined,
    directors: directorsExp.test(editionText) || undefined,
    unrated: unratedExp.test(editionText) || undefined,
    fanEdit: fanExp.test(editionText) || undefined,
    limited: limitedExp.test(editionText) || undefined,
    hdr: hdrExp.test(editionText) || undefined,
    internal: internalExp.test(editionText) || undefined,
  };

  return result;
}

export function parseEditionText(title: string): string {
  const normalizedTitle = title.trim().replace(/\[/g, ' ').replace(/\]/g, ' ').trim();

  const result: string[] = [];

  const editionGlobalExp = RegExp(editionTextExp.source, 'gi');
  let expResult: RegExpExecArray | null;
  while ((expResult = editionGlobalExp.exec(normalizedTitle))) {
    if (expResult?.groups?.edition && expResult.groups.edition.length > 0) {
      result.push(expResult.groups.edition.replace(/\./g, ' '));
    }
  }

  return result.join(' ');
}
