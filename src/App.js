import React, { useState } from "react";
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
  const qrLink = `${window.location.origin}/play`;

  return (
    <div className="min-h-screen bg-blue-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 font-serif">KBC-Style Game</h1>
      <QRCode value={qrLink} className="mx-auto mb-4" />
      <p className="font-serif font-semibold">
        Scan the QR code to start the game! on your mobile phone
      </p>
    </div>
  );
}

function PlayScreen() {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleNameSubmit = () => {
    localStorage.setItem("playerName", playerName);
    navigate(`/question`); // Redirect to the question screen
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Enter Your Name</h1>
      <input
        type="text"
        placeholder="Enter your name"
        className="mb-4 p-2 border border-gray-300 rounded"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={handleNameSubmit}
        disabled={!playerName.trim()} // Ensure the button is disabled until a name is entered
      >
        Start Game
      </button>
    </div>
  );
}

function QuestionScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option
  const [feedback, setFeedback] = useState(""); // For showing correct/wrong message
  const [isSubmitClicked, setIsSubmitClicked] = useState(false); // Track submit button click
  const playerName = localStorage.getItem("playerName");

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  const handleSubmitAnswer = () => {
    setIsSubmitClicked(true); // Indicate the submit button is clicked

    if (selectedOption === currentQuestion.answer) {
      setFeedback(`Congratulations ${playerName}, you answered correctly!`);
      setTimeout(() => {
        nextQuestion();
      }, 2000); // Move to the next question after 2 seconds
    } else {
      setFeedback("Wrong answer! Try again.");
      setIsSubmitClicked(false); // Reset the submit button if wrong
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null); // Reset selected option for the next question
      setFeedback(""); // Reset feedback for the next question
      setIsSubmitClicked(false); // Reset the submit button state
    } else {
      alert("Game Over! You've answered all questions.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Question for {playerName}</h1>
      <p className="text-xl mb-4">{currentQuestion.question}</p>

      {currentQuestion.options.map((option, index) => (
        <button
          key={index}
          className={`bg-blue-500 text-white p-2 rounded mb-2 w-full ${
            selectedOption === option ? "bg-green-400" : "" // Highlight selected option
          }`}
          onClick={() => setSelectedOption(option)}
        >
          {option}
        </button>
      ))}

      {feedback && <p className="text-lg mt-4">{feedback}</p>}

      <button
        className={`bg-green-500 text-white p-2 rounded mt-4 w-full ${
          isSubmitClicked ? "bg-gray-500" : "" // Change style if clicked
        }`}
        onClick={handleSubmitAnswer}
        disabled={!selectedOption || isSubmitClicked} // Disable if no option is selected or if submit button was already clicked
      >
        {isSubmitClicked ? "Submitting..." : "Submit Answer"}{" "}
        {/* Show different text if clicked */}
      </button>
    </div>
  );
}

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/play" element={<PlayScreen />} />
        <Route path="/question" element={<QuestionScreen />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

export default Main;
