export interface TitleAndYear {
  title: string;
  year: string | null;
}

export interface TitleYearPattern {
  name: string;
  regex: RegExp;
  /** Cheap check run before the regex, for patterns that only apply to some titles */
  guard?: RegExp;
  /** Rejects a match after the fact, given the match and the original release title */
  accept?: (match: RegExpExecArray, title: string) => boolean;
}
