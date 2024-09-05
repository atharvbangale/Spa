const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const mongoose = require('mongoose');

const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; // use aes-256-gcm in production
const key = crypto.randomBytes(32); // 256 bits
const iv = crypto.randomBytes(16); // AES block size

const fs = require('fs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the Patient schema and model
const patientSchema = new mongoose.Schema({
  resourceType: String,
  name: [{ family: String, given: [String] }],
  birthDate: String,
  identifier: [{ value: String }],
  gender: String,
});

const Patient = mongoose.model('Patient', patientSchema);

// Middleware setup
app.use(cors());
app.use(express.json());

// MOD 10 validation function
function validateMOD10(value) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// Route to handle form submission
app.post('/submit', async (req, res) => {
  console.log("-----------Req body--------" + req.body);  // Log the entire request body to see the data being sent from the client

  const { resourceType, name, birthDate, identifier, gender } = req.body;
  
  const firstName = name[0].given[0];
  const lastName = name[0].family;
  const dob = birthDate;
  const healthCardNumber = identifier[0].value;

  // Check for null or undefined values before encryption
  if (!firstName) {
    return res.status(400).json({ error: 'First name is required.' });
  }
  if (!lastName) {
    return res.status(400).json({ error: 'Last name is required.' });
  }
  if (!dob) {
    return res.status(400).json({ error: 'Date of birth is required.' });
  }
  if (!healthCardNumber) {
    return res.status(400).json({ error: 'Health card number is required.' });
  }
  if (!gender) {
    return res.status(400).json({ error: 'Gender is required.' });
  }

  // Validation
  const today = new Date().toISOString().split('T')[0];
  if (!dob) {
    return res.status(400).json({ error: 'Please enter your date of birth.' });
  }
  if (parseInt(dob.split('-')[0], 10) <= 1900) {
    return res.status(400).json({ error: 'Birth year must be after 1900.' });
  }
  if (dob > today) {
    return res.status(400).json({ error: 'Birth date cannot be in the future.' });
  }
  if (!gender) {
    return res.status(400).json({ error: 'Please select a gender.' });
  }
  const cleanedValue = healthCardNumber.split('-').join('').split(' ').join('');
  if (cleanedValue.length === 12) {
    const numberPart = cleanedValue.slice(0, 10);
    if (!validateMOD10(numberPart)) {
      return res.status(400).json({ error: 'Please enter a valid 12-character health card number.' });
    }
  } else {
    return res.status(400).json({ error: 'Please enter a valid 12-character health card number.' });
  }

  // Encrypt fields
  const encryptedFields = {
    firstName: encrypt(firstName),
    lastName: encrypt(lastName),
    dob: encrypt(dob),
    healthCardNumber: encrypt(healthCardNumber),
    gender: encrypt(gender),
  };

  // Prepare FHIR data
  const fhirData = {
    resourceType: "Patient",
    name: [{ family: encryptedFields.lastName, given: [encryptedFields.firstName] }],
    birthDate: encryptedFields.dob,
    identifier: [{ value: encryptedFields.healthCardNumber }],
    gender: encryptedFields.gender
  };

  // Save to MongoDB
  const newPatient = new Patient(fhirData);
  try {
    const savedPatient = await newPatient.save();

    // Decrypt saved data
    const decryptedData = {
      resourceType: savedPatient.resourceType,
      name: savedPatient.name.map(name => ({
        family: decrypt(name.family),
        given: name.given.map(givenName => decrypt(givenName))
      })),
      birthDate: decrypt(savedPatient.birthDate),
      identifier: savedPatient.identifier.map(identifier => ({ value: decrypt(identifier.value) })),
      gender: decrypt(savedPatient.gender)
    };

    res.json(decryptedData);  // Send the decrypted data back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while saving the data.' });
  }
});


function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypt function
function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
