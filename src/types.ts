export interface VideoInfo {
  id: string;
  platform: 'tiktok' | 'youtube' | 'instagram';
  title: string;
  author: string;
  authorAvatar?: string;
  authorUniqueId?: string;
  caption?: string;
  thumbnail: string;
  duration?: string;
  url: string;
  statistics?: {
    plays?: number;
    likes?: number;
    shares?: number;
    comments?: number;
  };
  formats: {
    quality: string;
    format: 'mp4' | 'mp3' | 'jpg' | 'jpeg' | 'png';
    size?: string;
    downloadUrl: string;
    directUrl?: string;
  }[];
}
