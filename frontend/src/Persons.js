const Persons = ({ persons, handleDeletePerson }) => {
  return (
    <div>
      <ul>
        {persons.map((person) => (
          <li key={person.id + person.name}>
            {person.name} {person.number}
            <span> </span>
            <button value={person.id} onClick={handleDeletePerson}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Persons;
