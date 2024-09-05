// src/utils/validate.js

// Define a function named validateMOD10 to perform MOD 10 (Luhn Algorithm) validation
function validateMOD10(value) {
  let sum = 0;  // Initialize a variable sum to store the cumulative sum of digits
  let shouldDouble = false;  // Initialize a flag to determine whether to double the digit or not

  // Iterate through the digits of the value from right to left
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value.charAt(i), 10);  // Get the current digit and convert it to an integer

    // If the flag shouldDouble is true, double the value of the digit
    if (shouldDouble) {
      digit *= 2;
      // If the result is greater than 9, subtract 9 from it (equivalent to adding the digits of the result)
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;  // Add the digit (or its modified value) to the sum
    shouldDouble = !shouldDouble;  // Toggle the flag shouldDouble for the next iteration
  }

  // If the sum is a multiple of 10, the number is valid according to MOD 10; return true, otherwise return false
  return sum % 10 === 0;
}

// Export the validateMOD10 function as the default export of this module
export default validateMOD10;
