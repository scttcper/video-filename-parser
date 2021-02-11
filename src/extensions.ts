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

const fileExtensionExp = /\.[a-z0-9]{2,4}$/i;

export function removeFileExtension(title: string): string {
  return title.replace(fileExtensionExp, (x: string) => {
    if (fileExtensions.some(ext => ext === x)) {
      return '';
    }

    return x;
  });
}
