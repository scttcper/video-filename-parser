// const properRegex = /\b(?<proper>proper|repack|rerip)\b/i;
// const realRegex = /\b(?<real>REAL)\b/i;
// const versionRegex = /\dv(?<version>\d)\b|\[v(?<version>\d)\]/i;

export enum QualityModifier {
  Remux = 'REMUX',
  Screener = 'SCREENER',
}

export function parseQualityModifyers() {

}

export function parseQuality(title: string) {
  const normalizedName = title.trim().replace(/_/g, ' ').trim().toLowerCase();
}
