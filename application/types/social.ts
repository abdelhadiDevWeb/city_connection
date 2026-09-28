export type RoleType = 'RESIDENT' | 'BUILDING_MANAGER' | 'RESIDENCE_MANAGER';

export interface ResidentUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  residenceId: string;
  residenceName: string;
  buildingId: string;
  buildingName: string;
  apartmentNumber: string;
  floor: number;
  role: RoleType;
  duesStatus: 'UP_TO_DATE' | 'PENDING' | 'OVERDUE';
  buildingManager: {
    name: string;
    phone: string;
    apartment: string;
  };
}

export type ReactionType = 'LIKE' | 'LOVE' | 'APPLAUD' | 'HELPFUL' | 'ALERT';

export interface ReactionCounts {
  LIKE: number;
  LOVE: number;
  APPLAUD: number;
  HELPFUL: number;
  ALERT: number;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorBuilding: string;
  authorApartment: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export type PostCategory =
  | 'COMMUNITY'
  | 'ALERT'
  | 'LOST_FOUND'
  | 'MAINTENANCE'
  | 'EVENT'
  | 'MARKET';

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorBuilding: string;
  authorApartment: string;
  category: PostCategory;
  content: string;
  imageUrl?: string;
  reactions: ReactionCounts;
  userReaction?: ReactionType;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  isPinned?: boolean;
  scope: 'ALL_RESIDENCE' | 'BUILDING_ONLY';
}

export interface StoryAnnouncement {
  id: string;
  title: string;
  authorRole: string;
  authorName: string;
  previewIcon: string;
  content: string;
  date: string;
  urgency: 'NORMAL' | 'URGENT';
}
