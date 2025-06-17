import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';

const SignInFormSection = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/');
        } else {
            navigate("/home");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/products/user/login/`, {
                email,
                password,
            });

            const { access } = response.data;

            if (access) {
                localStorage.setItem('authToken', access);
                console.log("authToken", access);
                console.log("email", email);
                alert('Login successful!');
                navigate('/home');
            }
        } catch (error) {
            console.error('Login failed:', error);
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
                   Email
                </label>
                <input
                    type="email"
                    name="login-email"
                    id="login-email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="form-label" htmlFor="password">
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
                    <div className='query-info'>
                    <p className='query1'>For queries Call </p>
                    <p className='query2'> +919072333816</p>
                    </div>
            
                <div className="register-link-container">
                    <p>
                        Don't have an account?
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSeIhaBbqpUSQ1hcY54rVfRsM80WK4ZitMnUoAtDVqeGYW840Q/viewform"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="register-link"
                        >
                            Register here
                        </a>
                    </p>
                </div>

            </form>
        </div>
    );
};

export default SignInFormSection;
