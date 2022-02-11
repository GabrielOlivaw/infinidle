import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

import Line from './components/Line';
import Keyboard from './components/Keyboard';
import wordList from './data/wordList_ES';
import winnerWords from './data/winnerWords_ES';

const App = () => {
  const INFINIDLE_DEBUG = true;
  const MAX_ATTEMPTS = 6;
  
  const [words, setWords] = useState(Array(MAX_ATTEMPTS).fill(Array(5).fill('')));
  const [colors, setColors] = useState(Array(MAX_ATTEMPTS).fill(Array(5).fill('')));
  const [winnerWord, setWinnerWord] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [lettersNot, setLettersNot] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(0);
  const [message, setMessage] = useState('');

  const chooseWinnerWord = () => {
    return winnerWords[Math.floor(Math.random() * winnerWords.length)];
  }

  const isCorrectWord = (word) => {
    return wordList.includes(word.toUpperCase());
  }

  const showMessage = (messageText, time) => {
    setMessage(messageText);
    setTimeout(() => {
      setMessage('')
    }, time);
  }

  const reset = useCallback(() => {
    setWords(Array(MAX_ATTEMPTS).fill(Array(5).fill('')));
    setColors(Array(MAX_ATTEMPTS).fill(Array(5).fill('')));
    setWinnerWord(chooseWinnerWord());
    setAttempt(0);
    setLettersNot([]);
    setGameStatus('playing');
    setMessage('');
  }, [])

  const restart = useCallback(() => {
    reset();
    setScore(0);
  }, [reset])

  const checkWord = (word, winnerWord) => {
    return word.length === 5 && word.toUpperCase() === winnerWord.toUpperCase();
  }

  const fillSpaces = (arr) => {
    while (arr.length < 5) {
      arr.push('');
    }
    return arr;
  }

  const onKeyboardPress = useCallback((key) => {
    if (attempt < MAX_ATTEMPTS) {
      const wordsBefore = words.slice();
      let currentWord = wordsBefore[attempt].filter(letter => letter !== '');

      switch (key) {
        case '<':
          // Backspace
          currentWord.pop();
          currentWord = fillSpaces(currentWord);

          wordsBefore[attempt] = currentWord;
          setWords(wordsBefore);
          break;
        case '>':
          // Send
          if (currentWord.length === 5 && gameStatus !== 'lose') {
            if (!isCorrectWord(currentWord.join(''))) {
              showMessage('La palabra introducida no está en el diccionario.', 3500);
              break;
            }
            const attemptMatch = checkWord(currentWord.join(''), winnerWord);

            if (!attemptMatch && attempt + 1 < MAX_ATTEMPTS) {
              // word is incorrect and below attempt limit
              setGameStatus('playing');
              setAttempt(attempt => attempt + 1);
            }
            else if (attemptMatch) {
              // word is correct
              setGameStatus('win');
              setScore(score + 1);
              if (score + 1 > hiScore) {
                setHiScore(score + 1);
              }
              setAttempt(attempt => attempt + 1);

              setGameStatus('resetting');
              showMessage('¡Ganaste! Yendo al siguiente nivel...', 3500);
              setTimeout(() => {
                reset();
              }, 4000);
            }
            else if (!attemptMatch && attempt + 1 === MAX_ATTEMPTS) {
              // word is incorrect at attempt limit
              setGameStatus('lose');
              if (score > hiScore) {
                setHiScore(score);
              }
              showMessage(`Has perdido. La palabra era ${winnerWord}.`, 5000);
            }
          }
          break;
        default:
          if (currentWord.join('').trim().length < 5) {
            currentWord.push(key);
            currentWord = fillSpaces(currentWord);

            wordsBefore[attempt] = currentWord;
            setWords(wordsBefore);
          }
          break;
      }
    }
  }, [attempt, gameStatus, hiScore, reset, score, winnerWord, words])

  useEffect(() => {
    setWinnerWord(chooseWinnerWord());
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      let key = e.key.toUpperCase();

      if (key === 'ENTER' && e.target.id === 'restartButton') {
        restart();
      }
      
      if (key === 'ENTER' || key === 'BACKSPACE') {
        key = (key === 'ENTER') ? '>' : '<';
      }
      // If it's an alphabetical key or enter/space, do something to current attempt
      if (key.length === 1 && (
        key === '<' || key === '>' || key === 'Ñ' || 
        (key >= 'A' && key <= 'Z'))) {
        onKeyboardPress(key);
      }
      
    };

    document.addEventListener('keydown', onKeyDown);
    
    return () => { document.removeEventListener('keydown', onKeyDown) };
  }, [onKeyboardPress, restart]);

  useEffect(() => {
    // Attempt changes when a new word is sent. Compare sent word with winnerWord
    const wordIndex = attempt - 1;
    if (attempt > 0 && wordIndex >= 0 && colors[wordIndex].filter(n => n).length === 0) {
      const word = words[wordIndex];
      // Initialize className array for each letter
      let searchWord = word.slice('');
      const winnerWordUpper = winnerWord.toUpperCase();
      let searchWinnerWord = winnerWordUpper.split('');
      let classNameResults = colors[wordIndex].slice();
      let index;

      // First sweep searches all letters which match winnerWord positions.
      for (let i = 0; i < word.length; i++) {
        if (word[i] === winnerWordUpper[i]) {
          classNameResults[i] = 'squareGreen';
          //searchWord[i] = ' ';
          searchWinnerWord[i] = ' ';
        }
      }
      // Second sweep searches all letters which are in the input but do NOT match winnerWord positions
      for (let i = 0; i < word.length; i++) {
        index = searchWinnerWord.findIndex(e => e === word[i])
        if (index > -1 && !classNameResults[i]) {
          classNameResults[i] = 'squareOrange';
          //searchWord[index] = ' ';
          searchWinnerWord[index] = ' ';
        }
      }
      // Update letter colors array from last attempt
      const newColors = colors.slice();
      newColors[wordIndex] = classNameResults;
      if (newColors[wordIndex].filter(n => n).length > 0) {
        setColors(newColors);
      }

      // Update array of letters not in winnerWord
      const lettersNotCopy = lettersNot.slice();
      searchWord.forEach(letter => {
        if (letter && !lettersNotCopy.includes(letter) && !winnerWordUpper.includes(letter)) {
          lettersNotCopy.push(letter);
        }
      });
      if (lettersNot.length < lettersNotCopy.length) {
        setLettersNot(lettersNotCopy);
      }
      

    }
  }, [attempt, colors, lettersNot, winnerWord, words]);

  return (
    <div className="App">
      <div className="navigationBar">
        <h1>Infinidle</h1>
        <div className="scores">
          <p>Puntos: {score}</p>
          <p>Máx. puntos: {hiScore}</p>
        </div>
      </div>
      <div className="board">
        {words.map((word, index) =>
          <Line
            key={uuidv4()}
            word={word}
            colors={colors[index]}
          />
        )}
      </div>
      {
        (INFINIDLE_DEBUG && winnerWord)
        ? <p>{winnerWord}</p>
        : ''
      }
      {
        (message)
          ?
            <div className="notificationMessage">
              <p>{message}</p>
            </div>
          :
            ''
      }
      {(gameStatus !== 'lose')
        ? ''
        :
        <div id="restartButton" className='keyLetter actionKey' onClick={restart} tabIndex="0">
          <p>REINICIAR</p>
        </div>
      }
      <Keyboard onClick={onKeyboardPress} lettersNot={lettersNot} />
    </div>
  );
}

export default App;
