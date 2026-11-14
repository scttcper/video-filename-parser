export interface TitleAndYear {
  title: string;
  year: string | null;
}

export interface TitleYearPattern {
  name: string;
  regex: RegExp;
  /** Cheap check run before the regex, for patterns that only apply to some titles */
  guard?: RegExp;
}
