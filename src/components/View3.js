import React from 'react';

function View3({ data }) {
  // Extract the first name and last name from the first entry in the name array
  const firstName = data.name[0].given.join(' ');
  const lastName = data.name[0].family;
  
  // Extract the health card number from the first entry in the identifier array
  const healthCardNumber = data.identifier[0].value;

  return (
    <div className="container">
      <h2>Summary</h2>
      <ul>
        <li>First Name: {firstName}</li>
        <li>Last Name: {lastName}</li>
        <li>Date of Birth: {data.birthDate}</li>
        <li>Health Card Number: {healthCardNumber}</li>
        <li>Gender: {data.gender}</li>
      </ul>
    </div>
  );
}

export default View3;
