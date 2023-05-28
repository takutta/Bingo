import React from 'react';

function CellForm({ addName, newName, handleNameChange }) {
  return (
    <form
      onSubmit={addName}
      className="flex flex-row float-left h-10 gap-2 mb-2 mr-2"
    >
      <div>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 h-10 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Lisää uusi ruutu"
          required
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Lisää
        </button>
      </div>
    </form>
  );
}

export default CellForm;
