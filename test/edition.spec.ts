import { parseEditionText } from '../src';

describe('parseEditionText', () => {
  const cases: Array<[string, string]> = [
    ['Prometheus 2012 Directors Cut', 'Directors Cut'],
    ['Star Wars Episode IV - A New Hope 1999 (Despecialized).mkv', 'Despecialized'],
    ['Prometheus.2012.(Special.Edition.Remastered).[Bluray-1080p].mkv', 'Special Edition Remastered'],
    ['Prometheus 2012 Extended', 'Extended'],
    ['Prometheus 2012 The Extended Cut', 'The Extended Cut'],
    ['Prometheus 2012 Extended Directors Cut Fan Edit', 'Extended Directors Cut Fan Edit'],
    ['Prometheus 2012 Director\'s Cut', 'Director\'s Cut'],
    ['Prometheus 2012 Directors Cut', 'Directors Cut'],
    ['Prometheus.2012.(Extended.Theatrical.Version.IMAX).BluRay.1080p.2012.asdf', 'Extended Theatrical Version IMAX'],
    ['2001 A Space Odyssey (1968) Director\'s Cut .mkv', 'Director\'s Cut'],
    ['2001: A Space Odyssey 1968 (Extended Directors Cut FanEdit)', 'Extended Directors Cut FanEdit'],
    ['A Fake Movie 2035 2012 Directors.mkv', 'Directors'],
    ['Blade Runner 2049 Director\'s Cut.mkv', 'Director\'s Cut'],
    ['Prometheus 2012 50th Anniversary Edition.mkv', '50th Anniversary Edition'],
    ['Movie 2012 2in1.mkv', '2in1'],
    ['Movie 2012 IMAX.mkv', 'IMAX'],
    ['Movie 2012 Restored.mkv', 'Restored'],
    ['Prometheus.Special.Edition.Fan Edit.2012..BRRip.x264.AAC-m2g', 'Special Edition Fan Edit'],
    ['Star Wars Episode IV - A New Hope (Despecialized) 1999.mkv', 'Despecialized'],
    ['Prometheus.(Special.Edition.Remastered).2012.[Bluray-1080p].mkv', 'Special Edition Remastered'],
    ['Prometheus Extended 2012', 'Extended'],
    ['Prometheus Extended Directors Cut Fan Edit 2012', 'Extended Directors Cut Fan Edit'],
    ['Prometheus Director\'s Cut 2012', 'Director\'s Cut'],
    ['Prometheus Directors Cut 2012', 'Directors Cut'],
    ['Prometheus.(Extended.Theatrical.Version.IMAX).2012.BluRay.1080p.asdf', 'Extended Theatrical Version IMAX'],
    ['2001 A Space Odyssey Director\'s Cut (1968).mkv', 'Director\'s Cut'],
    ['2001: A Space Odyssey (Extended Directors Cut FanEdit) 1968 Bluray 1080p', 'Extended Directors Cut FanEdit'],
    ['A Fake Movie 2035 Directors 2012.mkv', 'Directors'],
    ['Blade Runner Director\'s Cut 2049.mkv', 'Director\'s Cut'],
    ['Prometheus 50th Anniversary Edition 2012.mkv', '50th Anniversary Edition'],
    ['Movie 2in1 2012.mkv', '2in1'],
    ['Movie IMAX 2012.mkv', 'IMAX'],
    ['Fake Movie Final Cut 2016', 'Final Cut'],
    ['Fake Movie 2016 Final Cut ', 'Final Cut'],
    ['My Movie GERMAN Extended Cut 2016', 'Extended Cut'],
    ['My.Movie.GERMAN.Extended.Cut.2016', 'Extended Cut'],
    ['My.Movie.GERMAN.Extended.Cut', 'Extended Cut'],
    ['Mission Impossible: Rogue Nation 2012 Bluray', ''],
    ['X-Men Days of Future Past 2014 THE ROGUE CUT BRRip XviD AC3-EVO', 'THE ROGUE CUT'],
    ['Loving.Pablo.2018.TS.FRENCH.MD.x264-DROGUERiE', ''],
  ];
  test.each(cases)('should get edition of "%s"', (title, expected) => {
    expect(parseEditionText(title)).toBe(expected);
  });
});
