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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // eslint-disable-next-line
  const [playerName, setPlayerName] = useState("");
  const [gameState, setGameState] = useState("waiting"); // 'waiting', 'playing', 'correct', 'incorrect'

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const qrLink = `${window.location.origin}/play`;

  // eslint-disable-next-line
  const handleAnswer = (answer) => {
    if (answer === currentQuestion.answer) {
      setGameState("correct");
    } else {
      setGameState("incorrect");
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setGameState("waiting"); // Reset game state after answering
    } else {
      alert("Game Over! You've answered all questions.");
    }
  };

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
          <button
            className="bg-blue-500 text-white p-2 rounded mt-4"
            onClick={nextQuestion} // Move to the next question
          >
            Next Question
          </button>
        </div>
      )}

      {gameState === "incorrect" && (
        <div className="text-center text-red-600">
          <p className="text-2xl">Wrong answer!</p>
          <button
            className="bg-blue-500 text-white p-2 rounded mt-4"
            onClick={() => setGameState("waiting")} // Reset to waiting state
          >
            Try Again
          </button>
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

function AnswerScreen({ nextQuestion }) {
  const navigate = useNavigate();
  const currentQuestionIndex = 0; // Pass the current index dynamically
  const currentQuestion = sampleQuestions[currentQuestionIndex];

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const answer = queryParams.get("answer");
    const name = localStorage.getItem("playerName");

    if (answer === currentQuestion.answer) {
      alert(`Congratulations ${name}, you answered correctly!`);
      nextQuestion(); // Call the function to go to the next question
      navigate("/"); // Redirect to the main screen
    } else {
      alert("Wrong answer!");
      navigate("/play"); // Redirect back to the play screen if the answer is wrong
    }
    // eslint-disable-next-line
  }, []);

  return null; // This screen is only for validation, so no UI is needed
}

function Main() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      alert("Game Over! You've answered all questions.");
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/play" element={<PlayScreen />} />
        <Route
          path="/answer"
          element={<AnswerScreen nextQuestion={nextQuestion} />}
        />
        <Route
          path="/"
          element={<App currentQuestionIndex={currentQuestionIndex} />}
        />
      </Routes>
    </Router>
  );
}

export default Main;
