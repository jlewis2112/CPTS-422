import './assets/tailwind.css';

import React from 'react';

import Apartments from './components/Apartments'
import Apply from './components/Apply';
import Header from './components/Header';
import Login from './components/Login';
import Logout from './components/Logout';
import MenuItems from './components/MenuItems'
import MessagePage from './components/MessagePage'
import SlideshowPage from './components/SlideshowPage';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Global app state.
    this.state = {
      username: '',
      page: 'home',
    }

    this.onNavSelect = this.onNavSelect.bind(this);
    this.doStateChange = this.doStateChange.bind(this);
  }

  // This function is called when someone clicks on a button in the navbar.
  onNavSelect(page) {
    this.setState({page});
  }

  doStateChange(name, value) {
    if (name === 'page') {
      this.onNavSelect(value);
      return;
    }

    this.setState({[name]: value});
  }

  // menu state here
  render() {
    const pages = {
      'home': (
        <SlideshowPage
          data-testid="page-slideshow"
        ></SlideshowPage>
      ), 
      'apartments': (
        <Apartments
          data-testid="page-apartments"
        ></Apartments>
      ),
      'apply': (
        <Apply
          data-testid="page-apply"
          doStateChange={this.doStateChange}
        >
        </Apply>
      ),
      'login': (
        <Login onNavSelect={this.onNavSelect}
          data-testid="page-login"
          doStateChange={this.doStateChange}
        ></Login>
      ),
      'messages': (
        <MessagePage 
          data-testid="page-message"
          username={this.state.username}>
        </MessagePage>
      ),
    }

    if (this.state.username) {
      delete pages['login'];
      delete pages['apply'];
      pages['logout'] = (<Logout onNavSelect={this.onNavSelect} doStateChange={this.doStateChange}></Logout>)
    } else {
      delete pages['messages'];
    }

    return (
      <main>
        <Header></Header>
        <MenuItems
          items={Object.keys(pages)}
          active={this.state.page}
          onNavSelect={this.onNavSelect}
        ></MenuItems>
        {pages[this.state.page]}
      </main>
    )
  }
}
