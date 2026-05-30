export enum Channels {
  SEVEN = '7.1',
  SIX = '5.1',
  STEREO = 'stereo',
  MONO = 'mono',
}

const channelPatterns: Array<{ channels: Channels; regex: RegExp }> = [
  { channels: Channels.SEVEN, regex: /\b7.?[01]\b/i },
  {
    channels: Channels.SIX,
    regex: /\b((6[\W]0(?:ch)?)(?=[^\d]|$)|(5[\W][01](?:ch)?)(?=[^\d]|$)|5ch|6ch)\b/i,
  },
  { channels: Channels.STEREO, regex: /((2[\W]0(?:ch)?)(?=[^\d]|$))|(stereo)/i },
  { channels: Channels.MONO, regex: /(1[\W]0(?:ch)?)(?=[^\d]|$)|(mono)|(1ch)/i },
];

export function parseAudioChannels(title: string): { channels?: Channels; source?: string } {
  for (const { channels, regex } of channelPatterns) {
    const match = regex.exec(title);
    if (match) {
      return { channels, source: match[0] };
    }
  }
  return {};
}
