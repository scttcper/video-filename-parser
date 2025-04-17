import type React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { filenameParse } from '../../src/index.js';

const root = createRoot(document.getElementById('root')!);
root.render(<Demo />);

function Demo() {
  const demoDefault = 'Iron.Man.2008.INTERNAL.REMASTERED.2160p.UHD.BluRay.X265-IAMABLE';
  const [result, setResult] = useState(filenameParse(demoDefault));
  const [input, setInput] = useState(demoDefault);
  const [isTvShow, setIsTvShow] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    setResult(filenameParse(event.target.value, isTvShow));
  };

  const handleToggleTvShow = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTvShow(event.target.checked);
    setResult(filenameParse(input, event.target.checked));
  };

  return (
    <>
      <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Try it out!
      </h2>
      <p className="mt-4 text-center text-lg text-gray-300">
        Enter a video release name below to see the parsed metadata.
      </p>
      <div className="mx-auto mt-10">
        <div className="mb-4">
          <label htmlFor="title" className="sr-only">
            Release Name
          </label>
          <textarea
            id="title"
            name="title"
            rows={3}
            className="min-w-0 flex-auto rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-white sm:text-sm/6 w-full"
            placeholder="Enter release name"
            value={input}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-start mb-6">
          <input
            id="tvshow"
            name="tvshow"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 bg-white/10 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900 cursor-pointer"
            checked={isTvShow}
            onChange={handleToggleTvShow}
          />
          <label
            htmlFor="tvshow"
            className="ml-3 block text-sm leading-6 text-gray-300 cursor-pointer select-none"
          >
            Parse as TV Show
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-300 mb-2">Output</label>
          <SyntaxHighlighter
            language="json"
            style={atomDark}
            customStyle={{
              borderRadius: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              fontSize: '0.75rem',
            }}
          >
            {JSON.stringify(result, undefined, 2)}
          </SyntaxHighlighter>
        </div>
      </div>
    </>
  );
}
