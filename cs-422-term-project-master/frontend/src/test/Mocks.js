import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { userMocks, threadMocks, messageMocks, applyMocks } from './MockData'

export const MockingServer = setupServer(
  rest.get(
    '/example',
    (req, res,
      ctx) => { return res(ctx.json({ example: 'this is an example' })) }),

  // Users we need to support in the testing:
  rest.get(
    '/api/user',
    (req, res, ctx) => {
      const username = req.url.searchParams.get('username');

      const user = userMocks.find(user => user.username === username);

      if (user) {
        return res(ctx.json({ status: 1, user }));
      } else {
        return res(ctx.json({ 'error': 'User not found.' }))
      }
    }),

  rest.get(
    '/messages/thread',
    (req, res, ctx) => {
      const threadId = Number(req.url.searchParams.get('threadId'));

      const thread = threadMocks.find(thread => thread.id === threadId);
      const messages =
        messageMocks.filter(message => message.threadId === threadId);

      if (thread) {
        return res(ctx.json({ status: 1, thread, messages }));
      } else {
        return res(ctx.json({ 'error': 'Thread not found.' }))
      }
    }),
  rest.post(
    '/messages/thread',
    (req, res, ctx) => {
      let id = 1;

      // I know what I'm doing.
      // eslint-disable-next-line no-loop-func
      while (threadMocks.find(thread => thread.id === id)) {
        id = Math.floor(Math.random() * Math.floor(1000));
      }

      let thread = {
        id,
        subject: req.body.subject,
        sender: req.body.user1,
        receiver: req.body.user2,
      };


      threadMocks.push(thread);

      console.log(threadMocks);
      return res(ctx.json({
        status: 1,
      }));
    }),

  rest.get(
    '/messages/user_threads',
    (req, res, ctx) => {
      const username = req.url.searchParams.get('username');

      const threads = threadMocks.filter(
        thread =>
          thread.sender === username || thread.receiver === username);

      if (threads && threads.length !== 0) {
        return res(ctx.json({ status: 1, threads }));
      } else {
        return res(ctx.json({ 'error': 'User threads not found.' }))
      }
    }),
  rest.get(
    '/messages/message',
    (req, res, ctx) => {
      const id = req.url.searchParams.get('messageId');

      const message =
        messageMocks.find(message => message.id === Number(id));

      if (message) {
        return res(ctx.json({ status: 1, message }));
      } else {
        return res(ctx.json({ 'error': 'Message not found.' }))
      }
    }),
  rest.post(
    '/messages/create',
    (req, res, ctx) => {
      let id = 1;

      // I know what I'm doing.
      // eslint-disable-next-line no-loop-func
      while (messageMocks.find(message => message.id === id)) {
        id = Math.floor(Math.random() * Math.floor(1000));
      }

      let message = req.body;
      message.id = id;

      messageMocks.push(message);

      return res(ctx.json({ status: 1, message }));
    }),
  rest.get(
    '/api/login',
    (req, res, ctx) => {
      const username = req.url.searchParams.get('username');
      const password = req.url.searchParams.get('password');

      const user = userMocks.find(user => user.username === username);

      if (user.password !== password) {
        return res(ctx.json({ 'error': 'Bad password.' }))
      }

      if (user) {
        return res(ctx.json({ status: 1, user }));
      } else {
        return res(ctx.json({ 'error': 'User not found.' }))
      }
    }),

  rest.get(
    '/api/create_account',
    (req, res, ctx) => {
      const confirmPassword = req.url.searchParams.get('confirmpassword');
      const password = req.url.searchParams.get('password');

      const apply = applyMocks.find(apply => apply.password === confirmPassword);

      if (apply.password !== confirmPassword) {
        return res(ctx.json({ 'error': 'Passwords Dont Match!' }))
      }

      if (apply) {
        return res(ctx.json({ status: 1, apply }));
      } else {
        return res(ctx.json({ 'error': 'account not found.' }))
      }
    }),
)