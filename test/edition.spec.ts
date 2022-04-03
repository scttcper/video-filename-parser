import test from 'ava';

import { Edition, parseEdition } from '../src/index.js';

const cases: Array<[string, Partial<Edition>]> = [
  ['Prometheus 2012 Directors Cut', { directors: true }],
  ['Star Wars Episode IV - A New Hope 1999 (Despecialized).mkv', { fanEdit: true }],
  ['Prometheus.2012.(Special.Edition.Remastered).[Bluray-1080p].mkv', { remastered: true }],
  ['Prometheus 2012 Extended', { extended: true }],
  ['Prometheus 2012 The Extended Cut', { extended: true }],
  [
    'Prometheus 2012 Extended Directors Cut Fan Edit',
    { directors: true, fanEdit: true, extended: true },
  ],
  [
    'Prometheus.2012.(Extended.Theatrical.Version.IMAX).BluRay.1080p.2012.asdf',
    { imax: true, theatrical: true, extended: true },
  ],
  [
    '2001: A Space Odyssey 1968 (Extended Directors Cut FanEdit)',
    { fanEdit: true, directors: true, extended: true },
  ],
  ['A Fake Movie 2035 2012 Directors.mkv', { directors: true }],
  ["Blade Runner 2049 Director's Cut.mkv", { directors: true }],
  ['Prometheus 2012 50th Anniversary Edition.mkv', { remastered: true }],
  ['Movie 2012 IMAX.mkv', { imax: true }],
  ['Movie 2012 Restored.mkv', { remastered: true }],
  ['Prometheus.Special.Edition.Fan Edit.2012..BRRip.x264.AAC-m2g', { fanEdit: true }],
  ['Star Wars Episode IV - A New Hope (Despecialized) 1999.mkv', { fanEdit: true }],
  ['Prometheus.(Special.Edition.Remastered).2012.[Bluray-1080p].mkv', { remastered: true }],
  ['Prometheus Extended 2012', { extended: true }],
  [
    'Prometheus Extended Directors Cut Fan Edit 2012',
    { extended: true, directors: true, fanEdit: true },
  ],
  [
    'Prometheus.(Extended.Theatrical.Version.IMAX).2012.BluRay.1080p.asdf',
    { extended: true, theatrical: true, imax: true },
  ],
  [
    '2001: A Space Odyssey (Extended Directors Cut FanEdit) 1968 Bluray 1080p',
    { extended: true, fanEdit: true, directors: true },
  ],
  ['Prometheus 50th Anniversary Edition 2012.mkv', { remastered: true }],
  ['X-Men Days of Future Past 2014 THE ROGUE CUT BRRip XviD AC3-EVO', { extended: true }],
  ['Alita Battle Angel 2019 INTERNAL HDR 2160p WEB H265-DEFLATE', { internal: true, hdr: true }],
  [
    'Wonder.Woman.1984.2020.IMAX.3D.1080p.BluRay.Half-SBS.DTS-HD.MA.5.1.X264-EVO',
    { imax: true, threeD: true, hsbs: true },
  ],
  [
    'Warcraft.The.Beginning.3D.HOU.2016.German.DL.1080p.BluRay.x264-COiNCiDENCE',
    { threeD: true, hou: true },
  ],
  [
    'Iron.Man.2008.INTERNAL.REMASTERED.2160p.UHD.BluRay.X265-IAMABLE',
    { uhd: true, remastered: true, internal: true },
  ],
  ['Long Shot 2019 DV 2160p WEB H265-SLOT', { dolbyVision: true }],
  [
    'Sicario 2015 Hybrid 2160p UHD BluRay REMUX DV HDR10+ HEVC TrueHD 7.1 Atmos-WiLDCAT',
    { uhd: true, dolbyVision: true },
  ],
];

for (const [title, result] of cases) {
  test(`get edition from "${title}"`, t => {
    t.deepEqual(parseEdition(title), result);
  });
}
