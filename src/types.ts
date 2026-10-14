export type WorkspaceId =
  | 'home'
  | 'projects'
  | 'chat'
  | 'image-generator'
  | 'video-generator'
  | 'audio'
  | 'coding'
  | 'developer-ji'
  | 'app-factory'
  | 'website-factory'
  | 'game-factory'
  | 'version-control'
  | 'agents'
  | 'research'
  | 'files'
  | 'automation'
  | 'market'
  | 'affiliate'
  | 'ad-maker'
  | 'connectors'
  | 'learning'
  | 'commerce'
  | 'providers'
  | 'tools'
  | 'more'
  | 'control'
  | 'settings'
  | 'admin';

export type AstraMode = 'easy' | 'smart' | 'tough' | 'expert' | 'agent';

export type UserRole = 'USER' | 'ADMIN' | 'OWNER';

export interface CreditTransaction {
  id: string;
  userId?: string;
  action: string;
  amount: number; // positive = credit added, negative = deducted
  timestamp: number;
  provider?: string;
  status: 'completed' | 'reserved' | 'refunded' | 'failed';
  reason?: string;
}

export interface PromoCode {
  code: string;
  credits: number;
  description: string;
  active: boolean;
  maxUses?: number;
  timesUsed: number;
  createdAt: string;
}

export interface PromoRedemption {
  id: string;
  userName: string;
  phoneNumber?: string;
  code: string;
  creditsGranted: number;
  timestamp: number;
  userId?: string;
}

export interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  content?: string; // base64 or text
}

export interface NavItemConfig {
  id: WorkspaceId;
  label: string;
  iconName: string;
  accent: 'cyan' | 'blue' | 'indigo' | 'violet' | 'pink' | 'rose' | 'emerald' | 'amber' | 'teal' | 'orange' | 'fuchsia';
  badge?: string;
}

export interface WorkspaceFeature {
  id: WorkspaceId;
  title: string;
  description: string;
  iconName: string;
  accent: string;
  badge?: string;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  price: string;
  change: string;
  positive: boolean;
  high: string;
  low: string;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  timeAgo: string;
  iconName: string;
  color: string;
}

export interface AIModelOption {
  id: string;
  name: string;
  provider: string;
  description: string;
  badge: string;
  iconColor: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
  codeBlocks?: { language: string; code: string }[];
}

export interface ProviderItem {
  name: string;
  capabilities: string;
  status: 'connected' | 'not-connected' | 'ready';
  keyName: string;
  accent: string;
  category: 'text' | 'image' | 'audio' | 'video' | 'search' | 'code' | 'finance' | 'database';
}
