import React from 'react';

function Cells({ cells, handleDeleteCell }) {
  return (
    <div>
      {cells.map((cell) => (
        <span
          id="alert-1"
          className="float-left w-auto pt-2 pb-1 pl-2 pr-1 mb-2 mr-2 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
          key={cell.id}
        >
          {cell.name}
          <button
            type="button"
            className="float-right w-8 h-8 ml-1 -mt-1 text-blue-500 duration-300 rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400 hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
            data-dismiss-target="#alert-1"
            aria-label="Close"
            onClick={handleDeleteCell}
            value={cell.id}
          >
            X
          </button>
        </span>
      ))}{' '}
      <span className="float-left w-auto pt-2 pb-1 pl-2 pr-1 mb-2 mr-2 text-black rounded-lg bg-blue-20 dark:bg-gray-800 dark:text-blue-400">
        Yht. <strong>{cells.length}</strong>
      </span>
    </div>
  );
}

export default Cells;
