import { useState } from "react";
import Card from "../components/task-card/Card";

export default function TestCard() {
  const [showCard, setShowCard] = useState(false);

  return (
    <div className="min-h-screen bg-[#717171] flex items-center justify-center">
      {!showCard ? (
        <button
          onClick={() => setShowCard(true)}
          className="w-[180px] h-[60px] rounded-[15px] bg-white text-[18px] font-[700] transition-all duration-300 hover:scale-105"
        >
          اضافه کردن کارت
        </button>
      ) : (
        <Card onDelete={() => setShowCard(false)} />
      )}
    </div>
  );
}