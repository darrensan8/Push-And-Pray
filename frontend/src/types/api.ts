export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export type EventItem = {
  id: number;
  event_type: string;
  repository: string;
  payload: string | null;
  created_at: string;
};

export type StatsResponse = Record<string, number>;
