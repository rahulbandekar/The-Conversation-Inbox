import type { Sentiment } from "../../types";

interface SentimentDotProps {
  sentiment: Sentiment;
}

const SENTIMENT_STYLES: Record<Sentiment, string> = {
  angry: "bg-red-500",
  frustrated: "bg-orange-400",
  neutral: "bg-gray-500",
  satisfied: "bg-emerald-400",
};

const SENTIMENT_LABELS: Record<Sentiment, string> = {
  angry: "Angry",
  frustrated: "Frustrated",
  neutral: "Neutral",
  satisfied: "Satisfied",
};

function SentimentDot({ sentiment }: SentimentDotProps) {
  return (
    <span
      className={`w-2 h-2 rounded-full flex-shrink-0 ${SENTIMENT_STYLES[sentiment]}`}
      title={SENTIMENT_LABELS[sentiment]}
      aria-label={`Sentiment: ${SENTIMENT_LABELS[sentiment]}`}
    />
  );
}

export default SentimentDot;
