import React from 'react';
import { Tooltip } from 'flowbite-react';

function Tulostus({ handleTulostus }) {
  return (
    <div className="float-left">
      <Tooltip content="Muista valita tulostusasetuksista paperin suunta oikein">
        <button
          className="inline-block mr-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          type="button"
          onClick={handleTulostus}
          data-tooltip-target="tooltip-tulosta"
        >
          Tulosta
        </button>
      </Tooltip>
    </div>
  );
}

export default Tulostus;
