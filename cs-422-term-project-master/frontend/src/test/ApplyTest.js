import React from 'react';
import App from '../App';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRadioGroup } from '@material-ui/core';

const sleepedySleep = async () => new Promise(resolve => setTimeout(resolve, 1000));

/** 
 * Tests that are used in other tests go here. 
 * This is because they end up at a state that we wanna be at.
 */

const applyToMakeAccount = async () => {
  const app = render(<App />);

  // go to apply page
  const apply_link = app.getByTestId('header-apply');
  apply_link.click();
  await sleepedySleep();

  // input data
  const Enter_FirstName = app.getByTestId('inputFirstName');
  const Enter_LastName = app.getByTestId('inputLastName');
  const Enter_PrimaryPhone = app.getByTestId('inputPrimaryPhone'); 
  const Enter_Email = app.getByTestId('inputEmail'); 
  const Enter_Password = app.getByTestId('inputPassword'); 
  const Enter_ConfirmPassword = app.getByTestId('inputConfirmPassword'); 

  expect(Enter_FirstName).toBeInTheDocument();
  expect(Enter_LastName).toBeInTheDocument();
  expect(Enter_PrimaryPhone).toBeInTheDocument(); 
  expect(Enter_Email).toBeInTheDocument(); 
  expect(Enter_Password).toBeInTheDocument(); 
  expect(Enter_ConfirmPassword).toBeInTheDocument(); 

  userEvent.type(Enter_FirstName, 'z');
  userEvent.type(Enter_LastName, 'dang');
  userEvent.type(Enter_PrimaryPhone, '5554443333'); 
  userEvent.type(Enter_Email, 'zdang@wsu.edu'); 
  userEvent.type(Enter_Password, 'failtime'); 
  userEvent.type(Enter_ConfirmPassword, 'failtime'); 
  await sleepedySleep();

  expect(Enter_FirstName).toHaveValue('z');
  expect(Enter_LastName).toHaveValue('dang');
  expect(Enter_PrimaryPhone).toHaveValue('5554443333');
  expect(Enter_Email).toHaveValue('zdang@wsu.edu');
  expect(Enter_Password).toHaveValue('failtime');
  expect(Enter_ConfirmPassword).toHaveValue('failtime');
  
  const apply = app.getByTestId('CreateAccount'); 
  expect(apply).toBeInTheDocument(); 
  userEvent.click(apply)
  await sleepedySleep();

  //const proof = app.getByTestId('user-zdang@wsu.edu'); //user class 
  //expect(proof).toBeInTheDocument();

  return app;
}

/**
 * All other tests go here. Must have format { name: String, test: function }.
 * The function may be async.
 * Will be ran by the test executor once on the mock backend, then once on the real backend
 * which runs the database with the prepared SQL statement injected into it.
 */
export const ApplyTest = [
  {
    name: 'go to the apply page',
    test: () => {
      const app = render(<App />);
    
      const apply_link = app.getByTestId('header-apply');
      apply_link.click();
    
      const button = app.getByTestId('CreateAccount');
      expect(button).toBeInTheDocument();
    }
  },
  {
    name: 'apply as professor dang',
    test: applyToMakeAccount
  },
  {
    name: 'prof dang created an account',
    test: async () => {
      const app = await applyToMakeAccount();
    
      const CreateAccountButton = app.getByTestId('CreateAccount')
      userEvent.click(CreateAccountButton);
    
      await sleepedySleep();
    
      const proof = app.getByTestId('CreateAccount');
      expect(proof).toBeInTheDocument();
    }
  },
]
