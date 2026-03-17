import React, { useState, useEffect } from "react";
import "./GameScreen.css";

import TurnIndicator from "../components/TurnIndicator";
import Timer from "../components/Timer";
import WordChain from "../components/WordChain";
import ThemeCard from "../components/ThemeCard";

import { createGame, submitWord } from "../services/gameService";

function GameScreen({ players, theme, onGameOver }) {

  const [gameId, setGameId] = useState(null);
  const [words, setWords] = useState([]);
  const [inputWord, setInputWord] = useState("");
  const [activePlayer, setActivePlayer] = useState("p1");
  const [timeLeft, setTimeLeft] = useState(30);
  const [validationMsg, setValidationMsg] = useState({ text: "", type: "" });

  // CREATE GAME WHEN SCREEN LOADS
  useEffect(() => {
    const startGame = async () => {

      const data = await createGame("p1", "p2", theme.name.toLowerCase());

      setGameId(data.game_id);

      console.log("Game created:", data);
    };

    startGame();
  }, [theme]);

  // TIMER LOGIC
  useEffect(() => {

    if (timeLeft === 0) {

      const winnerName = activePlayer === "p1" ? players.p2 : players.p1;

      onGameOver(winnerName, words);

      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);

  }, [timeLeft, activePlayer, players, words, onGameOver]);

  // SUBMIT WORD
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!inputWord || !gameId) return;

    const word = inputWord.trim().toLowerCase();

    try {

      const result = await submitWord(gameId, activePlayer, word);

      console.log("Backend result:", result);

      if (result.valid) {

        setValidationMsg({ text: "✔ Word accepted", type: "success" });

        setWords(prev => [...prev, word]);

        setInputWord("");

        // switch turn
        setActivePlayer(prev => (prev === "p1" ? "p2" : "p1"));

        // reset timer
        setTimeLeft(30);

      } else {

        const winnerName = result.winner === "p1" ? players.p1 : players.p2;

        setValidationMsg({ text: result.reason || "Invalid word", type: "error" });

        onGameOver(winnerName, words);
      }

    } catch (error) {

      console.error("Error submitting word:", error);

      setValidationMsg({ text: "Server error", type: "error" });
    }
  };

  const activePlayerName = activePlayer === "p1" ? players.p1 : players.p2;

  const lastRequiredLetter =
    words.length > 0
      ? words[words.length - 1].slice(-1).toUpperCase()
      : "Any";

  return (
    <div className="screen game-screen">

      {/* TOP BAR */}

      <div className="game-topbar">

        <div className="theme-badge">
          <span className="theme-badge-icon">{theme.icon}</span>
          <span className="theme-badge-name">{theme.name}</span>
        </div>

        <TurnIndicator activePlayerName={activePlayerName} />

        <Timer secondsLeft={timeLeft} maxSeconds={30} />

      </div>

      {/* WORD CHAIN */}

      <div className="word-chain-section">
        <WordChain words={words} />
      </div>

      {/* INFO PANEL */}

      <div className="game-info">

        <div className="info-item">
          <span className="info-label">Last Letter Required</span>
          <span className="info-value highlight">{lastRequiredLetter}</span>
        </div>

        <div className="info-divider"></div>

        <div className="info-item">
          <span className="info-label">Time Remaining</span>
          <span className="info-value">{timeLeft}s</span>
        </div>

      </div>

      {/* INPUT AREA */}

      <form className="input-area" onSubmit={handleSubmit}>

        <div className="input-field-wrapper">

          <input
            type="text"
            className="game-input"
            placeholder="Enter your word..."
            value={inputWord}
            onChange={(e) => {
              setInputWord(e.target.value);
              setValidationMsg({ text: "", type: "" });
            }}
            autoFocus
          />

          {validationMsg.text && (
            <div className={`validation-msg ${validationMsg.type}`}>
              {validationMsg.text}
            </div>
          )}

        </div>

        <button type="submit" className="btn-submit">
          SUBMIT WORD
        </button>

      </form>

    </div>
  );
}

export default GameScreen;