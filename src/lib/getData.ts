import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const getUserByID = async (userId: string) => {
  try {
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (selectError && selectError.code !== "PGRST116") {
      console.error(selectError);
      return;
    }
    if (existingUser) {
      return existingUser;
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};
const getUserByWallet = async (walletAddr: string) => {
  try {
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_addr", walletAddr)
      .single();
    if (selectError && selectError.code !== "PGRST116") {
      console.error(selectError);
      return;
    }
    if (existingUser) {
      return existingUser;
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export { getUserByID, getUserByWallet };  