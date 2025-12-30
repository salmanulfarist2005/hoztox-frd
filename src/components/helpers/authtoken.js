import axios from 'axios';
import { toast } from 'react-toastify';  
import { BASE_URL } from '../helpers/config';
export async function adminLogin(email, password) {
    try {
        const response = await axios.post(`${BASE_URL}/products/login/`, {
            email,
            password,
        });

        const data = response.data;

        if (response.status === 200) {
            const adminToken = data.access;  
            localStorage.setItem('authToken', adminToken); 
            toast.success('Admin Login Success');
            return data;
        } else {
            toast.error('Invalid Admin Credentials');
            return null;
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        toast.error('An error occurred during admin login');
        return null;
    }
}

export default async function login(email, password) {
    try {
        const response = await axios.post(`${BASE_URL}/products/user/login/`, {
            email: email,
            password: password
        });

        const data = response.data;

        console.log('Server Response:', data);  

        if (response.status === 200) {
            const token = data.access;
            const userId = data.user_id;   
            const username = data.username;  
            localStorage.setItem('authToken', token);
        
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', username);
            
         
            if (data.first_name && data.last_name) {
                localStorage.setItem('firstName', data.first_name);
                localStorage.setItem('lastName', data.last_name);
            }
            
            console.log("user_id:", userId);
            console.log('Token stored successfully:', token);
            toast.success('Login Success');
            return data;
        } else {
            toast.error('Invalid User Credential');
            return null;
        }
    } catch (error) {
        console.error('Error during login:', error);
        toast.error('An error occurred during login');
        return null;
    }
}
