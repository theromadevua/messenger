import React from 'react';

const Spinner = ({ size = 40 }) => {
  return (
    <div 
      className="spinner-container"
      style={{
        width: size,
        height: size
      }}
    >
      <div 
        className="spinner-background"
      />
      <div 
        className="spinner-foreground"
      />
    </div>
  );
};

export default Spinner;
