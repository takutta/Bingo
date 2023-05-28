import React, { useState, useEffect } from 'react';
import CellForm from './CellForm';
import Cells from './Cells';
import BingoSheet from './BingoSheet';
import cellService from './services/cells';
import Notification from './Notification';
import Error from './Error';
import Header from './Header';
import BingoSize from './BingoSize';
import UusiArvonta from './UusiArvonta';
import Tulostus from './Tulostus';
import TextZoom from './TextZoom';

function App() {
  const [cells, setCells] = useState([]);
  const [newName, setNewName] = useState('');
  const [notificationMessage, setNotificationMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [newPath, setNewPath] = useState(window.location.pathname);
  const [bingoSize, setBingoSize] = useState(5);
  const [bingoCells, setBingoCells] = useState([]);
  const [arvonta, setArvonta] = useState(false);
  const [fontSize, setFontSize] = useState(18); // Alustetaan fontin koko

  const bingoSizeList = [
    { size: 3, name: '3x3', tooltip: 'Vaaka A4, 4 lappua' },
    { size: 4, name: '4x4', tooltip: 'Vaaka A4, 4 lappua' },
    { size: 5, name: '5x5', tooltip: 'Pysty A4, 2 lappua' },
    { size: 6, name: '6x6', tooltip: 'Pysty A4, 2 lappua' },
  ];

  useEffect(() => {
    if (arvonta) {
      const cellsMod = cells.slice(); // Alusta cellsMod kopiona cells-taulukosta

      for (let i = cellsMod.length; i < bingoSize * bingoSize; i += 1) {
        const characters = '0123456789abcdef';
        let randomId = '';

        for (let j = 0; j < 24; j += 1) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomId += characters[randomIndex];
        }

        cellsMod.push({ name: '', id: randomId });
      }

      const p1 = cellsMod
        .slice()
        .sort(() => Math.random() - 0.5)
        .map((item) => ({ ...item, player: 1 }));
      p1.splice(bingoSize * bingoSize);

      const p2 = cellsMod
        .slice()
        .sort(() => Math.random() - 0.5)
        .map((item) => ({ ...item, player: 2 }));
      p2.splice(bingoSize * bingoSize);

      const p3 = cellsMod
        .slice()
        .sort(() => Math.random() - 0.5)
        .map((item) => ({ ...item, player: 3 }));
      p3.splice(bingoSize * bingoSize);

      const p4 = cellsMod
        .slice()
        .sort(() => Math.random() - 0.5)
        .map((item) => ({ ...item, player: 4 }));
      p4.splice(bingoSize * bingoSize);

      const bingoGrid = [];
      let firstItem;

      // 3 & 4 bingot

      for (let i = 0; i < bingoSize * 2; i += 1) {
        // bingoruudukon verran
        if (bingoSize < 5) {
          for (let j = 0; j < bingoSize * 2; j += 1) {
            // p1
            if (i < bingoSize && j < bingoSize) {
              firstItem = p1.shift();
            } else if (bingoSize < 5 && j < bingoSize) {
              firstItem = p2.shift();
            } else if (bingoSize < 5 && i < bingoSize) {
              firstItem = p3.shift();
            } else {
              firstItem = p4.shift();
            }

            if (bingoSize >= 5 && j < bingoSize) {
              firstItem = p1.shift();
            } else if (bingoSize >= 5) {
              firstItem = p2.shift();
            }

            bingoGrid.push(firstItem);
          }
        } else {
          for (let j = 0; j < bingoSize; j += 1) {
            if (i < bingoSize) {
              firstItem = p1.shift();
            } else {
              firstItem = p2.shift();
            }

            bingoGrid.push(firstItem);
          }
        }
      }

      // 5 & 6 bingot

      setBingoCells(bingoGrid);
      setArvonta(false);
    }
  }, [arvonta, bingoSize, cells]);

  const handleArvonta = () => {
    setArvonta(true);
  };

  const handleTulostus = () => {
    window.print();
  };

  useEffect(() => {
    cellService.getByPath(newPath).then((initialCells) => {
      setCells(initialCells);
      setArvonta(true);
      // setBingoCells(initialCells); // Asetetaan bingoruutujen solut aluksi
    });
  }, [newPath]);

  const addName = (event) => {
    event.preventDefault();
    setNewPath(window.location.pathname);
    const duplicate = cells.find((cell) => cell.name === newName);
    if (duplicate) {
      if (
        window.confirm(
          `${duplicate.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const cellObject = {
          name: duplicate.name,
          id: duplicate.id,
        };

        cellService
          .update(duplicate.id, cellObject)
          .then((returnedCell) => {
            setCells(
              cells.map((cell) =>
                cell.id !== duplicate.id ? cell : returnedCell
              )
            );

            setNotificationMessage(
              `Cell's, ${duplicate.name}, number is changed`
            );
            setArvonta(true);
            setTimeout(() => {
              setNotificationMessage(undefined);
            }, 2000);
          })
          .catch((error) => {
            console.log(error);
            setErrorMessage(`Ruutu "${duplicate.name}" on jo poistettu.`);
            setTimeout(() => {
              setErrorMessage(undefined);
            }, 2000);
          });
      }
    } else {
      const capitalizedNewName =
        newName.charAt(0).toUpperCase() + newName.slice(1);
      const cellObject = {
        name: capitalizedNewName,
        path: newPath,
      };

      cellService
        .create(cellObject)
        .then((returnedCell) => {
          setCells(cells.concat(returnedCell));
          setNewName('');
          setNotificationMessage(`Ruutu "${returnedCell.name}" lisättiin`);
          setTimeout(() => {
            setNotificationMessage(undefined);
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage('Virheellinen ruutu. Yritä uudelleen.');

          setTimeout(() => {
            setErrorMessage(undefined);
          }, 2000);
        });
    }
  };

  const deleteCell = (id) => {
    const cellToDelete = cells.find((cell) => cell.id === id);
    if (window.confirm(`Delete ${cellToDelete.name}?`)) {
      cellService.deleteOne(id, newPath).then(() => {
        // Päivitä cells-tila poistamalla poistettu solu
        setCells(cells.filter((cell) => cell.id !== id));
        setNotificationMessage(`Ruutu "${cellToDelete.name}" poistettiin`);
        setTimeout(() => {
          setNotificationMessage(undefined);
        }, 2000);
      });
    }
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleDeleteCell = (event) => {
    deleteCell(event.target.value);
  };

  const handleBingoSizeChange = (event) => {
    setBingoSize(Number(event.target.value));
    handleArvonta(); // Kutsutaan handleArvonta aina kun bingokokoa muutetaan
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 1);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => prevSize - 1);
  };

  return (
    <div className="flex mb-5">
      <div className="container max-w-6xl px-2">
        <div className="ml-4 noPrint">
          <Header />

          <Cells cells={cells} handleDeleteCell={handleDeleteCell} />

          <div className="block clear-both mb-5" />
          <Notification message={notificationMessage} />
          <Error message={errorMessage} />
          <CellForm
            addName={addName}
            newName={newName}
            handleNameChange={handleNameChange}
          />

          <UusiArvonta handleArvonta={handleArvonta} />

          <TextZoom
            decreaseFontSize={decreaseFontSize}
            increaseFontSize={increaseFontSize}
          />

          <BingoSize
            bingoSizeList={bingoSizeList}
            bingoSize={bingoSize}
            handleBingoSizeChange={handleBingoSizeChange}
          />
          <Tulostus handleTulostus={handleTulostus} />

          <div className="block clear-both mb-1" />
        </div>

        <BingoSheet
          cells={bingoCells}
          bingoSize={bingoSize}
          fontSize={fontSize}
        />
      </div>
    </div>
  );
}

export default App;
