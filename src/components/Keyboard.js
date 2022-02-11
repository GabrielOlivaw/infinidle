import React from 'react';
import KeyLetter from './KeyLetter';

const Keyboard = ({ onClick, lettersNot }) => {
  // > and < characters are placeholders for send and backspace keys
  const keyLetters = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKLÑ'.split(''),
    '>ZXCVBNM<'.split('')
  ];

  let letterNotClassName;
  return (
    <div id="keyboard">
      <div className="keyboardRow">
        {keyLetters[0].map((letter) => {
          letterNotClassName = '';
          if (lettersNot.includes(letter)) letterNotClassName = 'letterNot';

          return (
            <KeyLetter key={letter} letter={letter} onClick={onClick} letterNotClassName={letterNotClassName} />
          )
        }
        )}
      </div>
      <div className="keyboardRow">
        {keyLetters[1].map((letter) => {
          letterNotClassName = '';
          if (lettersNot.includes(letter)) letterNotClassName = 'letterNot';

          return (
            <KeyLetter key={letter} letter={letter} onClick={onClick} letterNotClassName={letterNotClassName} />
          )
        }
        )}
      </div>
      <div className="keyboardRow">
        {keyLetters[2].map((letter) => {
          letterNotClassName = '';
          if (lettersNot.includes(letter)) letterNotClassName = 'letterNot';

          return (
            <KeyLetter key={letter} letter={letter} onClick={onClick} letterNotClassName={letterNotClassName} />
          )
        }
        )}
      </div>
    </div>
  )
}

export default Keyboard;