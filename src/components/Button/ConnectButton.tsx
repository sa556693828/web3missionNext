"use client";
import React, { useState, useEffect } from "react";
import { useAccounts, useConnectModal } from "@particle-network/btc-connectkit";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";

const ConnectButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { openConnectModal, disconnect } = useConnectModal();
  const { accounts } = useAccounts();
  const supabase = createClient();
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, [accounts]);

  // const getUserByWallet = async (user_wallet: string) => {
  //   try {
  //     const { data: existingUser, error: selectError } = await supabase
  //       .from("users")
  //       .select("*")
  //       .eq("wallet_addr", user_wallet)
  //       .single();
  //     if (selectError && selectError.code !== "PGRST116") {
  //       console.error(selectError);
  //       toast.error("check user error");
  //       return;
  //     }
  //     if (existingUser) {
  //       return existingUser;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching tasks:", error);
  //   }
  // };
  // const createUser = async (user_wallet: string) => {
  //   try {
  //     // const userId = user?.id;
  //     // const userTwitterId = user?.user_metadata.provider_id;
  //     // const userName = user?.user_metadata.preferred_username;
  //     const existingUser = await getUserByWallet(user_wallet);
  //     let error2;
  //     if (existingUser) {
  //       const { error: updateError } = await supabase
  //         .from("users")
  //         .update({
  //           wallet_addr: user_wallet,
  //           status: 1,
  //         })
  //         .eq("user_id", existingUser.user_id);
  //       error2 = updateError;
  //     } else {
  //       const { error: insertError } = await supabase.from("users").insert({
  //         user_id: "",
  //         wallet_addr: user_wallet,
  //         twitter_id: "",
  //         name: "",
  //         status: 1,
  //         created_at: new Date().toISOString(),
  //       });
  //       error2 = insertError;
  //     }

  //     if (error2) {
  //       toast.error("login to server error");
  //       console.error(error2);
  //       return;
  //     }
  //   } catch (error) {
  //     console.error("Error creating user:", error);
  //   }
  // };
  const checkWalletConnection = async () => {
    if (accounts.length > 0) {
      console.log("accounts", accounts);
      const newWalletAddress = accounts[0];

      // 检查新的钱包地址是否与之前的不同
      if (isConnected && walletAddress !== newWalletAddress) {
        // 钱包地址已更改，要求重新登录
        handleLogout();
        return;
      }

      setIsConnected(true);
      setWalletAddress(newWalletAddress);
    } else {
      setIsConnected(false);
      setWalletAddress("");
    }
  };
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const onOpenConnectModal = async () => {
    if (isConnected) {
      setShowModal(true);
    } else {
      await openConnectModal?.();
      await checkWalletConnection();
    }
  };

  const handleDisconnect = async () => {
    await disconnect?.();
    setIsConnected(false);
    setWalletAddress("");
    setShowModal(false);
  };

  const handleBindWallet = async () => {
    if (accounts.length > 0) {
      const walletAddr = accounts[0];
      await supabase
        .from("users")
        .update({ wallet_addr: walletAddr })
        .eq("user_id", user?.user_id);
    }
    setShowModal(false);
  };

  return (
    <>
      <button
        className={`h-[41px] w-[150px] rounded-[10px] text-sm font-semibold ${
          isConnected ? "bg-[#4CAF50] text-white" : "bg-[#FAFAFA] text-black"
        }`}
        onClick={onOpenConnectModal}
      >
        {isConnected
          ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
          : "Connect Wallet"}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
          onClick={() => setShowModal(false)}
        >
          <div className="bg-[#212121] px-6 py-4 rounded-lg shadow-lg">
            <p className="text-white text-2xl font-bold">Wallet</p>
            <p>{`${walletAddress}`}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                className="w-full p-2 bg-red-500 text-white rounded"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
              {/* <button
                className="w-full p-2 bg-orange text-white rounded"
                onClick={handleBindWallet}
              >
                Bind Wallet
              </button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectButton;
