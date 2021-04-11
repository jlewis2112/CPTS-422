import React from 'react';
import PropTypes from 'prop-types';
import User from './User';

export default class MessageSubject extends React.Component {
  constructor(props) {
    super();
  }

  static propTypes = {
    thread: PropTypes.object,
    username: PropTypes.string
  }

  render() {
    switch (this.props.username) {
      case this.props.thread.sender: {
        return (
          <td 
            data-testid={`thread-${this.props.thread.id}`}
          >
            <div className="px-6 py-4 whitespace-no-wrap">
              <div className="flex items-center">
                <div className="ml-4">
                  <User username={this.props.thread.receiver}></User>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 whitespace-no-wrap">
              {this.props.thread.subject}
            </div>
          </td>
        );
      }
      case this.props.thread.receiver: {
        return (
          <td
            data-testid={`thread-${this.props.thread.id}`}
          >
            <div className="px-6 py-4 whitespace-no-wrap">
              <div className="flex items-center">
                <div className="ml-4">
                  <User username={this.props.thread.sender}></User>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 whitespace-no-wrap">
              {this.props.thread.subject}
            </div>
          </td>
        );
      }
      default: {
        return (
          <td>BUG</td>
        )
      }
    }
  }
}