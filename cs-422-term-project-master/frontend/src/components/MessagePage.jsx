import React from 'react';
import PropTypes from 'prop-types';
import MessageSubject from './MessageSubject';
import MessageThread from './MessageThread'
import MessageThreadSend from './MessageThreadSend';

export default class MessagePage extends React.Component {
  constructor(props) {
    super();

    this.state = {
      loading: true,
      active_thread: null,
      threads: []
    }

    this.abortController = new AbortController();

    // playing with fire here
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  static propTypes = {
    username: PropTypes.string
  }

  async componentDidMount() {
    // grab message ids from the datbase where replying_to_message is null and the user id is a sender or receiver
    const data = await (await fetch(`/messages/user_threads?username=${this.props.username}`, { signal: this.abortController.signal })).json();

    this.setState({
      loading: false,
      threads: data.threads
    });
  }

  setActiveThread(thread_id) {
    this.setState({
      active_thread: thread_id
    })
  }

  render() {
    if (this.state.active_thread) {
      const thread = this.state.threads.find(thread => thread.id === this.state.active_thread);

      return (
        <div className="container mx-auto">
          <div className="flex py-3">
            <h2 className="flex-grow text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
              Thread {thread.subject}
            </h2>

            <div className="object-right">
              <button onClick={() => this.setActiveThread(null)} className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
                Back
              </button>

            </div>
          </div>

          <MessageThread thread={thread} username={this.props.username}></MessageThread>
        </div>
      );
    }

    let threads = [];
    for (let thread of this.state.threads) {
      threads.push(
        <tr
          key={thread.id}
          href="#" onClick={() => this.setActiveThread(thread.id)}
        >
          <MessageSubject
            thread={thread}
            username={this.props.username}
            read={() => this.setActiveThread(thread.id)}
          ></MessageSubject>
        </tr>
      )
    }

    return (
      <div className="container mx-auto">
        <div className="py-3 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <h2 className="flex-grow text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
              Threads
            </h2>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {threads}
                </tbody>
              </table>
            </div>

            <br/>

            <h3 className="flex-grow text-2xl font-bold leading-5 text-gray-900">
              Create a new Thread
            </h3>
            <MessageThreadSend sender={this.props.username} reload_threads={this.componentDidMount}></MessageThreadSend>
          </div>
        </div>
      </div>
    );
  }
}