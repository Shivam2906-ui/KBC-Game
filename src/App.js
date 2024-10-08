import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

const sampleQuestions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"],
    answer: "Shakespeare",
  },
  {
    question: "What is the speed of light?",
    options: ["3x10^8 m/s", "3x10^6 m/s", "5x10^8 m/s", "1x10^6 m/s"],
    answer: "3x10^8 m/s",
  },
  {
    question: "Which is the largest planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Jupiter",
  },
  {
    question: "Who is the CEO of Tesla?",
    options: ["Elon Musk", "Jeff Bezos", "Bill Gates", "Mark Zuckerberg"],
    answer: "Elon Musk",
  },
];

function App() {
  // eslint-disable-next-line
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // eslint-disable-next-line
  const [playerName, setPlayerName] = useState("");
  // eslint-disable-next-line
  const [gameState, setGameState] = useState("waiting"); // 'waiting', 'playing', 'correct', 'incorrect'

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const qrLink = `${window.location.origin}/play`;

  return (
    <div className="min-h-screen bg-blue-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">KBC-Style Game</h1>

      {gameState === "waiting" && (
        <div className="text-center">
          <p className="mb-4 text-xl">{currentQuestion.question}</p>
          <QRCode value={qrLink} className="mx-auto mb-4" />
          <p>Scan the QR code to play!</p>
        </div>
      )}

      {gameState === "correct" && (
        <div className="text-center text-green-600">
          <p className="text-2xl">Congratulations {playerName}!</p>
          <p>You answered correctly!</p>
        </div>
      )}

      {gameState === "incorrect" && (
        <div className="text-center text-red-600">
          <p className="text-2xl">Wrong answer!</p>
        </div>
      )}
    </div>
  );
}

function PlayScreen() {
  const [playerName, setPlayerName] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    localStorage.setItem("playerName", playerName);
    navigate(`/answer?answer=${answer}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Join the Game</h1>
      <input
        type="text"
        placeholder="Enter your name"
        className="mb-4 p-2 border border-gray-300 rounded"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter your answer"
        className="mb-4 p-2 border border-gray-300 rounded"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={handleSubmit}
      >
        Submit Answer
      </button>
    </div>
  );
}

function AnswerScreen() {
  // eslint-disable-next-line
  const [playerName, setPlayerName] = useState("");
  // eslint-disable-next-line
  const [playerAnswer, setPlayerAnswer] = useState("");
  const navigate = useNavigate();
  const currentQuestionIndex = 0; // You can dynamically pass this from the parent component or fetch it from state
  const currentQuestion = sampleQuestions[currentQuestionIndex];

  const checkAnswer = (submittedAnswer, correctAnswer, name) => {
    if (submittedAnswer === correctAnswer) {
      alert(`Congratulations ${name}, you answered correctly!`);
    } else {
      alert("Wrong answer!");
      navigate("/play"); // Redirect back to the play screen if the answer is wrong
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const answer = queryParams.get("answer");
    const name = localStorage.getItem("playerName");

    setPlayerAnswer(answer);
    setPlayerName(name);

    checkAnswer(answer, currentQuestion.answer, name);
    // eslint-disable-next-line
  }, [currentQuestion]);

  return null; // This screen is only for validation, so no UI is needed
}

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/play" element={<PlayScreen />} />
        <Route path="/answer" element={<AnswerScreen />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

export default Main;
