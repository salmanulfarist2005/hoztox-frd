import axios from 'axios';
import { toast } from 'react-toastify'; 

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
