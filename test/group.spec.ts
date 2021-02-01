import { parseGroup } from '../src';

describe('parseGroup', () => {
  const cases: Array<[string, string | null]> = [
    ['Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS.mkv', 'SiNNERS'],
    ['Up.REPACK.720p.Bluray.x264-CBGB', 'CBGB'],
    ['Castle.2009.S01E14.English.HDTV.XviD-LOL', 'LOL'],
    ['Castle 2009 S01E14 English HDTV XviD LOL', null],
    ['Acropolis Now S05 EXTRAS DVDRip XviD RUNNER', null],
    ['Punky.Brewster.S01.EXTRAS.DVDRip.XviD-RUNNER', 'RUNNER'],
    ['2020.NZ.2011.12.02.PDTV.XviD-C4TV', 'C4TV'],
    ['The.Office.S03E115.DVDRip.XviD-OSiTV', 'OSiTV'],
    ['The Office - S01E01 - Pilot [HTDV-480p]', null],
    ['The Office - S01E01 - Pilot [HTDV-720p]', null],
    ['The Office - S01E01 - Pilot [HTDV-1080p]', null],
    ['The.Walking.Dead.S04E13.720p.WEB-DL.AAC2.0.H.264-Cyphanix', 'Cyphanix'],
    ['Arrow.S02E01.720p.WEB-DL.DD5.1.H.264.mkv', null],
    ['Series Title S01E01 Episode Title', null],
    ['The Colbert Report - 2014-06-02 - Thomas Piketty.mkv', null],
    ['Real Time with Bill Maher S12E17 May 23, 2014.mp4', null],
    // ['Reizen Waes - S01E08 - Transistri\u00EB, Zuid-Osseti\u00EB en Abchazi\u00EB SDTV.avi', null],
    ['Simpsons 10x11 - Wild Barts Cant Be Broken [rl].avi', null],
    ['[ www.Torrenting.com ] - Revenge.S03E14.720p.HDTV.X264-DIMENSION', 'DIMENSION'],
    ['Seed S02E09 HDTV x264-2HD [eztv]-[rarbg.com]', '2HD'],
    ['7s-atlantis-s02e01-720p.mkv', null],
    ['The.Middle.720p.HEVC.x265-MeGusta-Pre', 'MeGusta'],
    ['Haunted.Hayride.2018.720p.WEBRip.DDP5.1.x264-NTb-postbot', 'NTb'],
    ['Haunted.Hayride.2018.720p.WEBRip.DDP5.1.x264-NTb-xpost', 'NTb'],
    ['Men.in.Black.International.2019.BluRay.1080p.AVC.DTS-HD.MA5.1-CHDBits-RakuvArrow', 'CHDBits'],
    ['Aladdin.2019.1080p.BluRay.x264-SPARKS-WhiteRev', 'SPARKS'],
    ['Elvis.Presley.The.Searcher.2018.1080p.BluRay.x264-HANDJOB-BUYMORE', 'HANDJOB'],
    ['Kill.Bill.Vol.2.2004.1080p.BluRay.DTS.x264-CyTSuNee-AsRequested', 'CyTSuNee'],
    [
      'The.Good.Doctor.S02E17.Breakdown.1080p.AMZN.WEB-DL.DDP5.1.H.264-SiGMA-AlternativeToRequested',
      'SiGMA',
    ],
    ['Mandy.2018.NORDiC.1080p.BluRay.x264-EGEN-GEROV', 'EGEN'],
    ['TheEqualizer.2.2018.1080p.BluRay.DTS.X264-CMRG-Z0iDS3N', 'CMRG'],
    ['Ghosthouse.1988.720p.BluRay.x264-SADPANDA-Chamele0n', 'SADPANDA'],
    ['The.Walking.Dead.S08E08.1080p.BluRay.x264-ROVERS-4P', 'ROVERS'],
    ['Stranger.Things.S01E02.720p.BluRay.X264-REWARD-4Planet', 'REWARD'],
    ['Stranger.Things.S01E02.720p.BluRay.X264-REWARD-AlteZachen', 'REWARD'],
    ['Spider-Man Far from Home.2019.1080p.HDRip.X264.AC3-EVO', 'EVO'],
  ];
  test.each(cases)('should parse group "%s"', (title, expected) => {
    expect(parseGroup(title)).toBe(expected);
  });
});
