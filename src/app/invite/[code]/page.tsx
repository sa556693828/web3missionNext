"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";

export default function InvitePage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const { code } = params;

  useEffect(() => {
    if (code) {
      // 注意：在客戶端組件中，我們不能直接使用 cookies()
      // 所以我們需要使用 document.cookie 或者一個客戶端 cookie 庫
      document.cookie = `referralCode=${code}; max-age=${7 * 24 * 60 * 60}; path=/`;

      router.push("/");
    }
  }, [code, router]);

  return <div>Processing invitation...</div>;
}
