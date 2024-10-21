interface User {
  user_id: string;
  wallet_addr: string;
  name: string;
  twitter_id: string;
  status: number;
  inviter?: string;
  created_at: string;
  email: string;
}

interface Task {
  id: string;
  created_at: string;
  name: string;
  point: number;
  status: number;
}

interface TaskUser {
  id: string;
  user_id: string;
  user_wallet: string;
  status: number;
  created_at: string;
  task_name: string;
  task_point: number;
}
