export interface VideoEmbedDetails {
  platform: 'youtube' | 'tiktok' | 'unknown';
  videoId: string;
  embedUrl: string;
  originalUrl: string;
  isValid: boolean;
}

/**
 * Extract video details from YouTube or TikTok URLs
 */
export const getVideoEmbedDetails = (url: string): VideoEmbedDetails => {
  if (!url || typeof url !== 'string') {
    return {
      platform: 'unknown',
      videoId: '',
      embedUrl: '',
      originalUrl: url,
      isValid: false
    };
  }

  const cleanUrl = url.trim();

  // YouTube URL patterns
  const youtubePatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]+)/
  ];

  // TikTok URL patterns
  const tiktokPatterns = [
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[^\/]+\/video\/(\d+)/,
    /(?:https?:\/\/)?vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
    /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/t\/([a-zA-Z0-9]+)/
  ];

  // Check YouTube patterns
  for (const pattern of youtubePatterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      return {
        platform: 'youtube',
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        originalUrl: cleanUrl,
        isValid: true
      };
    }
  }

  // Check TikTok patterns
  for (const pattern of tiktokPatterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      return {
        platform: 'tiktok',
        videoId,
        embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
        originalUrl: cleanUrl,
        isValid: true
      };
    }
  }

  // If already an embed URL, try to detect platform
  if (cleanUrl.includes('youtube.com/embed/')) {
    const embedMatch = cleanUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch && embedMatch[1]) {
      return {
        platform: 'youtube',
        videoId: embedMatch[1],
        embedUrl: cleanUrl,
        originalUrl: cleanUrl,
        isValid: true
      };
    }
  }

  if (cleanUrl.includes('tiktok.com/embed/')) {
    const embedMatch = cleanUrl.match(/tiktok\.com\/embed\/v2\/(\d+)/);
    if (embedMatch && embedMatch[1]) {
      return {
        platform: 'tiktok',
        videoId: embedMatch[1],
        embedUrl: cleanUrl,
        originalUrl: cleanUrl,
        isValid: true
      };
    }
  }

  return {
    platform: 'unknown',
    videoId: '',
    embedUrl: '',
    originalUrl: cleanUrl,
    isValid: false
  };
};

/**
 * Get platform display name
 */
export const getPlatformDisplayName = (platform: string): string => {
  switch (platform) {
    case 'youtube':
      return 'YouTube';
    case 'tiktok':
      return 'TikTok';
    default:
      return 'Unknown Platform';
  }
};

/**
 * Validate if a URL is from a supported platform
 */
export const isSupportedVideoUrl = (url: string): boolean => {
  const details = getVideoEmbedDetails(url);
  return details.isValid && details.platform !== 'unknown';
};