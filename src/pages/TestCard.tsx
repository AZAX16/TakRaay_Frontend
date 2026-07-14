import { useEffect, useState } from "react";
import Card from "../components/task-card/Card";
import { getCardById } from "../services/ServiceCard";

export default function TestCard() {
  const [showCard, setShowCard] = useState(false);
  const [cardData, setCardData] = useState<any>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const data = await getCardById(1);

        console.log("CARD DATA:", data);

        setCardData(data);
      } catch (error) {
        console.error("API ERROR:", error);
      }
    };

    fetchCard();
  }, []);

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
        <Card
          onDelete={() => setShowCard(false)}
          {...(cardData || {})}
        />
      )}
    </div>
  );
}
