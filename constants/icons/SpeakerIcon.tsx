import { Button } from "@/components/ui/button";

interface SpeakerIconProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const SpeakerIcon: React.FC<SpeakerIconProps> = ({
  onClick,
  className,
  disabled = false,
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={`rounded-full text-slate-500 dark:text-slate-400 dark:bg-slate-700 bg-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:dark:bg-slate-500 disabled:bg-slate-100 disabled:cursor-not-allowed size-[30px] ${className}`}
      aria-label="Speak text"
      disabled={disabled}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        />
      </svg>
    </Button>
  );
};
