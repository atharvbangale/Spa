import React, { useState } from 'react';

function View1({ onNext }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // State to hold error message

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Regex to allow only letters, hyphens, and spaces
    const nameRegex = /^[A-Za-z\s\-]+$/;
  
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setErrorMessage('Names can only contain letters, hyphens, and spaces.');
    } else if (firstName.length <= 1 || lastName.length <= 1) {
      setErrorMessage('First name and last name must have more than one character.');
    } else {
      const capitalizedFirstName = capitalize(firstName);
      const capitalizedLastName = capitalize(lastName);
      onNext({ firstName: capitalizedFirstName, lastName: capitalizedLastName });
      setErrorMessage('');  // Clear any previous error message
    }
  };
  
  return (
    <div className="container view-border">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Next</button>
          {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}  {/* Conditionally render the error message */}
        </form>
      </div>
    </div>
  );
}

export default View1;
