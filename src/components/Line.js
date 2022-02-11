import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Square from './Square';

const Line = ({ word, colors }) => {

  return (
    <div className="line">
      {word.map((letter, index) =>
        <Square key={uuidv4()} letter={letter} color={colors[index]} />
      )}
    </div>
  )
}

export default Line;