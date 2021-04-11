import React from 'react';


export default class Alert extends React.Component {
  render() {
    let alert = (<span></span>);

    if (this.props.alert !== '' && this.props.alert) {
      alert = (
        <div className="bg-red-100 text-red-700 px-4 py-3" role="alert">
          <p className="font-bold text-center">{this.props.alert}</p>
        </div>
      )
    }

    return alert;
  }
}