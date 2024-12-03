import React, { useState, useEffect } from "react";
// import logolight from "../../assets/images/logo-light.png";
// import logodark from "../../assets/images/logo-dark.png";
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from '../../../components/helpers/config';

const Login = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('adminAuthToken');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/products/login/`, {
                email,
                password,
            });


            const { access } = response.data;

            if (access) {
                localStorage.setItem('adminAuthToken', access);
                alert('Login successful!');
                console.log("access", access)
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            alert('Invalid Credentials');
        }
    };
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);  
    };




    return (
        <div className="form-containerssss">
       
            <form onSubmit={handleSubmit} className="forms">
                <h2 className="sign-in">Sign in</h2>

                <label className="form-label" htmlFor="username">
                    User Name
                </label>
                <input
                    type="email"
                    name="login-email"
                    id="login-email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="form-label" htmlFor="username">
                    Password
                </label>
                <div className="password-container">
                <input
                        type={isPasswordVisible ? "text" : "password"} 
                        name="login-password"
                        id="login-password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className="eyebtn"
                        onClick={togglePasswordVisibility}
                    >
                        {isPasswordVisible ? (
                            <i className="fa fa-eye-slash"></i>
                        ) : (
                            <i className="fa fa-eye"></i>
                        )}
                    </span>
                </div>

                <button type="submit" className="fz-1-banner-btn single-form-btn">
                    Log in
                </button>
            </form>
        </div>
         
    );
};

export default Login;
