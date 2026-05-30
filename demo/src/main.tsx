import { type ChangeEvent, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { filenameParse } from '../../src/index.js';

import { highlightJson } from './jsonHighlight.js';

declare global {
  interface Window {
    videoFilenameParserRoot?: ReturnType<typeof createRoot>;
  }
}

const container = document.getElementById('root')!;
const root = window.videoFilenameParserRoot ?? createRoot(container);
window.videoFilenameParserRoot = root;
root.render(<Demo />);

const examples = [
  {
    label: '4K Movie',
    value: 'Iron.Man.2008.INTERNAL.REMASTERED.2160p.UHD.BluRay.X265-IAMABLE',
    isTv: false,
  },
  {
    label: 'TV Episode',
    value: 'The.Last.of.Us.S01E03.Long.Long.Time.1080p.WEB.H264-GGEZ',
    isTv: true,
  },
  {
    label: 'Remux',
    value: 'Dune.Part.Two.2024.2160p.UHD.BluRay.REMUX.DV.HDR.HEVC.TrueHD.7.1.Atmos-FLUX',
    isTv: false,
  },
  {
    label: 'Anime',
    value: '[SubsPlease] Frieren - Beyond Journeys End - 16 (1080p) [A1B2C3D4]',
    isTv: true,
  },
] as const;

function Demo() {
  const demoDefault = 'Iron.Man.2008.INTERNAL.REMASTERED.2160p.UHD.BluRay.X265-IAMABLE';
  const [input, setInput] = useState(demoDefault);
  const [isTvShow, setIsTvShow] = useState(false);
  const [selectedExample, setSelectedExample] = useState('0');

  const result = useMemo(() => filenameParse(input, isTvShow), [input, isTvShow]);
  const json = useMemo(() => JSON.stringify(result, undefined, 2), [result]);
  const highlightedJson = useMemo(() => highlightJson(json), [json]);
  const resultFieldCount = Object.keys(result).length;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    setSelectedExample('');
  };

  const handleExampleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedExample(event.target.value);
    const example = examples[Number(event.target.value)];
    if (example === undefined) {
      return;
    }

    setInput(example.value);
    setIsTvShow(example.isTv);
  };

  return (
    <section className="grid gap-8 text-left lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Try it live</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-300">
            Paste a release name, choose the parser mode, and inspect the exact JSON result.
          </p>
        </div>

        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-zinc-200">
            Release name
          </label>
          <textarea
            id="title"
            name="title"
            rows={5}
            className="w-full min-w-0 resize-y rounded-md bg-zinc-950/70 px-3.5 py-3 font-mono text-sm leading-6 text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-zinc-500 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-300"
            placeholder="Enter release name"
            value={input}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="example" className="mb-2 block text-sm font-medium text-zinc-200">
              Example
            </label>
            <select
              id="example"
              className="w-full rounded-md bg-zinc-950/70 px-3 py-2 text-sm text-white outline outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-300"
              value={selectedExample}
              onChange={handleExampleChange}
            >
              <option value="">Custom input</option>
              {examples.map((example, index) => (
                <option key={example.label} value={index}>
                  {example.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-zinc-200">Mode</p>
            <div className="grid grid-cols-2 overflow-hidden rounded-md text-sm font-semibold outline outline-1 -outline-offset-1 outline-white/10">
              <button
                type="button"
                className={
                  !isTvShow
                    ? 'bg-white px-4 py-2 text-zinc-950'
                    : 'px-4 py-2 text-zinc-400 hover:text-white'
                }
                onClick={() => {
                  setIsTvShow(false);
                }}
              >
                Movie
              </button>
              <button
                type="button"
                className={
                  isTvShow
                    ? 'bg-white px-4 py-2 text-zinc-950'
                    : 'px-4 py-2 text-zinc-400 hover:text-white'
                }
                onClick={() => {
                  setIsTvShow(true);
                }}
              >
                TV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-white">Parsed JSON</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {isTvShow ? 'TV parser' : 'Movie parser'} returned {resultFieldCount} fields.
          </p>
        </div>
        <pre className="max-h-[34rem] overflow-auto rounded-md bg-zinc-950/80 p-4 text-xs leading-5 text-zinc-200 ring-1 ring-white/10">
          <code>{highlightedJson}</code>
        </pre>
      </div>
    </section>
  );
}
