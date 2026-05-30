import { type ReactNode } from 'react';

const jsonTokenPattern =
  /(?<key>"(?:\\u[\dA-Fa-f]{4}|\\[^u]|[^\\"])*")(?=\s*:)|(?<string>"(?:\\u[\dA-Fa-f]{4}|\\[^u]|[^\\"])*")|(?<boolean>\b(?:true|false)\b)|(?<null>\bnull\b)|(?<number>-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[Ee][+-]?\d+)?)/g;

export function highlightJson(json: string) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of json.matchAll(jsonTokenPattern)) {
    const index = match.index ?? 0;
    const token = match[0];

    if (index > lastIndex) {
      parts.push(json.slice(lastIndex, index));
    }

    parts.push(
      <span key={`${index}-${token}`} className={getTokenClass(match.groups)}>
        {token}
      </span>,
    );
    lastIndex = index + token.length;
  }

  if (lastIndex < json.length) {
    parts.push(json.slice(lastIndex));
  }

  return parts;
}

function getTokenClass(groups: Record<string, string | undefined> | undefined) {
  if (groups?.key !== undefined) {
    return 'text-sky-300';
  }

  if (groups?.string !== undefined) {
    return 'text-lime-300';
  }

  if (groups?.number !== undefined) {
    return 'text-amber-300';
  }

  if (groups?.boolean !== undefined) {
    return 'text-fuchsia-300';
  }

  return 'text-zinc-500';
}
