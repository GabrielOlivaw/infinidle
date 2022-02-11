import React from 'react';

const KeyLetter = ({ letter, onClick, letterNotClassName }) => {
  const className = (letter === '>' || letter === '<') ? 'keyLetter actionKey' : 'keyLetter';
  return (
    <div 
      className={`${className} ${letterNotClassName}`} 
      onClick={(e) => { 
        onClick(letter);
      }}
      onKeyDown={(e) => {
        console.log(e);
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(letter);
        }
      }}
      tabIndex="0">
      <p>{(letter === '>') ? 'ENVIAR' : (letter === '<') ? '<=' : letter}</p>
    </div>
  )
}

export default KeyLetter;