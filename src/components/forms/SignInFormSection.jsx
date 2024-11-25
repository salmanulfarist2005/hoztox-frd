import React, { useState ,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../helpers/config';
import axios from 'axios';

const SignInFormSection = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
   
 
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/');
        }else {
            navigate("/home")
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
                console.log("authToken", access)
                console.log("email", email)
                alert('Login successful!');
                navigate('/home');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid Credentials');
        }
    };

    return (
        <div className="form-containerssss">
            <form onSubmit={handleSubmit}>
                <label className="form-label" htmlFor="username">
                    Email
                </label>
                <input
                    type="email"
                    name="login-email"
                    id="login-email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                 <label className="form-label" htmlFor="username">
                 Password
                </label>
                <input
                    type="password"
                    name="login-password"
                    id="login-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="fz-1-banner-btn single-form-btn">Log in</button>
            </form>
        </div>
    );
};

export default SignInFormSection;
