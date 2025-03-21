// PersonBobblehead.js
import React from 'react';

const PersonBobblehead = ({ 
  name, 
  headImage, 
  bodyImage, 
  standColor = '#e0e0e0',
  nameColor = '#336699'
}) => {
  return (
    <div className="bobblehead-container">
      {/* Bobblehead figure container */}
      <div className="bobblehead-figure">
        {/* Head - with bobble animation */}
        <div className="bobblehead-head">
          <img 
            src={headImage} 
            alt={`${name}'s head`}
            className="head-image"
          />
        </div>
        
        {/* Body */}
        <div className="bobblehead-body">
          <img 
            src={bodyImage} 
            alt={`${name}'s body`}
            className="body-image"
          />
        </div>
        
        {/* Stand */}
        <div 
          className="bobblehead-stand"
          style={{ backgroundColor: standColor }}
        />
      </div>
      
      {/* Name */}
      <p 
        className="bobblehead-name"
        style={{ color: nameColor }}
      >
        {name}
      </p>
    </div>
  );
};

export default PersonBobblehead;