import React from 'react';
import User from './User'

export default class Message extends React.Component {
  constructor(props) {
    super();

    this.state = {
      loading: true,
      message: null,
    }

    this.abortController = new AbortController();
  }


  // Hit the API and load the data once we're mounted...
  async componentDidMount() {
   const data = await (await fetch(`/messages/message?messageId=${this.props.id}`, { signal: this.abortController.signal })).json();

   

    this.setState({
      loading: false,
      message: data.message
    });
  }

  render() {
    if (this.state.loading) {
      return (
      <tr
        data-testid={`message-${this.props.id}`}
      >
        <td className="px-6 py-4 whitespace-no-wrap">
          <div className="flex items-center">
            <div className="ml-4">
              <div className="animate-pulse text-sm leading-5 font-medium text-gray-900">
                Loading...
              </div>
              <div className="text-sm leading-5 text-gray-700">
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
        </td>
      </tr>
      )
    }
    return (
      <tr
        data-testid={`message-${this.state.message.id}`}
      >
        <td className="px-6 py-4 whitespace-no-wrap">
          <div className="flex items-center">
            <div className="ml-4">
              <User username={this.state.message.sender}></User> 
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap">
          {this.state.message.content}
        </td>
      </tr>
    );
  }
}