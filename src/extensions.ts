import { Source } from './source';
import { Resolution } from './resolution';

export const fileExtensions = [
  // Unknown
  { extension: '.webm', source: null },

  // SDTV
  { extension: '.m4v', source: Source.TV },
  { extension: '.3gp', source: Source.TV },
  { extension: '.nsv', source: Source.TV },
  { extension: '.ty', source: Source.TV },
  { extension: '.strm', source: Source.TV },
  { extension: '.rm', source: Source.TV },
  { extension: '.rmvb', source: Source.TV },
  { extension: '.m3u', source: Source.TV },
  { extension: '.ifo', source: Source.TV },
  { extension: '.mov', source: Source.TV },
  { extension: '.qt', source: Source.TV },
  { extension: '.divx', source: Source.TV },
  { extension: '.xvid', source: Source.TV },
  { extension: '.bivx', source: Source.TV },
  { extension: '.nrg', source: Source.TV },
  { extension: '.pva', source: Source.TV },
  { extension: '.wmv', source: Source.TV },
  { extension: '.asf', source: Source.TV },
  { extension: '.asx', source: Source.TV },
  { extension: '.ogm', source: Source.TV },
  { extension: '.ogv', source: Source.TV },
  { extension: '.m2v', source: Source.TV },
  { extension: '.avi', source: Source.TV },
  { extension: '.bin', source: Source.TV },
  { extension: '.dat', source: Source.TV },
  { extension: '.dvr-ms', source: Source.TV },
  { extension: '.mpg', source: Source.TV },
  { extension: '.mpeg', source: Source.TV },
  { extension: '.mp4', source: Source.TV },
  { extension: '.avc', source: Source.TV },
  { extension: '.vp3', source: Source.TV },
  { extension: '.svq3', source: Source.TV },
  { extension: '.nuv', source: Source.TV },
  { extension: '.viv', source: Source.TV },
  { extension: '.dv', source: Source.TV },
  { extension: '.fli', source: Source.TV },
  { extension: '.flv', source: Source.TV },
  { extension: '.wpl', source: Source.TV },

  // DVD
  { extension: '.img', source: Source.DVD },
  { extension: '.iso', source: Source.DVD },
  { extension: '.vob', source: Source.DVD },

  // HD
  { extension: '.mkv', source: Source.WEBDL },
  { extension: '.mk3d', source: Source.WEBDL },
  { extension: '.ts', source: Source.TV },
  { extension: '.wtv', source: Source.TV },

  // Bluray
  { extension: '.m2ts', source: Source.BLURAY },
];

export const resolutionExt = [
  // HD
  { extension: '.mkv', resolution: Resolution.R720P },
  { extension: '.mk3d', resolution: Resolution.R720P },
  { extension: '.ts', resolution: Resolution.R720P },
  { extension: '.wtv', resolution: Resolution.R720P },

  // Bluray
  { extension: '.m2ts', resolution: Resolution.R720P },
];

const fileExtensionExp = /\.[a-z0-9]{2,4}$/i;

export function removeFileExtension(title: string): string {
  return title.replace(fileExtensionExp, (x: string) => {
    if (fileExtensions.some(ext => ext.extension === x)) {
      return '';
    }

    return x;
  });
}

export function getSourceForExtension(extension: string): Source[] {
  const ext = fileExtensions.find(x => x.extension === extension);
  if (ext) {
    return [ext.source as Source];
  }

  return [];
}

export function getResolutionForExtension(extension: string): Resolution | undefined {
  const ext = resolutionExt.find(x => x.extension === extension);
  if (ext) {
    return ext.resolution;
  }
}
