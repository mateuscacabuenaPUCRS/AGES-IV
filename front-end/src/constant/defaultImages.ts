import DefaultUserAvatar from "@/assets/sem-perfil.png";
import DefaultCampaignImage from "@/assets/excluir2.png";
import DefaultEventImage from "@/assets/event-example.jpeg";
import DefaultNewsImage from "@/assets/excluir1.jpg";

/**
 * Default avatar for users (admin and donor) without profile photo
 */
export const DEFAULT_AVATAR = DefaultUserAvatar;

/**
 * Default image for campaigns without a specific image
 * Uses the image of Pão dos Pobres building illuminated at night
 */
export const DEFAULT_CAMPAIGN_IMAGE = DefaultCampaignImage;

/**
 * Default image for events without a specific image
 */
export const DEFAULT_EVENT_IMAGE = DefaultEventImage;

/**
 * Default image for news without a specific image
 */
export const DEFAULT_NEWS_IMAGE = DefaultNewsImage;

/**
 * Returns the URL of the user's photo or the default avatar
 * Used for admin and donor profiles in the entire system
 */
export const getUserAvatar = (imageUrl?: string | null): string => {
  return imageUrl || DEFAULT_AVATAR;
};

/**
 * Returns the URL of the campaign image or the default campaign image
 * Used for campaigns in the entire system
 */
export const getCampaignImage = (imageUrl?: string | null): string => {
  // Check if imageUrl exists and is not empty
  if (imageUrl && imageUrl.trim() !== "") {
    // uncomment this to use the image from the database
    // return imageUrl;
  }
  return DEFAULT_CAMPAIGN_IMAGE;
};

/**
 * Returns the URL of the event image or the default event image
 * Used for events in the entire system
 */
export const getEventImage = (imageUrl?: string | null): string => {
  // Check if imageUrl exists and is not empty
  if (imageUrl && imageUrl.trim() !== "") {
    // uncomment this to use the image from the database
    // return imageUrl;
  }
  return DEFAULT_EVENT_IMAGE;
};

/**
 * Returns the URL of the news image or the default news image
 * Used for news in the entire system
 */
export const getNewsImage = (imageUrl?: string | null): string => {
  // Check if imageUrl exists and is not empty
  if (imageUrl && imageUrl.trim() !== "") {
    // uncomment this to use the image from the database
    // return imageUrl;
  }
  return DEFAULT_NEWS_IMAGE;
};
