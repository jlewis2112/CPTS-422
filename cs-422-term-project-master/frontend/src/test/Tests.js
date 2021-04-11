import React from 'react';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestRenderer from 'react-test-renderer';

import * as MockData from './MockData'

import App from '../App';
import User from '../components/User'
import Message from '../components/Message'
import MessageThread from '../components/MessageThread'

const sleepedySleep = async () => new Promise(resolve => setTimeout(resolve, 200));

/** 
 * Tests that are used in other tests go here. 
 * This is because they end up at a state that we wanna be at.
 */
const loginAsProfDang = async () => {
  const app = render(<App />);

  // go to login page
  const login_link = app.getByTestId('header-login');
  login_link.click();

  // input data
  const username_box = app.getByTestId('username');
  const pass_box = app.getByTestId('password');

  expect(username_box).toBeInTheDocument();
  expect(pass_box).toBeInTheDocument();


  userEvent.type(username_box, 'zdang@wsu.edu');
  userEvent.type(pass_box, 'failtime');

  expect(username_box).toHaveValue('zdang@wsu.edu');
  expect(pass_box).toHaveValue('failtime');

  const login = app.getByTestId('login');
  expect(login).toBeInTheDocument();
  userEvent.click(login);

  await sleepedySleep();

  const proof = app.getByTestId('user-zdang@wsu.edu');
  expect(proof).toBeInTheDocument();

  return app;
}

/**
 * All other tests go here. Must have format { name: String, test: function }.
 * The function may be async.
 * Will be ran by the test executor once on the mock backend, then once on the real backend
 * which runs the database with the prepared SQL statement injected into it.
 */
export const Tests = [
  {
    name: 'go to the login page',
    test: () => {
      const app = render(<App />);
    
      const login_link = app.getByTestId('header-login');
      login_link.click();
    
      const button = app.getByTestId('login');
      expect(button).toBeInTheDocument();
    }
  },
  {
    name: 'login as professor dang',
    test: loginAsProfDang
  },
  {
    name: 'prof dang can view his user threads',
    test: async () => {
      const app = await loginAsProfDang();
      const proof = app.getByTestId('thread-1');
      expect(proof).toBeInTheDocument();
    }
  },
  {
    name: 'prof dang may logout',
    test: async () => {
      const app = await loginAsProfDang();
    
      const logout_button = app.getByText('logout')
      userEvent.click(logout_button);
    
      await sleepedySleep();
    
      const proof = app.getByText('login');
      expect(proof).toBeInTheDocument();
    }
  },
  {
    name: 'prof dang can open a thread and view its messages',
    test: async () => {
      const app = await loginAsProfDang();
      const thread = app.getByTestId('thread-1');
    
      userEvent.click(thread);
      await sleepedySleep();
    
      for (let pos = 1; pos < 4; pos++) {
        const message = app.getByTestId(`message-${pos}`);
        expect(message).toBeInTheDocument();
      }
    }
  },
  {
    name: 'prof dang may open a thread and reply to it',
    test: async () => {
      const app = await loginAsProfDang();
      const thread = app.getByTestId('thread-1');
    
      userEvent.click(thread);
      await sleepedySleep();
    
      const content = 'yeeeeeeeeeeeessssssss';
    
      const content_box = app.getByTestId('messagesend-content');
      expect(content_box).toBeInTheDocument();
      userEvent.type(content_box, content);
    
      expect(content_box).toHaveValue(content);
    
    
      const send_button = app.getByTestId('messagesend-send');
      expect(send_button).toBeInTheDocument();
      userEvent.click(send_button);
    
      await sleepedySleep();
    
      const new_message = app.getByText(content);
      expect(new_message).toBeInTheDocument();
    }
  },
  {
    name: 'prof dang may make a new thread',
    test: async () => {
      const app = await loginAsProfDang();
    
      const content = "take home exam: if you pass you could write a phd thesis on it!";
    
      const subject_box = app.getByTestId('threadsend-subject');
      const send_button = app.getByTestId('threadsend-send');
      const recip_button = app.getByTestId('threadsend-recipient');
    
      userEvent.type(recip_button, "bstudent@wsu.edu");
      userEvent.type(subject_box, content);
      userEvent.click(send_button);
    
      await sleepedySleep();
    }
  },
  {
    name: 'blackbox test user class', 
    test: async () => {
      for (const user of MockData.userMocks) {
        const render = TestRenderer.create(
          <User username={user.username}></User>
        );

        await sleepedySleep();

        const { props } = render.toJSON();

        expect(
          Object.keys(props).includes('data-testid')
        ).toBe(true);

        expect(
          props['data-testid']
        ).toBe(`user-${user.username}`)
      }
    }
  },
  {
    name: 'blackbox test message class', 
    test: async () => {
      for (const message of MockData.messageMocks) {
        const render = TestRenderer.create(
          <Message id={message.id}></Message>
        );

        await sleepedySleep();

        const { props } = render.toJSON();

        expect(
          Object.keys(props).includes('data-testid')
        ).toBe(true);

        expect(
          props['data-testid']
        ).toBe(`message-${message.id}`)
      }
    }
  },
  {
    name: 'blackbox test thread class', 
    test: async () => {
      for (const thread of MockData.threadMocks) {
        const render = TestRenderer.create(
          <MessageThread thread={thread}></MessageThread>
        );

        //await sleepedySleep();

        const { props } = render.toJSON();

        expect(
          Object.keys(props).includes('data-testid')
        ).toBe(true);

        expect(
          props['data-testid']
        ).toBe(`thread-${thread.id}`)
      }
    }
  },



]