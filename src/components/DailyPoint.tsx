import point from "@/assets/point.svg";
import check from "@/assets/check.svg";

const DailyPoint: React.FC<{ checked: boolean; isNext: boolean }> = ({
  checked,
  isNext,
}) => {
  let className = `flex h-[97px] flex-col gap-2 w-[94px] items-center justify-center rounded-lg border `;

  if (checked) {
    className += "border-orange bg-[#212121]";
  } else if (isNext) {
    className += "border-white/10 bg-[#212121] ";
  } else {
    className += "border-[#212121] ";
  }
  return (
    <div className={className}>
      <img
        src={point.src}
        alt="point"
        className={`${checked ? "size-10" : "size-10 grayscale"}`}
      />

      {checked ? (
        <img src={check.src} alt="check" className="size-5" />
      ) : (
        <span className="text-xl">+50</span>
      )}
    </div>
  );
};

export default DailyPoint;
