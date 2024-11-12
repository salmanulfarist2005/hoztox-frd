import React from 'react'

const LocationSection = () => {
  return (
    <div className="fz-contact-location-map">
        <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.566365090204!2d76.22480517440059!3d10.525356810850548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7efb35ef3f385%3A0x541472b192ee5c47!2sRC+Bishop+House+Rd%2C+Thrissur%2C+Kerala!5e0!3m2!1sen!2sin!4v1698381944768!5m2!1sen!2sin" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    </div>
  )
}

export default LocationSection;
