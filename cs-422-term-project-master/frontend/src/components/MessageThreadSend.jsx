import React from 'react';
import PropTypes from 'prop-types';
import User from './User';

export default class MessageThreadSend extends React.Component {
  constructor(props) {
    super();

    this.state = {
      text: "",
      recipient: "",
      loading: false
    }

    this.abortController = new AbortController();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.clearInput = this.clearInput.bind(this);

    this.sendThread = this.sendThread.bind(this);
  }

  // Determines which props are required to be passed...
  static propTypes = {
    sender: PropTypes.string,
    reload_threads: PropTypes.func
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

  async sendThread() {
    this.setState({
      loading: true
    })

    const body = {
      user1: this.props.sender,
      user2: this.state.recipient,
      subject: this.state.text
    }

    const settings = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };

    await fetch(`/messages/thread`, settings);

    if (this.props.reload_threads) {
      await this.props.reload_threads();
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
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded" type="button"
            disabled>
            <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
            </svg>
            Screwing up...
          </button>
        </div>
      )
    }


    return (
      <div className="flex items-center border-b border-blue-500 py-2">
        <div>
          <div className="text-xs leading-5 text-gray-600">
            Sending as
          </div>
          <User username={this.props.sender}></User>
        </div>

        <input
          data-testid="threadsend-recipient"
          name="recipient"
          onChange={this.handleInputChange}
          value={this.state.receiver}
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Recipient"
          aria-label="recipient"
        />


        <input
          data-testid="threadsend-subject"
          name="text"
          onChange={this.handleInputChange}
          value={this.state.text}
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Subject"
          aria-label="Response"
        />

        <div className="flex flex-col">
          <button
            data-testid="threadsend-send"
            onClick={this.sendThread}
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
            Send
          </button>
          <button
            data-testid="threadsend-cancel"
            onClick={this.clearInput}
            className="flex-shrink-0 border-transparent border-4 text-blue-500 hover:text-blue-800 text-sm py-1 px-2 rounded" type="button">
            Cancel
          </button>
        </div>
      </div>
    );
  }
}