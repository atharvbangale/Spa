// 1. Import the React library and the useState hook for managing component state
import React, { useState } from 'react';

// 2. Import the View1 and View2 components from the respective files in the components directory
import View1 from './components/View1';
import View2 from './components/View2';
import View3 from './components/View3';  
import logo from './images/logo.png';  // Adjust the path accordingly
import createLogo from './images/createlogo.PNG'; // Replace with the path to your logo image


// 3. Define and export the App functional component
function App() {
  // 4. Declare the view state variable and the setView function for updating the view state, initialized to 1
  const [view, setView] = useState(1);

  // 5. Declare the data state variable and the setData function for updating the data state, initialized to an empty object
  const [data, setData] = useState({});

  // 6. Define the handleNext function for handling the transition to the next view and updating the data state
  const handleNext = (newData) => {
    // 7. Merge newData with the existing data state and update the data state
    setData({ ...data, ...newData });

    // 8. Increment the view state to transition to the next view
    setView(view + 1);
  };

  // 9. Render the JSX for the App component
  return (
    // 10. Wrap the content in a div element
    
<div>
<div className="create-header">
          <div className="create-logo-container">
              <img src={createLogo} alt="Create Logo" className="create-logo" />
     
          </div>
          <div className="create-nav">
              <a href="https://createhealth.ai/projects/">Projects</a>
              <a href="https://createhealth.ai/services">Services</a>
              <a href="https://createhealth.ai/about-us">About Us</a>
              <button className="btn btn-primary" href="https://createhealth.ai/contact-us/">Contact Us</button>
          </div>
      </div>
<div className="container bg-light mt-5 p-5 rounded" style={{border: '1px solid lightblue', "border-radius": '12px'}}>


    <div style={{ display: 'flex', alignItems: 'center'}}>
        <img src={logo} alt="Your logo" style={{ width: '150px', marginRight: '15px' }} />
        <h2 className="text-primary mb-4">Digital Health Form</h2>
    </div>

    {view === 1 && <View1 onNext={handleNext} />}
    {view === 2 && <View2 onNext={handleNext} firstName={data.firstName} lastName={data.lastName} />}
    {view === 3 && <View3 data={data} />} 


</div>
<div className="footer bg-light p-3">
  <hr/>
    <p className="text-black text-center">© 2023 David Mitchell. All rights reserved.</p>
</div>
</div>
  );
}

// 14. Export the App component as the default export of this module
export default App;
