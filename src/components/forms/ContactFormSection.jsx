import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';   
import { useNavigate } from 'react-router-dom';
 
import { BASE_URL } from '../helpers/config';

const ContactFormSection = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const authToken = localStorage.getItem('authToken');

  const navigate = useNavigate();
  
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/');
    } 
  }, [navigate]);

  // Validation function for text-only fields
  const handleTextOnlyChange = (value, setter) => {
    const textRegex = /^[a-zA-Z\s]*$/;
    if (textRegex.test(value)) {
      setter(value);
    }
  };

  // Validation function for phone number (numbers and + only)
  const handlePhoneChange = (value) => {
    const phoneRegex = /^[0-9+]*$/;
    if (phoneRegex.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!authToken) {
      alert("You need to be logged in to send a message.");
      return;
    }
    
    if (!firstName || !lastName || !email || !phoneNumber || !comment) {
      toast.error('Please fill out all fields.', { position: 'top-right' });
    } else if (!isValidEmail(email)) {
      toast.warning('Please provide a valid email address.', { position: 'top-right' });
    } else {
      try {
        setLoading(true);  

        const formData = {
          full_name: `${firstName} ${lastName}`,
          email,
          phone: phoneNumber,
          message: comment,
        };
       
        const response = await axios.post(`${BASE_URL}/products/contact/`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (response.status === 201) {
          toast.success('Form submitted successfully!', { position: 'top-right' });
          setFirstName('');
          setLastName('');
          setEmail('');
          setPhoneNumber('');
          setComment('');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Failed to submit the form. Please try again later.', { position: 'top-right' });
      } finally {
        setLoading(false);
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <form action="#" onSubmit={handleFormSubmit}>
      <div className="row g-xl-4 g-3">
        <div className="col-6 col-xxs-12">
          <input
            type="text"
            name="commenter-first-name"
            id="commenter-first-name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => handleTextOnlyChange(e.target.value, setFirstName)}
          />
        </div>
        <div className="col-6 col-xxs-12">
          <input
            type="text"
            name="commenter-last-name"
            id="commenter-last-name"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => handleTextOnlyChange(e.target.value, setLastName)}
          />
        </div>
        <div className="col-6 col-xxs-12">
          <input
            type="email"
            name="commenter-email"
            id="commenter-email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-6 col-xxs-12">
          <input
            type="text"
            name="commenter-number"
            id="commenter-number"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
          />
        </div>
        <div className="col-12">
          <textarea
            name="commenter-comment"
            id="commenter-comment"
            placeholder="Your Message"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
      </div>

      <button type="submit" className="fz-1-banner-btn fz-comment-form__btn" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactFormSection;