import check from "@/assets/check.svg";

const TaskCard: React.FC<{
  icon: React.ReactNode;
  text: React.ReactNode;
  buttonText: React.ReactNode;
  onClick: () => void;
  className?: string;
  isDone?: boolean;
}> = ({ icon, text, buttonText, onClick, className, isDone }) => (
  <div
    className={`flex h-[84px] w-full items-center justify-between rounded-2xl bg-[#212121] px-6 ${className}`}
  >
    <div className="flex items-center gap-4">
      <span className="">{icon}</span>
      <span className="text-xl">{text}</span>
    </div>
    {isDone ? (
      <img src={check.src} alt="check" className="size-7" />
    ) : (
      <button
        className="h-[44px] px-6 cursor-pointer rounded-[10px] bg-white text-sm font-semibold text-black transition-opacity hover:opacity-80"
        onClick={onClick}
      >
        {buttonText}
      </button>
    )}
  </div>
);

export default TaskCard;
