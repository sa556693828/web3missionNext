import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

interface User {
  user_id: string;
  // 添加其他用戶屬性
}

export const useUser = () => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (authUser) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", authUser.id)
          .single();

        if (userError) throw userError;

        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user: user as User, loading, refetchUser: fetchUser };
};
