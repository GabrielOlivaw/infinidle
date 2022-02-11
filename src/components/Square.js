import React from 'react';

const Square = ({ letter, color }) => {
  const className = color ? `square ${color}` : 'square';
  return (
    <div className={className}>
      <p>{letter}</p>
    </div>
  )
}

export default Square;