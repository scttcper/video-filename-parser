export enum Channels {
  SEVEN = '7.1',
  SIX = '5.1',
  STEREO = 'stereo',
  MONO = 'mono',
}

const channelPatterns: ReadonlyArray<{ channels: Channels; regex: RegExp }> = [
  { channels: Channels.SEVEN, regex: /(?<!\d)7[\W_][01]\b/i },
  {
    channels: Channels.SIX,
    regex: /(?<!\d)((6[\W]0(?:ch)?)(?=[^\d]|$)|(5[\W][01](?:ch)?)(?=[^\d]|$)|5ch|6ch)\b/i,
  },
  { channels: Channels.STEREO, regex: /(?<!\d)(2[\W]0(?:ch)?)(?=[^\d]|$)|\bstereo\b/i },
  { channels: Channels.MONO, regex: /(?<!\d)(1[\W]0(?:ch)?)(?=[^\d]|$)|\b(?:mono|1ch)\b/i },
];

const channelCandidateExp =
  /(?:^|[^\d])(?:7[\W_][01]|[56](?:[\W][01]|ch)|2[\W]0|1(?:[\W]0|ch)|stereo|mono)/i;

export function parseAudioChannels(title: string): { channels?: Channels; source?: string } {
  if (!channelCandidateExp.test(title)) {
    return {};
  }

  for (const { channels, regex } of channelPatterns) {
    const match = regex.exec(title);
    if (match) {
      return { channels, source: match[0] };
    }
  }
  return {};
}
