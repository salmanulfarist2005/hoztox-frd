import React from 'react';

const LocationSection = () => {
    return (
        <div className="fz-contact-location-map">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.349586445874!2d76.2259806!3d10.5286875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7ef689b915f71%3A0x47e5568f729df2b3!2sCaratree%20Diamonds!5e0!3m2!1sen!2sin!4v1697173206404!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Caratree Diamonds Location"
            ></iframe>
        </div>
    );
};

export default LocationSection;
