import React from 'react';

function UusiArvonta({ handleArvonta }) {
  return (
    <button
      className="float-left mr-2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 mb-2 py-2.5 text-center"
      type="button"
      onClick={handleArvonta}
    >
      Uusi arvonta
    </button>
  );
}

export default UusiArvonta;
