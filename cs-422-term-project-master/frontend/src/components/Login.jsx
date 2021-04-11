import React from 'react';
import Alert from './Alert'

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      alert: '',
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  handleInputChange(event) {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }

  loginUser = async() => {
    const { username, password } = this.state;

    const settings = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    try {
      const fetchResponse = await fetch(`/api/login?username=${username}&password=${password}`, settings);
      const data = await fetchResponse.json();

      if (data.error) {
        this.setState({
          password: '',
          alert: data.error
        })
        return;
      }

      this.props.doStateChange('username', username);
      this.props.doStateChange('page', 'messages');

      return data;
    } catch (e) {
      return e;
    }
  }

  render() {


    return (
      <div>
        <Alert alert={this.state.alert}></Alert>
        <div
        className="justify-center flex items-center"
        >
          <form className="" style={{width: '400px'}}>
            <h1 className="header_account" id="Login">Login</h1>
            <br/>
            <input
              name="username"
              data-testid="username"
              onChange={this.handleInputChange}
              value={this.state.username}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              placeholder="Email"
              aria-label="email"
            />
            <input
              name="password"
              data-testid="password"
              onChange={this.handleInputChange}
              value={this.state.password}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="password"
              placeholder="Password"
              aria-label=""
            />
            <button 
              className="object-right flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
              data-testid="login"
              onClick={(event) => { event.preventDefault(); this.loginUser() }} 
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}