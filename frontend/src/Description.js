import React from 'react';

const Description = () => {
  return <div className='desc'>
    <h1 className='desc-title'>Insurance Expenses Estimator</h1>
    <ul>
      <li>
        <p>Guess insurance expenses from your input data.
          Based on data about people&apos;s insurance expenses you can check a ballpark figure of your own, future, insurance expenses.</p>
      </li>
      <li>
        <p>The application uses you entered info and compares it against a Machine Learning Model on the backend to make predictions.</p>
      </li>
      <li>
        <p>
          Play around with the different variables / fields in the form and make your own assumptions about insurance expenses for Smokers / Non Smokers, young or old people.
        </p>
      </li>
    </ul>
  </div>;
};

export default Description;
