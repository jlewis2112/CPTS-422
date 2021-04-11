import React from 'react';
import PropTypes from 'prop-types';
import User from './User';

export default class MessageSend extends React.Component {
  constructor(props) {
    super();

    this.state = {
      text: "",
      loading: false
    }

    this.abortController = new AbortController();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.clearInput = this.clearInput.bind(this);

    this.sendMessage = this.sendMessage.bind(this);
  }

  // Determines which props are required to be passed...
  static propTypes = {
    sender: PropTypes.string,
    recipient: PropTypes.string,
    threadId: PropTypes.number,
    reload_messages: PropTypes.func
  }


  handleInputChange(event) {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }

  clearInput() {
    this.setState({
      text: ""
    });
  }

  async sendMessage() {
    this.setState({
      loading: true
    })

    const body = {
      id: Math.round(Math.random() * 1000),
      threadId: this.props.threadId,
      sender: this.props.sender,
      receiver: this.props.recipient,
      content: this.state.text
    }

    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };

    await fetch(`/messages/create`, settings);

    if (this.props.reload_messages) {
      await this.props.reload_messages();
    }

    this.clearInput();

    this.setState({
      loading: false
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="flex items-center py-20">
          <button type="button"
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            disabled>
            <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
            </svg>
            Loading...
          </button>
        </div>
      )
    }


    return (
      <div className="flex items-center  border-b border-blue-500 py-2">
        <div>
          <div className="text-xs leading-5 text-gray-600">
            Sending as
          </div>
          <User username={this.props.sender}></User>
        </div>
        <textarea
          data-testid="messagesend-content"
          name="text"
          onChange={this.handleInputChange}
          value={this.state.text}
          rows="5"
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Type a reponse..."
          aria-label="Response"
        />

        <div className="flex flex-col">
          <button
            data-testid="messagesend-send"
            onClick={this.sendMessage}
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
            Send
          </button>
          <button
            data-testid="messagesend-cancel"
            onClick={this.clearInput}
            className="flex-shrink-0 border-transparent border-4 text-blue-500 hover:text-blue-800 text-sm py-1 px-2 rounded" type="button">
            Cancel
          </button>
        </div>
      </div>
    );
  }
}