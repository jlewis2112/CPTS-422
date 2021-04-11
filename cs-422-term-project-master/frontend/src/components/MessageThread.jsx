import React from 'react';
import PropTypes from 'prop-types';
import Message from './Message';
import MessageSend from './MessageSend';

export default class MessageThread extends React.Component {
  constructor(props) {
    super();

    this.state = {
      loading: true,
      messages: []
    }

    this.abortController = new AbortController();

    this.getTheOtherGuy = this.getTheOtherGuy.bind(this);
    // hopefully this line doesn't cause the universe to invert and explode
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  // Determines which props are required to be passed...
  static propTypes = {
    id: PropTypes.string,
    username: PropTypes.string,
  }

  // Hit the API and load the data once we're mounted...
  async componentDidMount() {
    this.setState({
      loading: true,
    });
 
    const data = await (await fetch(`/messages/thread?threadId=${this.props.thread.id}`, { signal: this.abortController.signal })).json();

    this.setState({
      loading: false,
      messages: data.messages
    });
  }

  /**
   * Looks at the first message and gets the other guy
   */
  getTheOtherGuy() {
    const { thread } = this.props;

    if (!thread) {
      return "";
    }

    if (thread.sender === this.props.username) {
      return thread.receiver;
    } else {
      return thread.sender;
    }
  }

  render() {
    if (this.state.loading) {
      return (
      <div className="container mx-auto" data-testid={`thread-${this.props.thread.id}`}>
        <span>Loading messages...</span>
      </div>
      )
    }

    let messages = [];

    for (const message of this.state.messages) {
      messages.push(
        <Message key={message.id} id={message.id}></Message>
      )
    }

    if (messages.length === 0) {
      messages = (
        <span className="px-6 py-10 leading-4 text-center">
          There are no messages in this thread yet. Be the first to start the conversation!
        </span>
      )
    }


    return (
      <div className="container mx-auto" data-testid={`thread-${this.props.thread.id}`}>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <br/>

        <h3 className="flex-grow text-2xl font-bold leading-5 text-gray-900">
          Respond
        </h3>

        <MessageSend
          threadId={this.props.thread.id}
          sender={this.props.username}
          recipient={this.getTheOtherGuy()}
          reload_messages={this.componentDidMount}
        ></MessageSend>
      </div>
    );
  }
}