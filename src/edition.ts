const editionTextExp = /\b(?<edition>((the.?)?((Extended.|Ultimate.)?(Director.?s|Collector.?s|Theatrical|Ultimate|Final|Rogue(?=(.(Cut|Edition|Version)))|Extended|Special|Despecialized|\d{2,3}(th)?.Anniversary)(.(Cut|Edition|Version))?(.(Extended|Uncensored|Remastered|Unrated|Uncut|IMAX|Fan.?Edit))?|((Uncensored|Remastered|Unrated|Uncut|IMAX|Fan.?Edit|Edition|Restored|((2|3|4)in1))))))\)?\b/i;

export enum Edition {
  Remastered = 'REMASTERED',
  Extended = 'EXTENDED',
  Theatrical = 'THEATRICAL',
  Directors = 'DIRECTORS',
  Unrated = 'UNRATED',
  IMAX = 'IMAX',
}

export type Editions = Record<Edition, boolean>;

// export function parseEdition(): Editions {
//   return {};
// }

export function parseEditionText(title: string): string {
  const result = editionTextExp.exec(title);
  if (result && result.groups && result.groups.edition && result.groups.edition.length > 0) {
    return result.groups.edition.replace(/\./g, ' ');
  }

  return '';
}
