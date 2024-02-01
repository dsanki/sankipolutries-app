import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { variables } from '../Variables';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
//import LoginContext from "../Context/LoginContext";

function Login(props) {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [validated, setValidated] = useState(false);
    let history = useNavigate();

    const handleSubmit = async (e) => {
       e.preventDefault();

         const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            form.classList.add('was-validated');
        }
        else
        {
            setValidated(true);
            const response = await fetch(variables.REACT_APP_API + 'Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserName: credentials.username,
                    Password: credentials.password
                })
            });
    
            const data = await response.json();
            if (response.ok && data && data.Token !== null) {
                // Save the auth token and redirect
                localStorage.setItem('token', data.Token);
                localStorage.setItem('username', data.UserName);
                localStorage.setItem('isadmin', data.IsAdmin);
    
    
                history("/");
    
            }
            else {
                props.showAlert(data,"danger")
            }
        }

      




       


        // .then(response => response.JSON())
        // .then(data => {
        // let logindata=JSON.parse(data);
        //     if (data.success) {
        //         localStorage.setItem('token', JSON.authtoken)
        //    history("/");
        //     }
        //     else {
        //         props.showAlert(data,"danger")
        //        // alert(data);
        //     }

        // });

    }

    const onChangeValues = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        // setPreGame(initialvalues);
    }
    return (
        <div className="container col-4 mt-5">
            <h3>Login Form</h3>
            <form onSubmit={handleSubmit}  noValidate>
            <div className="form-row">
                    <label htmlFor="username">User name</label>
                    <input type="text" name="username" className="form-control" id="username" placeholder="Enter user name" value={credentials.username} onChange={onChangeValues} required />
                    <div className="invalid-feedback" type="invalid">
                        Please choose a username.
                    </div>

                </div>
                <div className="form-row">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={credentials.password} onChange={onChangeValues} required />
                    <div className="invalid-feedback">
                        Please choose a Password.
                    </div>
                </div>

                <button type="submit" className="btn btn-primary mt-3" >Login</button>
            </form>
        </div>
    )
}

export default Login
