export interface IInstagramResponse {
  error: boolean;
  hosting: string;
  shortcode: string;
  caption: string | null;
  audio: string | null;
  type: "video" | "image" | string;
  download_url: string;
  thumb: string | null;
  message?: string;
}
