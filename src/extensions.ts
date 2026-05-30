export const fileExtensions = [
  // Unknown
  '.webm',
  // SDTV
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

  // DVD
  '.img',
  '.iso',
  '.vob',

  // HD
  '.mkv',
  '.mk3d',
  '.ts',
  '.wtv',

  // Bluray
  '.m2ts',
];

const supportedFileExtensions = new Set(fileExtensions);
const minExtensionLength = 3; // .ts
const maxExtensionLength = 7; // .dvr-ms
const code = {
  dot: '.'.charCodeAt(0),
  a: 'a'.charCodeAt(0),
  b: 'b'.charCodeAt(0),
  e: 'e'.charCodeAt(0),
  f: 'f'.charCodeAt(0),
  g: 'g'.charCodeAt(0),
  i: 'i'.charCodeAt(0),
  k: 'k'.charCodeAt(0),
  l: 'l'.charCodeAt(0),
  m: 'm'.charCodeAt(0),
  o: 'o'.charCodeAt(0),
  p: 'p'.charCodeAt(0),
  s: 's'.charCodeAt(0),
  t: 't'.charCodeAt(0),
  v: 'v'.charCodeAt(0),
  w: 'w'.charCodeAt(0),
  four: '4'.charCodeAt(0),
  two: '2'.charCodeAt(0),
};

export function removeFileExtension(title: string): string {
  const extensionStart = findCandidateExtensionStart(title);
  if (extensionStart === -1) {
    return title;
  }

  if (hasCommonFileExtension(title, extensionStart)) {
    return title.slice(0, extensionStart);
  }

  const extension = title.slice(extensionStart).toLowerCase();
  if (supportedFileExtensions.has(extension) || fileExtensions.includes(extension)) {
    return title.slice(0, extensionStart);
  }

  return title;
}

function hasCommonFileExtension(title: string, extensionStart: number): boolean {
  const extensionLength = title.length - extensionStart;

  switch (extensionLength) {
    case 3: {
      return hasCommonTwoCharacterExtension(title, extensionStart);
    }
    case 4: {
      return hasCommonThreeCharacterExtension(title, extensionStart);
    }
    case 5: {
      return hasCommonFourCharacterExtension(title, extensionStart);
    }
    default: {
      return false;
    }
  }
}

function findCandidateExtensionStart(title: string): number {
  const minStart = Math.max(0, title.length - maxExtensionLength);

  for (let i = title.length - minExtensionLength; i >= minStart; i--) {
    if (title.charCodeAt(i) === code.dot) {
      return i;
    }
  }

  return -1;
}

function hasCommonTwoCharacterExtension(title: string, start: number): boolean {
  // .ts
  return (
    lowerAsciiCodeAt(title, start + 1) === code.t && lowerAsciiCodeAt(title, start + 2) === code.s
  );
}

function hasCommonThreeCharacterExtension(title: string, start: number): boolean {
  const first = lowerAsciiCodeAt(title, start + 1);
  const second = lowerAsciiCodeAt(title, start + 2);
  const third = lowerAsciiCodeAt(title, start + 3);

  switch (first) {
    case code.a: {
      return second === code.v && third === code.i; // .avi
    }
    case code.f: {
      return second === code.l && third === code.v; // .flv
    }
    case code.m: {
      return (
        (second === code.k && third === code.v) || // .mkv
        (second === code.p && third === code.four) || // .mp4
        (second === code.o && third === code.v) || // .mov
        (second === code.four && third === code.v) || // .m4v
        (second === code.p && third === code.g) // .mpg
      );
    }
    case code.w: {
      return second === code.m && third === code.v; // .wmv
    }
    default: {
      return false;
    }
  }
}

function hasCommonFourCharacterExtension(title: string, start: number): boolean {
  const first = lowerAsciiCodeAt(title, start + 1);
  const second = lowerAsciiCodeAt(title, start + 2);
  const third = lowerAsciiCodeAt(title, start + 3);
  const fourth = lowerAsciiCodeAt(title, start + 4);

  switch (first) {
    case code.m: {
      return (
        (second === code.p && third === code.e && fourth === code.g) || // .mpeg
        (second === code.two && third === code.t && fourth === code.s) // .m2ts
      );
    }
    case code.w: {
      return second === code.e && third === code.b && fourth === code.m; // .webm
    }
    default: {
      return false;
    }
  }
}

function lowerAsciiCodeAt(value: string, index: number): number {
  const charCode = value.charCodeAt(index);

  return charCode >= 65 && charCode <= 90 ? charCode + 32 : charCode;
}
