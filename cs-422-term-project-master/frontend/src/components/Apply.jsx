import React from 'react';
import TextField from '@material-ui/core/TextField';


export default class Apply extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            isOwner: false,
            phone: ''
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.sendCreateRequest = this.sendCreateRequest.bind(this);
    }

    sendCreateRequest = async () => {
        const body = {
            'username': this.state.username,
            'password': this.state.password,
            'firstname': this.state.firstname,
            'lastname': this.state.lastname,
            'isOwner': this.state.isOwner,
            'phone': this.state.phone
        }

        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };

        // Not sure what is going on, so here's a solution:
        // We append everything as a url param. Then we turn it into a POST request I guess?
        // But wait. JavaScript's URL type doesn't support relative URLs because of course it doesn't,
        // that would make sense. So let's manually define a base url that is a relative URL and
        // see if that's stupid enough to work. It doesn't, because that would have made life easy.
        // So, now what? Why does the backend demand we param instead of JSON body? Who knows.
        let stupid = `/api/create_account?`;

        for (const [k, v] of Object.entries(body)) {
            stupid += `&${k}=${v}`;
        }

        try {
            await fetch(stupid, settings);

            this.props.doStateChange('username', body.username);
            this.props.doStateChange('page', 'messages');

            console.log("Account created successfully!");

        } catch (e) {

            return e;
        }
    }

    handleInputChange(event) {
        console.log(this);
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }


    render() {
        return (
            <div>
                <h1 className="Header_Apartments">Apply Online</h1>
                <h1 className="Header_Apartments" id="Sub_Apply">Create an Account to Begin</h1>
                <div className="Sectional" id="Sectional_2"></div>

                <div>
                    <form className="root" noValidate autoComplete="off">
                        <TextField className="TxtF1" id="standard-basic" name="firstname" label="Legal First Name" onChange={this.handleInputChange} value={this.state.firstname}  inputProps={{ "data-testid": 'inputFirstName' }} />
                        <TextField className="TxtF2" id="standard-basic" name="lastname" label="Last Name" onChange={this.handleInputChange} value={this.state.lastname} inputProps={{ "data-testid": 'inputLastName' }} />
                        <TextField className="TxtF3" id="standard-basic" name="phone" label="Primary Phone" onChange={this.handleInputChange} value={this.state.phone} inputProps={{ "data-testid": 'inputPrimaryPhone' }} />
                        <TextField className="TxtF4" id="standard-basic" name="username" label="Email" onChange={this.handleInputChange} value={this.state.username} inputProps={{ "data-testid": 'inputEmail' }} />
                        <TextField className="TxtF5" id="standard-basic" name="password" label="Password" onChange={this.handleInputChange} value={this.state.password} inputProps={{ "data-testid": 'inputPassword' }} />
                        <TextField className="TxtF6" id="standard-basic" label="Confirm Password" inputProps={{ "data-testid": 'inputConfirmPassword' }} />
                    </form>
                </div>
                <button className="filterButton" onClick={this.sendCreateRequest} id="CA" data-testid="CreateAccount">CREATE ACCOUNT</button>
            </div>


        );
    }
}