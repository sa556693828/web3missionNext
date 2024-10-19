// import React, { useState } from "react";
// import axios from "axios";

// const TwitterAuth: React.FC = () => {
//   const [user, setUser] = useState(null);
//   const [isFollowing, setIsFollowing] = useState(false);

//   const handleTwitterLogin = async () => {
//     try {
//       // 重定向到后端的 Twitter 认证路由
//       window.location.href = "http://localhost:3000/auth/twitter";
//     } catch (error) {
//       console.error("Twitter 登录失败", error);
//     }
//   };

//   const checkAuthStatus = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/auth/status", {
//         withCredentials: true,
//       });
//       if (response.data.user) {
//         setUser(response.data.user);
//         setIsFollowing(response.data.isFollowing);
//       }
//     } catch (error) {
//       console.error("检查认证状态失败", error);
//     }
//   };

//   // 在组件加载时检查认证状态
//   React.useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   return (
//     <div>
//       {!user ? (
//         <button onClick={handleTwitterLogin}>使用 Twitter 登录</button>
//       ) : (
//         <div>
//           <p>欢迎，{user.displayName}</p>
//           <p>您{isFollowing ? "正在" : "没有"}关注目标账号</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TwitterAuth;
