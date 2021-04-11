import React from 'react';
import Logo from "../images/SunsetLogo.png";
import MenuItems from './MenuItems'; 


export default class Header extends React.Component {
  render() {
    return (
      <div className="TitlePage">
        <header className="web-banner">
          <h1 className="title">HORIZON SUNSET APARTMENTS</h1>
          <img className="logo" src={Logo}></img>
        </header>

        <div className="orange-banner"></div>
      </div>
    );
  }
}