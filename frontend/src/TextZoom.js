import React from 'react';
import { Tooltip } from 'flowbite-react';

function DecreaseIcon({ onClick }) {
  return (
    <Tooltip content="Pienennä tekstin kokoa">
      <button
        type="button"
        className="px-2 py-2 mr-2 text-center text-white bg-red-700 rounded-full text-md hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 tooltip-button"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
        </svg>
      </button>
    </Tooltip>
  );
}

function IncreaseIcon({ onClick }) {
  return (
    <Tooltip content="Suurenna tekstin kokoa">
      <button
        type="button"
        className="relative px-2 py-2 text-center text-white bg-red-700 rounded-full text-md hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 tooltip-button"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m6-6H6"
          />
        </svg>
      </button>
    </Tooltip>
  );
}

function TextZoom({ decreaseFontSize, increaseFontSize }) {
  return (
    <div className="flex float-left mb-2 mr-2">
      <DecreaseIcon onClick={decreaseFontSize} />
      <IncreaseIcon onClick={increaseFontSize} />
    </div>
  );
}

export default TextZoom;
