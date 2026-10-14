import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  IntegrationDefinition,
  IntegrationStatus,
} from './integrationRegistryTypes';
import {
  fetchIntegrationRegistry,
  testProviderConnection,
  configureIntegrationSecrets,
  disconnectIntegration,
  executeIntegrationTool,
} from './toolRouter';

interface ConnectorsContextType {
  connectors: IntegrationDefinition[];
  loading: boolean;
  connectedCount: number;
  totalCount: number;
  refreshRegistry: () => Promise<void>;
  testConnection: (id: string) => Promise<{
    success: boolean;
    status: IntegrationStatus;
    latency: string;
    message: string;
  }>;
  testAll: () => Promise<void>;
  configureConnector: (
    id: string,
    secrets: Record<string, string>
  ) => Promise<{ success: boolean; message: string }>;
  disconnectConnector: (id: string) => Promise<{ success: boolean; message: string }>;
  executeAction: (
    providerId: string,
    actionId: string,
    params?: Record<string, any>
  ) => Promise<any>;
  isServiceConnected: (id: string) => boolean;
  // Legacy compatibility helpers
  toggleConnector: (id: string) => void;
  authorizeConnector: (
    id: string,
    credential?: string
  ) => { success: boolean; message: string };
}

const ConnectorsContext = createContext<ConnectorsContextType | undefined>(undefined);

export function ConnectorsProvider({ children }: { children: React.ReactNode }) {
  const [connectors, setConnectors] = useState<IntegrationDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectedCount, setConnectedCount] = useState(1);
  const [totalCount, setTotalCount] = useState(22);

  const refreshRegistry = useCallback(async () => {
    try {
      const data = await fetchIntegrationRegistry();
      if (data.integrations && data.integrations.length > 0) {
        setConnectors(data.integrations);
        setConnectedCount(data.connectedCount);
        setTotalCount(data.totalIntegrations);
      }
    } catch (err) {
      console.error('Failed to load dynamic integration registry:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRegistry();
  }, [refreshRegistry]);

  const testConnection = async (id: string) => {
    const result = await testProviderConnection(id);
    // Update local state immediately with test results
    setConnectors((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: result.status as IntegrationStatus,
            latency: result.latency || c.latency,
            lastChecked: new Date().toISOString(),
            errorMessage: result.status !== 'CONNECTED' ? result.message : undefined,
          };
        }
        return c;
      })
    );

    // Refresh count
    setConnectedCount((prev) => {
      const isNowConn = result.status === 'CONNECTED';
      const wasConn = connectors.find((c) => c.id === id)?.status === 'CONNECTED';
      if (isNowConn && !wasConn) return prev + 1;
      if (!isNowConn && wasConn) return Math.max(1, prev - 1);
      return prev;
    });

    return {
      success: result.success,
      status: result.status as IntegrationStatus,
      latency: result.latency,
      message: result.message,
    };
  };

  const testAll = async () => {
    try {
      const res = await fetch('/api/integrations/test-all', { method: 'POST' });
      if (res.ok) {
        await refreshRegistry();
      }
    } catch (err) {
      console.error('Failed to run test-all probe:', err);
    }
  };

  const configureConnector = async (id: string, secrets: Record<string, string>) => {
    const res = await configureIntegrationSecrets(id, secrets, 'OWNER');
    await refreshRegistry();
    return res;
  };

  const disconnect = async (id: string) => {
    const res = await disconnectIntegration(id, 'OWNER');
    await refreshRegistry();
    return res;
  };

  const executeAction = async (
    providerId: string,
    actionId: string,
    params?: Record<string, any>
  ) => {
    return await executeIntegrationTool(
      { providerId, actionId, parameters: params },
      'OWNER'
    );
  };

  const isServiceConnected = (id: string) => {
    if (id === 'firebase') return true;
    const item = connectors.find((c) => c.id === id);
    return item ? item.status === 'CONNECTED' : false;
  };

  // Backwards compatibility methods
  const toggleConnector = (id: string) => {
    const item = connectors.find((c) => c.id === id);
    if (!item) return;
    if (item.status === 'CONNECTED') {
      disconnect(id);
    }
  };

  const authorizeConnector = (id: string, credential?: string) => {
    if (!credential) return { success: false, message: 'Credential required.' };
    const item = connectors.find((c) => c.id === id);
    if (!item) return { success: false, message: 'Connector not found.' };

    const firstSecret = item.requiredSecrets[0]?.envVar || 'API_KEY';
    configureConnector(id, { [firstSecret]: credential });
    return { success: true, message: `Configured ${item.name}.` };
  };

  return (
    <ConnectorsContext.Provider
      value={{
        connectors,
        loading,
        connectedCount,
        totalCount,
        refreshRegistry,
        testConnection,
        testAll,
        configureConnector,
        disconnectConnector: disconnect,
        executeAction,
        isServiceConnected,
        toggleConnector,
        authorizeConnector,
      }}
    >
      {children}
    </ConnectorsContext.Provider>
  );
}

export function useConnectors() {
  const context = useContext(ConnectorsContext);
  if (!context) {
    throw new Error('useConnectors must be used within a ConnectorsProvider');
  }
  return context;
}
