interface FeedbackIndicatorsProps {
  correctNumber: number;
  correctPosition: number;
}

export function FeedbackIndicators({ correctNumber, correctPosition }: FeedbackIndicatorsProps) {
  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: 4 }, (_, index) => {
          const isCorrectPosition = index < correctPosition;
          const isCorrectDigit = index < correctNumber;
          const marker = isCorrectPosition ? '🟢' : isCorrectDigit ? '⚪' : '⚫';
          return (
            <span key={`${marker}-${index}`} className="text-xl">
              {marker}
            </span>
          );
        })}
      </div>
      <p className="text-sm text-slate-400">
        {correctNumber} correct digits • {correctPosition} correct positions
      </p>
    </div>
  );
}
