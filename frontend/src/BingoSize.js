import React from 'react';
import { Tooltip } from 'flowbite-react';

function BingoSize({ bingoSizeList, bingoSize, handleBingoSizeChange }) {
  return (
    <div className="flex float-left h-10 gap-4 mb-2 mr-3">
      {bingoSizeList.map((size) => (
        <label
          key={size.size}
          htmlFor={`inline-${size.size}`}
          className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-300 group"
        >
          {size.name}
          <Tooltip content={size.tooltip}>
            <input
              type="radio"
              value={size.size}
              name="inline-radio-group"
              className="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={size.size === bingoSize}
              onChange={handleBingoSizeChange}
            />
          </Tooltip>
        </label>
      ))}
    </div>
  );
}

export default BingoSize;
