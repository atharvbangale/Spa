curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -


const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle form submission
app.post('/submit', (req, res) => {
  const { firstName, lastName, dob, healthCardNumber, gender } = req.body;
  
  // TODO: Validate the data, transform to FHIR format, and store in database
  
  res.json({ success: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
