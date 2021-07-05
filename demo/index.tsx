import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { filenameParse } from '../src';

ReactDOM.render(<Demo />, document.getElementById('root'));

function Demo() {
  const demoDefault = 'Iron.Man.2008.INTERNAL.REMASTERED.2160p.UHD.BluRay.X265-IAMABLE';
  const [result, setResult] = useState(filenameParse(demoDefault));
  const [input, setInput] = useState(demoDefault);
  const [isTvShow, setTvShow] = useState(false);

  function handleChange(event: any) {
    setInput(event.target.value);
    setResult(filenameParse(event.target.value, isTvShow));
  }

  function handleToggleTvShow(event: any) {
    setTvShow(event.target.checked);
    setResult(filenameParse(input, event.target.checked));
  }

  return (
    <div className="py-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-3">Demo</h3>
      <div className="mt-2 text-sm leading-5 text-gray-600">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title of release
          </label>
          <div className="mt-1 mb-2">
            <textarea
              id="title"
              name="title"
              className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="Title"
              defaultValue={demoDefault}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <input
                id="tvshow"
                name="tvshow"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                onChange={handleToggleTvShow}
              />
              <label htmlFor="tvshow" className="ml-2 block text-sm text-gray-900">
                Parse as TV Show
              </label>
            </div>
          </div>
        </div>
        <label className="block text-sm font-medium text-gray-700">Output</label>
        <pre className="bg-gray-100 rounded-lg p-2 md:py-4 text-gray-900 text-xs">
          <code>{JSON.stringify(result, undefined, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
