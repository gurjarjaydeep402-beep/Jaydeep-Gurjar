import type {
  IntegrationDefinition,
  ToolExecutionRequest,
  ToolExecutionResponse,
} from './integrationRegistryTypes';

/**
 * ASTRA Central Tool Router
 *
 * Architecture:
 * ASTRA (Chat / Code / Agent / Studio)
 *   ↓
 * Tool Router
 *   ↓
 * Integration Registry
 *   ↓
 * Provider Adapter (Server-Side)
 *   ↓
 * Official Provider API
 *   ↓
 * Result / Truthful Structured Error
 */

export async function fetchIntegrationRegistry(): Promise<{
  integrations: IntegrationDefinition[];
  totalIntegrations: number;
  connectedCount: number;
}> {
  try {
    const res = await fetch('/api/integrations/registry');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      integrations: data.integrations || [],
      totalIntegrations: data.totalIntegrations || 0,
      connectedCount: data.connectedCount || 0,
    };
  } catch (err: any) {
    console.error('Failed to fetch integration registry:', err);
    return {
      integrations: [],
      totalIntegrations: 0,
      connectedCount: 0,
    };
  }
}

export async function testProviderConnection(id: string): Promise<{
  success: boolean;
  status: string;
  latency: string;
  message: string;
  details?: any;
}> {
  try {
    const res = await fetch('/api/integrations/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      status: 'TEMPORARILY_UNAVAILABLE',
      latency: '—',
      message: err.message || 'Network error executing connection test.',
    };
  }
}

export async function executeIntegrationTool(
  req: ToolExecutionRequest,
  userRole: string = 'USER'
): Promise<ToolExecutionResponse> {
  const startTime = Date.now();
  try {
    const res = await fetch('/api/integrations/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-astra-role': userRole,
      },
      body: JSON.stringify(req),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      status: 'TEMPORARILY_UNAVAILABLE',
      provider: req.providerId,
      action: req.actionId,
      message: err.message || 'Execution failed due to network error.',
      timestamp: new Date().toISOString(),
      executionTimeMs: Date.now() - startTime,
    };
  }
}

export async function configureIntegrationSecrets(
  id: string,
  secrets: Record<string, string>,
  userRole: string = 'ADMIN'
): Promise<{ success: boolean; message: string; checkResult?: any }> {
  try {
    const res = await fetch('/api/integrations/configure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-astra-role': userRole,
      },
      body: JSON.stringify({ id, secrets }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to configure secrets.',
    };
  }
}

export async function disconnectIntegration(
  id: string,
  userRole: string = 'ADMIN'
): Promise<{ success: boolean; message: string; status?: string }> {
  try {
    const res = await fetch('/api/integrations/disconnect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-astra-role': userRole,
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to disconnect integration.',
    };
  }
}
