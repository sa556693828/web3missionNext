"use client";
import React, { useState, useEffect } from "react";
import { useAccounts, useConnectModal } from "@particle-network/btc-connectkit";

const ConnectButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { openConnectModal, disconnect } = useConnectModal();
  const { accounts } = useAccounts();

  useEffect(() => {
    // 检查钱包连接状态
    checkWalletConnection();
  }, [accounts]);

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
      await disconnect?.();
      setIsConnected(false);
      setWalletAddress("");
    } else {
      await openConnectModal?.();
      // 连接成功后更新状态
      await checkWalletConnection();
    }
  };

  return (
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
  );
};

export default ConnectButton;
