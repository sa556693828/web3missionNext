import point from "@/assets/point.svg";
import check from "@/assets/check.svg";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const PointsCard: React.FC<{ checked: boolean; isNext: boolean }> = ({
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
const DailyPoint: React.FC<{ user: User; getPoints: () => void }> = ({
  user,
  getPoints,
}) => {
  const supabase = createClient();
  const [isFinish, setIsFinish] = useState(false);
  const [days, setDays] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const nextDayIndex = days.findIndex((day) => !day);
  const [isLoading, setIsLoading] = useState(false);

  const dailyCheck = async () => {
    try {
      setIsLoading(true);
      if (isFinish) {
        return;
      }
      const today = new Date().toISOString().split("T")[0];
      const { data: existingCheck, error: checkError } = await supabase
        .from("task_user")
        .select("*")
        .eq("user_id", user.user_id)
        .eq("task_name", "daily_check")
        .gte("created_at", today)
        .maybeSingle();

      if (checkError) {
        console.error("daily check error:", checkError);
        toast.error("daily check error");
        return;
      }

      if (existingCheck) {
        toast.error("You have already completed the daily check-in today");
        return;
      }

      const { data: task, error: selectError } = await supabase
        .from("tasks")
        .select("*")
        .eq("name", "daily_check")
        .single();

      if (selectError) {
        console.error("daily check error:", selectError);
        toast.error("daily check error");
        return;
      }
      const { error } = await supabase.from("task_user").insert({
        user_id: user?.user_id,
        user_wallet: user?.wallet_addr,
        task_id: task?.id,
        task_name: task?.name,
        task_point: task?.point,
        status: 1,
        created_at: new Date().toISOString(),
      });
      if (error) {
        console.error("daily check error:", error);
        toast.error("daily check error");
        return;
      }
      await getPoints();
      await checkHowManyDays();
      toast.success("Daily check success");
    } catch (error) {
      console.error("daily check error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const checkSevenDays = async () => {
    try {
      const { data: allChecks, error: allChecksError } = await supabase
        .from("task_user")
        .select("*")
        .eq("user_id", user.user_id)
        .eq("task_name", "daily_check");

      if (allChecksError) {
        console.error("get daily check error:", allChecksError);
        toast.error("get daily check error");
        return;
      }

      // 檢查是否已經有7筆或更多的簽到記錄
      if (allChecks && allChecks.length >= 7) {
        setIsFinish(true);
        toast.error("You have already completed 7 times of daily check-in");
        return;
      }
    } catch (error) {
      console.error("check seven days error:", error);
    }
  };
  const checkHowManyDays = async () => {
    try {
      const { data: tasks, error: selectError } = await supabase
        .from("task_user")
        .select("*")
        .eq("user_id", user?.user_id)
        .eq("task_name", "daily_check")
        .order("created_at", { ascending: false });

      if (selectError) {
        console.error("check how many days error:", selectError);
        return;
      }
      // 创建一个包含7个元素的数组，默认都为false
      const newDays = new Array(7).fill(false);

      // 根据任务数量设置相应数量的true
      const completedTasks = tasks.length;
      for (let i = 0; i < completedTasks && i < 7; i++) {
        newDays[i] = true;
      }

      setDays(newDays);
    } catch (error) {
      console.error("check how many days error:", error);
    }
  };
  useEffect(() => {
    checkHowManyDays();
    checkSevenDays();
  }, [user]);
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="bg-text-orange-gradient bg-clip-text text-subtitle text-transparent"
          onClick={checkHowManyDays}
        >
          Daily check event
        </h2>
        <button
          className={cn(
            "h-[49px] w-[162px] flex items-center justify-center rounded-[10px] bg-white text-sm font-semibold text-black transition-opacity hover:opacity-80",
            isFinish && "opacity-50 cursor-not-allowed"
          )}
          disabled={isFinish}
          onClick={() => {
            dailyCheck();
          }}
        >
          {isLoading ? <div className="loader" /> : "Check - Out"}
        </button>
      </div>
      <div className="flex w-full justify-between space-x-4">
        {days.map((checked, index) => (
          <PointsCard
            key={index}
            checked={checked}
            isNext={index === nextDayIndex}
          />
        ))}
      </div>
    </>
  );
};

export default DailyPoint;
