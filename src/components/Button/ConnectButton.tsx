"use client";
import React, { useState, useEffect } from "react";
import { useAccounts, useConnectModal } from "@particle-network/btc-connectkit";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/hooks/useUser";

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

  const updateWalletAddr = async () => {
    if (accounts.length > 0) {
      const walletAddr = accounts[0];
      await supabase
        .from("users")
        .update({ wallet_addr: walletAddr })
        .eq("user_id", user?.user_id);
    }
  };

  const checkWalletConnection = () => {
    if (accounts.length > 0) {
      console.log("accounts", accounts);
      setIsConnected(true);
      setWalletAddress(accounts[0]);
    } else {
      setIsConnected(false);
      setWalletAddress("");
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
    await updateWalletAddr();
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
              <button
                className="w-full p-2 bg-orange text-white rounded"
                onClick={handleBindWallet}
              >
                Bind Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectButton;
