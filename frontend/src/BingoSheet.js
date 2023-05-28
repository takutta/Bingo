import React from 'react';

function BingoSheet({ cells, bingoSize, fontSize }) {
  let landscape = '';
  if (bingoSize === 3 || bingoSize === 4) {
    landscape = 'landscape';
  }
  console.log(cells);
  return (
    <div className={`A4 ${landscape}`}>
      <section className="sheet padding-5mm">
        <div className="flex flex-wrap justify-center">
          {cells.map((cell) => (
            <div
              className={`p-2 border bingo${bingoSize} float-left flex justify-center items-center text-center`}
              style={{ fontSize: `${fontSize}px` }} // Aseta fontin koko tyyliin
              key={`${cell.player}-${cell.id}`}
            >
              {cell.name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default BingoSheet;
