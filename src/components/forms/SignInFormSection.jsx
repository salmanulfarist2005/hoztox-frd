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
                <p>For queries Call

                    +919072333816</p>
                <button type="submit" className="fz-1-banner-btn single-form-btn">
                    Log in
                </button>

            </form>
        </div>
    );
};

export default SignInFormSection;
