import React from 'react';

export const Loading = () => {
    const styles={
        position: "absolute",
        top:"50%",
        left:"calc(50% - 50px)",
    }
    
    return (
      <div style={styles}>
        <img src="/loding.gif" alt="loading..." />
      </div>
    );
  };