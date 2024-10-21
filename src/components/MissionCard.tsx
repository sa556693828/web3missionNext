"use client";
import React, { useEffect, useState } from "react";
import { FaTelegram, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import TaskCard from "@/components/TaskCard";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

interface SocialTask {
  name: string;
  icon: React.ReactNode;
  text: React.ReactNode;
  link: string;
}

const socialTasks: SocialTask[] = [
  {
    name: "Twitter",
    icon: <FaXTwitter className="text-white" size={24} />,
    text: (
      <span>
        Follow{" "}
        <a
          href={process.env.NEXT_PUBLIC_X_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-white underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          @Pan_Ecosystem
        </a>{" "}
        on Twitter
      </span>
    ),
    link: process.env.NEXT_PUBLIC_X_LINK || "",
  },
  {
    name: "Discord",
    icon: <FaDiscord className="text-white" size={24} />,
    text: (
      <span>
        Join Discord{" "}
        <a
          href={process.env.NEXT_PUBLIC_DISCORD_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-white underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          {process.env.NEXT_PUBLIC_DISCORD_LINK}
        </a>{" "}
        and Verify
      </span>
    ),
    link: process.env.NEXT_PUBLIC_DISCORD_LINK || "",
  },
  {
    name: "Telegram",
    icon: <FaTelegram className="text-white" size={24} />,
    text: (
      <span>
        Join{" "}
        <a
          href={process.env.NEXT_PUBLIC_TELEGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-white underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          @Pan_Eco
        </a>{" "}
        on Telegram
      </span>
    ),
    link: process.env.NEXT_PUBLIC_TELEGRAM_LINK || "",
  },
];

const MissionCard: React.FC<{
  userId?: string;
  taskName: "Twitter" | "Discord" | "Telegram";
  getPoints: () => void;
}> = ({ userId, taskName, getPoints }) => {
  const supabase = createClient();
  const [task, setTask] = useState<Task | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const taskContent = socialTasks.find((t) => t.name === taskName);

  const getTask = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("name", taskName)
        .single();
      if (error) {
        toast.error("get task error");
        return;
      }
      setTask(data);
    } catch (error) {
      console.error("get task error:", error);
    }
  };
  const getUser = async (userId: string) => {
    try {
      const { data: existingUser, error: selectError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", userId)
        .single();
      if (selectError && selectError.code !== "PGRST116") {
        console.error(selectError);
        toast.error("get user error");
        return;
      }
      if (existingUser) {
        setUser(existingUser as User);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const doTask = async () => {
    if (!task) return;
    setIsLoading(true);
    try {
      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 2000)),
        supabase.from("task_user").insert({
          task_id: task.id,
          user_wallet: user?.wallet_addr,
          task_name: taskName,
          user_id: userId,
          task_point: task.points,
          status: 1,
        }),
        { onConflict: "user_id,task_name", ignoreDuplicates: false },
      ]);
      toast.success("Mission Done");
      checkIsDone();
      getPoints();
    } catch (error) {
      console.error("Mission Error:", error);
      toast.error("Mission Error");
    } finally {
      setIsLoading(false);
    }
  };
  const checkIsDone = async () => {
    try {
      const { data, error } = await supabase
        .from("task_user")
        .select("*")
        .eq("user_id", userId)
        .eq("task_name", taskName);

      if (error || !data || data.length === 0) {
        setIsDone(false);
        return;
      }
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      const isCompleted = data.some(
        (task) => new Date(task.create_time) < twoMinutesAgo
      );

      setIsDone(isCompleted);
    } catch (error) {
      console.error("isDone error:", error);
    }
  };
  useEffect(() => {
    if (!userId) {
      return;
    }
    getUser(userId);
    getTask();
    checkIsDone();
  }, [userId]);
  return (
    <TaskCard
      icon={taskContent?.icon}
      text={taskContent?.text}
      buttonText={isLoading ? <div className="loader" /> : "Join"}
      onClick={() => doTask()}
      className=""
      isDone={isDone}
    />
  );
};

export default MissionCard;
