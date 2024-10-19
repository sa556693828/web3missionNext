import { PiCopyBold } from "react-icons/pi";

const ReferralCard: React.FC<{
  icon: React.ReactNode;
  text: React.ReactNode;
  buttonText: string;
  referralLink: string;
  onClick: () => void;
  className?: string;
}> = ({ icon, text, buttonText, referralLink, onClick, className }) => {
  // const [loading, setLoading] = useState(false);
  return (
    <div
      className={`flex h-[84px] w-full items-center justify-between rounded-2xl bg-[#212121] px-6 ${className}`}
    >
      <div className="flex items-center gap-4">
        <span className="">{icon}</span>
        <span className="text-xl">{text}</span>
      </div>
      {referralLink !== "" ? (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#131313] px-4 py-2 hover:opacity-80"
          onClick={() => {
            navigator.clipboard.writeText(referralLink);
          }}
        >
          <p className="font-poppins text-xl text-white hover:opacity-80">
            {referralLink}
          </p>
          <PiCopyBold className="text-white" size={24} />
        </div>
      ) : (
        <button
          className="h-[44px] cursor-pointer rounded-[10px] bg-white px-6 text-sm font-semibold text-black transition-opacity hover:opacity-80"
          onClick={() => {
            onClick();
          }}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default ReferralCard;
