import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../helpers/config';
import defaultImg from "../../../public/assets/images/prof.png";
import editIcon from "../../../public/assets/images/edit.png";
import { useNavigate } from 'react-router-dom';
function UserProfile() {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(defaultImg);
    const [companyLogo, setCompanyLogo] = useState(defaultImg);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/');
        } 
    }, [navigate]);
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/current-user/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Fetched user data:', response.data);

            setUserData({
                full_name: response.data.full_name || '',
                username: response.data.username || '',
                email: response.data.email || '',
                company_name: response.data.company_name || '',
                mobile_number: response.data.mobile_number || '',
                whatsapp_number: response.data.whatsapp_number || '',
                company_email: response.data.company_email || '',
           
                shipping_address: response.data.shipping_address || '',
                company_website: response.data.company_website || '',


            });


            const imageUrl = response.data.prof_image ? `${BASE_URL}${response.data.prof_image}` : defaultImg;
            console.log('Profile image URL:', imageUrl);
            setProfileImage(imageUrl);

            const imagelogoUrl = response.data.company_logo ? `${BASE_URL}${response.data.company_logo}` : defaultImg;
            console.log('Profile image URL:', imagelogoUrl);
            setCompanyLogo(imagelogoUrl);
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to load user data");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSaveChanges = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();

            for (const key in userData) {
                formData.append(key, userData[key]);
            }

            if (profileImage instanceof File) {
                formData.append('prof_image', profileImage);
            }

            const response = await axios.put(`${BASE_URL}/products/update-profile/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success("Profile updated successfully");
            setIsEditing(false);
            fetchUserData();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            setUserData((prevData) => ({ ...prevData, prof_image: file }));
        }
    };

    const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const logoUrl = URL.createObjectURL(file);
            setCompanyLogo(logoUrl);
            setUserData((prevData) => ({ ...prevData, company_logo: file }));
        }
    };

    return (
        <div className="profile-container">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {!isEditing ? (
                        <div className="profile-card">
                            <div className="profile-header">
                              

                                <div className="logo-item">
                                    <p className="detail-title">Company Logo</p>
                                    <img src={companyLogo} alt="Company Logo" className="company-logo" />
                                </div>
 
                            </div>

                            <div className="profile-details">
                                <div className='row'>
                                    {['full_name', 'company_name', 'mobile_number', 'whatsapp_number', 'email', 'company_email',  'shipping_address', 'company_website'].map((field) => (
                                        <div className="detail-item col-md-6" key={field}>
                                            <div className='brd-botm-1'>
                                                <p className="detail-title">{field.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}</p>
                                                <p className="detail-value">{userData?.[field] || 'N/A'}</p>
                                            </div>
                                        </div>
                                    ))}


                                
                                </div>
                            </div>

                            <div className="button-group">
                                <button className="profile-button" onClick={handleEditToggle}>
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>

                            <div className="backdrop" onClick={handleEditToggle} />
                            <div className="edit-popup">
                                <h3>Edit Profile</h3>
                                <div className="profile-image-container">
                                    <p>Company Logo</p>
                                    <img src={companyLogo} alt="Company Logo" className="company-logo" />
                                    <label htmlFor="companyLogo" className="edit-image-label">
                                        <img src={editIcon} alt="Edit" className="edit-icon" />
                                    </label>
                                    <input type="file" id="companyLogo" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                                </div>

                                <div className='row'>
                                    {['full_name', 'company_name', 'mobile_number', 'whatsapp_number', , 'email', 'company_email', 'company_website',   'shipping_address'].map((field) => (

                                        <div className="edit-item col-md-6" key={field}>
                                            <label>{field.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}</label>
                                            <input
                                                type={field.includes('email') ? 'email' : 'text'}
                                                name={field}
                                                value={userData?.[field] || ''}
                                                onChange={handleInputChange}
                                                className="edit-input"
                                            />
                                        </div>

                                    ))}
                                </div>

                                <div className="button-group">
                                    <button className="save-button" onClick={handleSaveChanges}>
                                        Save Changes
                                    </button>
                                    <button className="cancel-button" onClick={handleEditToggle}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default UserProfile;
