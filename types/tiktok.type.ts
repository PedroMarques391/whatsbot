export interface ITikTokResponse {
  code: number;
  msg?: string;
  data?: {
    id?: string;
    title?: string;
    duration?: number;
    play?: string;
    wmplay?: string;
    size?: number;
    cover?: string;
    music?: string;
    author?: {
      id?: string;
      unique_id?: string;
      nickname?: string;
    };
  };
}
