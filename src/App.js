// App.js

import React, { useState } from "react";

// Helper: Create a shuffled deck of paired cards.
const createShuffledDeck = () => {
  const values = ["🐶", "🐱", "🦊", "🐸", "🐵", "🐼"];
  let cards = [];
  values.forEach((val, idx) => {
    cards.push({ id: 2 * idx, value: val, isFlipped: false, isMatched: false });
    cards.push({ id: 2 * idx + 1, value: val, isFlipped: false, isMatched: false });
  });
  // Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Trade known position i with random position j.
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

function App() {
  const [cards, setCards] = useState(createShuffledDeck());
  const [flipped, setFlipped] = useState([]); // store idxs of currently flipped cards
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [preventClick, setPreventClick] = useState(false)

  const handleCardClick = (index) => {
    if (gameStatus !== "playing") return;

    if (flipped.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = cards.map((card, idx) =>
      idx === index ? { ...card, isFlipped: true } : card
    );
    const newFlipped = [...flipped, index];

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [i, j] = newFlipped;
      if (newCards[i].value === newCards[j].value) {
        // Match!
        const matchedCards = newCards.map((card, idx) =>
          idx === i || idx === j ? { ...card, isMatched: true } : card
        );
        setCards(matchedCards);
        setFlipped([]);
        setMatches(matches + 1);

        // Win check
        if (matches + 1 === cards.length / 2) {
          setGameStatus("won");
        }
      } else {
        setCards(newCards);
        setPreventClick(true)
        setTimeout(() => {
          const unflippedCards = newCards.map((card, idx) =>
            idx === i || idx === j ? { ...card, isFlipped: false } : card
          );
          setCards(unflippedCards);
          setFlipped([]);
          setPreventClick(false)
        }, 800);
      }
    } else {
      setCards(newCards);
      setFlipped(newFlipped);
    }
  };

  const handleRestart = () => {
    setCards(createShuffledDeck());
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setGameStatus("playing");
  };
  const pointerEvents = preventClick ? 'none' : 'initial';
  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", maxWidth: 400, margin: "auto" }}>
      <Header moves={moves} matches={matches} gameStatus={gameStatus} />
      <div style={{pointerEvents}}>
        <GameBoard cards={cards} onCardClick={handleCardClick} />

      </div>
      {gameStatus === "won" && (
        <div style={{ margin: "1em" }}>
          <strong>🎉 You won! 🎉</strong>
        </div>
      )}
      <hr style={{marginTop: '20px'}} />
      <Footer onRestart={handleRestart} />
    </div>
  );
}
App.displayName = 'App';

const Header = ({ moves, matches, gameStatus }) => {
  return (
    <div style={{ margin: "1em 0" }}>
      <h2>Memory Game</h2>
      <div>
        Moves: <strong>{moves}</strong> | Matches: <strong>{matches}</strong> | Status: <strong>{gameStatus}</strong>
      </div>
    </div>
  );
}
Header.displayName = 'Header'

const GameBoard = ({ cards, onCardClick }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 60px)",
        gap: "10px",
        justifyContent: "center"
      }}
    >
      {cards.map((card, idx) => (
        <Card
          key={card.id}
          value={card.value}
          isFlipped={card.isFlipped || card.isMatched}
          isMatched={card.isMatched}
          onClick={() => onCardClick(idx)}
        />
      ))}
    </div>
  );
}
GameBoard.displayName = 'GameBoard'

const Card = ({ value, isFlipped, isMatched, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={isMatched || isFlipped}
      style={{
        width: 60,
        height: 60,
        fontSize: "2em",
        background: isFlipped ? "#fff" : "#0055A2",
        color: isFlipped ? "#000" : "#fff",
        border: "2px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 1px 5px #aaa",
        cursor: isFlipped ? "default" : "pointer",
      }}
    >
      {isFlipped ? value : "?"}
    </button>
  );
}
Card.displayName = 'Card';

const Footer = ({ onRestart }) => {
  return (
    <div style={{ margin: "2em 0" }}>
      <button onClick={onRestart} style={{ padding: "0.5em 1em" }}>
        Restart Game
      </button>
      <div style={{ fontSize: "small", marginTop: "1em", color: "#888" }}>
        © {new Date().getFullYear()} As if!
      </div>
    </div>
  );
}
Footer.displayName = 'Footer';

export default App;