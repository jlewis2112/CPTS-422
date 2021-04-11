import React from 'react';

export default class Logout extends React.Component {
  render() {
    this.props.doStateChange('username', null);
    this.props.onNavSelect('home');


    return (
      <span>Logging you out...</span>
    );
  }
}