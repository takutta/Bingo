import { useState, useEffect } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import personService from "./services/persons";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [notificationMessage, setNotificationMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
      setFilteredPersons(initialPersons);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();
    const duplicate = persons.find((person) => person.name == newName);
    if (duplicate) {
      if (
        window.confirm(
          `${duplicate.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const personObject = {
          name: duplicate.name,
          number: newNumber,
          id: duplicate.id,
        };

        personService
          .update(duplicate.id, personObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== duplicate.id ? person : returnedPerson
              )
            );
            setFilteredPersons(
              persons.map((person) =>
                person.id !== duplicate.id ? person : returnedPerson
              )
            );
            setFilter("");
            setNewName("");
            setNewNumber("");
            setNotificationMessage(
              `Person's, ${duplicate.name}, number is changed`
            );
            setTimeout(() => {
              setNotificationMessage(undefined);
            }, 2000);
          })
          .catch((error) => {
            console.log(error);
            setErrorMessage(
              `Information of ${duplicate.name} has already been removed from server`
            );

            setTimeout(() => {
              setErrorMessage(undefined);
            }, 2000);
          });
      }
    } else {
      const maxId = persons.reduce((max, person) => {
        return person.id > max ? person.id : max;
      }, 0);
      const personObject = {
        name: newName,
        number: newNumber,
        id: maxId + 1,
      };

      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setFilteredPersons(persons.concat(personObject));
          setFilter("");
          setNewName("");
          setNewNumber("");
          setNotificationMessage(`Person ${returnedPerson.name} was added`);
          setTimeout(() => {
            setNotificationMessage(undefined);
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage(`Validation error!`);

          setTimeout(() => {
            setErrorMessage(undefined);
          }, 2000);
        });
    }
  };

  const deletePerson = (id) => {
    const name = persons.find((person) => (person.id = id)).name;
    if (window.confirm(`Delete ${name}?`)) {
      personService.deleteOne(id).then((stayedPersons) => {
        setPersons(stayedPersons);
        setFilter("");
        setFilteredPersons(stayedPersons);
      });
      setNotificationMessage(`Person ${name} was deleted`);
      setTimeout(() => {
        setNotificationMessage(undefined);
      }, 2000);
    }
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleDeletePerson = (event) => deletePerson(event.target.value);
  const handleFilter = (event) => {
    const filterValue = event.target.value.toLowerCase();
    setFilter(filterValue);
    const filtered = persons.filter((person) =>
      person.name.toLowerCase().includes(filterValue)
    );
    setFilteredPersons(filtered);
  };

  const Notification = ({ message }) => {
    if (message === undefined) {
      return null;
    }
    return <div className="notification success">{message}</div>;
  };

  const Error = ({ message }) => {
    if (message === undefined) {
      return null;
    }
    return <div className="notification error">{message}</div>;
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <Filter filter={filter} handleFilter={handleFilter} />

      <h3>Add a new</h3>

      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons
        persons={filteredPersons}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
