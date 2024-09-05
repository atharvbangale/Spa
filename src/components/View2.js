// src/components/View2.js
import React, { useState, useEffect } from 'react';  // Import useEffect
import validateMOD10 from '../utils/validate';  // Import the validateMOD10 function

function View2({ onNext, firstName, lastName }) {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [healthCardNumber, setHealthCardNumber] = useState('');
  const [gender, setGender] = useState('');
  const [isHealthCardValid, setIsHealthCardValid] = useState(true);  // New state variable
  const [errorMessage, setErrorMessage] = useState('');  // New state variable for the error message

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
    const birthYear = parseInt(dateOfBirth.split('-')[0], 10);
    const cleanedValue = healthCardNumber.split('-').join('').split(' ').join('');

    if (dateOfBirth === '') {
      setErrorMessage('Please enter your date of birth.');
    } else if (parseInt(dateOfBirth.split('-')[0], 10) <= 1900) {
      setErrorMessage('Birth year must be after 1900.');
    } else if (dateOfBirth > today) {
      setErrorMessage('Birth date cannot be in the future.');
    } else if (gender === '') {
      setErrorMessage('Please select a gender.');
    } else   if (cleanedValue.length === 12) {
      // Separate the last two characters from the rest of the string
      const numberPart = cleanedValue.slice(0, 10);
      // Validate the numeric part of the health card number using MOD 10
      if (validateMOD10(numberPart)) {
        setErrorMessage('');
      } else {
        setErrorMessage('Please enter a valid 12-character health card number.');
      }
    } else {
      setErrorMessage('Please enter a valid 12-character health card number.');
    }
  }, [dateOfBirth, gender, healthCardNumber]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fhirData = {
      resourceType: "Patient",
      name: [{ family: lastName, given: firstName }],
      birthDate: dateOfBirth,
      identifier: [{ value: healthCardNumber }],
      gender: gender
    };

    if (healthCardNumber.length >= 12 && isHealthCardValid) {
      try {
        const response = await fetch('http://18.189.62.35:3001/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(fhirData)  // Send fhirData to the server
        });

        const responseData = await response.json();
  
        if (response.ok && responseData) {
          onNext(responseData);  // Assuming the server returns the data to be passed to View3
          setErrorMessage('');  // Clear any previous error message
        } else {
          setErrorMessage(responseData.error || 'Server validation failed.');
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('An error occurred while submitting the form.');
      }
    } else {
      setErrorMessage('Please enter a valid 10-digit health card number.');
    }
};

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
          <input type="date" className="form-control" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="healthCardNumber" className="form-label">Health Card Number</label>
          <input type="text" className="form-control" id="healthCardNumber" value={healthCardNumber} onChange={(e) => setHealthCardNumber(e.target.value)} maxLength={15} required />
        </div>
      <button type="submit" className="btn btn-primary" disabled={errorMessage !== ''} onClick={handleSubmit}>
        Next
      </button>
      {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}  {/* Conditionally render the error message */}

      </form>
    </div>
  );
}

export default View2;
