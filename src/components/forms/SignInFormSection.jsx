import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';

const SignInFormSection = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/');
        } else {
            navigate("/home");
        }
    }, [navigate]);

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!email || !email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        // Password validation - only check if required
        if (!password || !password.trim()) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        setErrors({});
        setSuccessMessage('');

        // Client-side validation
        if (!validateForm()) {
            return;
        }

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
                setSuccessMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            }
        } catch (error) {
            console.error('Login failed:', error);
            
            // Handle backend errors
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                
                if (errorData.detail) {
                    setErrors({ general: errorData.detail });
                } else if (errorData.error) {
                    setErrors({ general: errorData.error });
                } else if (errorData.email) {
                    setErrors({ email: Array.isArray(errorData.email) ? errorData.email[0] : errorData.email });
                } else if (errorData.password) {
                    setErrors({ password: Array.isArray(errorData.password) ? errorData.password[0] : errorData.password });
                } else {
                    setErrors({ general: 'Invalid email or password. Please try again.' });
                }
            } else {
                setErrors({ general: 'Login failed. Please try again later.' });
            }
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Clear error when user starts typing
        if (errors.email) {
            setErrors({ ...errors, email: '' });
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // Clear error when user starts typing
        if (errors.password) {
            setErrors({ ...errors, password: '' });
        }
    };

    const renderError = (field) => {
        if (errors[field]) {
            return (
                <div style={{ 
                    color: '#dc3545', 
                    fontSize: '0.875rem', 
                    marginTop: '0.25rem',
                    marginBottom: '0.5rem'
                }}>
                    {errors[field]}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="form-containerssss">
            <form onSubmit={handleSubmit} className="forms">
                <h2 className="sign-in">Sign in</h2>

                {/* General error message */}
                {errors.general && (
                    <div style={{
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #f5c6cb'
                    }}>
                        {errors.general}
                    </div>
                )}

                {/* Success message */}
                {successMessage && (
                    <div style={{
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #c3e6cb'
                    }}>
                        {successMessage}
                    </div>
                )}

                <label className="form-label" htmlFor="login-email">
                    Email
                </label>
                <input
                    type="email"
                    name="login-email"
                    id="login-email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    style={errors.email ? { borderColor: '#dc3545' } : {}}
                />
                {renderError('email')}

                <label className="form-label" htmlFor="login-password">
                    Password
                </label>
                <div className="password-container">
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        name="login-password"
                        id="login-password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        style={errors.password ? { borderColor: '#dc3545' } : {}}
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
                {renderError('password')}
               
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