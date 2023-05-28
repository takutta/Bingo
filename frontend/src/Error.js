import React from 'react';

function Error({ message }) {
  if (message === undefined) {
    return null;
  }
  return <div className="notification error">{message}</div>;
}

export default Error;
