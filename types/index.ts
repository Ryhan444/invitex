export type EventType =
  | 'wedding'
  | 'birthday'
  | 'graduation'
  | 'seminar'
  | 'party'
  | 'anniversary'
  | 'other';

export type SectionType =
  | 'banner'
  | 'story'
  | 'schedule'
  | 'maps'
  | 'gallery'
  | 'donation'
  | 'guestbook';

export type AttendanceStatus = 'attending' | 'not_attending' | 'tentative';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface ThemeConfig {
  primary_color?: string;
  bg_color?: string;
  font_family?: string;
  audio_url?: string;
  audio_title?: string;
  match_rate?: string;
  maturity_rating?: string;
  season_badge?: string;
  film_genre?: string;
  trailer_preview_url?: string;
  [key: string]: any;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  event_type: EventType;
  event_date: string;
  theme_config: ThemeConfig;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  sections?: EventSection[];
}

export interface BannerContent {
  badge?: string;
  title: string;
  subtitle?: string;
  backdrop_url?: string;
  poster_url?: string;
  groom_name?: string;
  groom_parents?: string;
  bride_name?: string;
  bride_parents?: string;
  cta_text?: string;
  rating?: string;
  year?: string;
  season?: string;
  tags?: string[];
  [key: string]: any;
}

export interface StoryEpisode {
  episode: string;
  title: string;
  duration?: string;
  synopsis: string;
  thumbnail?: string;
}

export interface StoryContent {
  heading?: string;
  subheading?: string;
  episodes: StoryEpisode[];
}

export interface ScheduleEvent {
  title: string;
  date: string;
  time: string;
  location_name: string;
  address: string;
  notes?: string;
  icon?: string;
}

export interface ScheduleContent {
  heading?: string;
  subheading?: string;
  events: ScheduleEvent[];
  maps_embed_url?: string;
  google_maps_url?: string;
}

export interface GalleryPhoto {
  title?: string;
  url: string;
  tag?: string;
}

export interface GalleryContent {
  heading?: string;
  subheading?: string;
  photos: GalleryPhoto[];
}

export interface DonationAccount {
  bank_name: string;
  account_number: string;
  account_holder: string;
  logo?: string;
}

export interface DonationContent {
  heading?: string;
  subheading?: string;
  accounts: DonationAccount[];
  qris_url?: string;
  gift_address?: string;
}

export interface GuestbookContent {
  heading?: string;
  subheading?: string;
  rsvp_enabled?: boolean;
}

export interface EventSection {
  id: string;
  event_id: string;
  type: SectionType;
  order_index: number;
  is_visible: boolean;
  content: any;
  created_at?: string;
  updated_at?: string;
}

export interface GuestWish {
  id: string;
  event_id: string;
  name: string;
  attendance_status: AttendanceStatus;
  message: string;
  created_at: string;
}

export interface CreationRequest {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  payload_data: {
    event_title?: string;
    target_date?: string;
    preferred_slug?: string;
    notes?: string;
    selected_blocks?: SectionType[];
    backdrop_url?: string;
    [key: string]: any;
  };
  status: RequestStatus;
  created_at: string;
}

