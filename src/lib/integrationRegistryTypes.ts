export type IntegrationStatus =
  | 'CONNECTED'
  | 'NOT_CONNECTED'
  | 'SETUP_REQUIRED'
  | 'AUTHORIZATION_REQUIRED'
  | 'INVALID_CREDENTIALS'
  | 'QUOTA_EXCEEDED'
  | 'TEMPORARILY_UNAVAILABLE'
  | 'NOT_SUPPORTED';

export type IntegrationCategory =
  | 'AI'
  | 'AUTHENTICATION'
  | 'GOOGLE WORKSPACE'
  | 'DEVELOPMENT'
  | 'DATABASE'
  | 'STORAGE'
  | 'SEARCH'
  | 'COMMUNICATION'
  | 'ANALYTICS'
  | 'PAYMENTS'
  | 'AUTOMATION'
  | 'MEDIA'
  | 'OTHER';

export type AuthType = 'oauth' | 'api_key' | 'token' | 'service_account' | 'inbuilt';

export interface IntegrationActionParam {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'textarea';
  required?: boolean;
  defaultValue?: string | number | boolean;
  placeholder?: string;
  description?: string;
}

export interface IntegrationAction {
  id: string;
  name: string;
  description: string;
  params: IntegrationActionParam[];
}

export interface IntegrationSecretSpec {
  name: string;
  label: string;
  description: string;
  isConfigured: boolean;
  previewMasked?: string;
  docUrl?: string;
  envVar: string;
  required: boolean;
}

export interface IntegrationDefinition {
  id: string;
  name: string;
  provider: string;
  category: IntegrationCategory;
  description: string;
  iconName: string;
  authType: AuthType;
  status: IntegrationStatus;
  latency: string;
  lastChecked: string | null;
  errorMessage?: string;
  requiredSecrets: IntegrationSecretSpec[];
  oauthScopes: string[];
  capabilities: string[];
  supportedActions: IntegrationAction[];
  documentationUrl?: string;
  usageQuota?: {
    used?: number;
    limit?: number;
    unit?: string;
    resetDate?: string;
  };
}

export interface ToolExecutionRequest {
  providerId: string;
  actionId: string;
  parameters?: Record<string, any>;
}

export interface ToolExecutionResponse {
  success: boolean;
  status: IntegrationStatus;
  provider: string;
  action: string;
  data?: any;
  message?: string;
  requiredCredentials?: string[];
  executionTimeMs?: number;
  timestamp: string;
}
