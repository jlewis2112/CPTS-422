import React from 'react';
import PropTypes from 'prop-types';

export default class User extends React.Component {
  constructor(props) {
    super();

    this.state = {
      loading: true,
      user: null
    }

    this.abortController = new AbortController();
  }

  // Determines which props are required to be passed...
  static propTypes = {
    username: PropTypes.string
  }

  // Hit the API and load the data once we're mounted...
  async componentDidMount() {
    const data = await (await fetch(`/api/user?username=${this.props.username}`, { signal: this.abortController.signal })).json();

    this.setState({
      loading: false,
      user: data.user
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div data-testid={`user-${this.props.username}`}>
          <span className="animate-pulse">Loading User {this.props.username}...</span>
        </div>
      )
    }

    return (
      <div data-testid={`user-${this.props.username}`}>
        <div className="text-sm leading-5 font-medium text-gray-900">
          {this.state.user.lastname}, {this.state.user.firstname}
        </div>
        <div className="text-sm leading-5 text-gray-700">
          {this.state.user.username}
        </div>
      </div>
    );
  }
}