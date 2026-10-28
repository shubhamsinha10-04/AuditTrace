import { Platform } from 'react-native';

// Detect default backend URL based on platform
const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    // Local PC Wi-Fi IP for physical realme GT 2 device
    return 'http://192.168.1.3:5000/api';
  }
  // iOS simulator and Web browser
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * AuditTrace Enterprise API Client
 * Provides communication with Node.js/Express backend with offline fallback
 */
export const apiClient = {
  // Check if enterprise backend server is reachable
  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) return { online: false, error: `HTTP ${res.status}` };
      const data = await res.json();
      return { online: true, data };
    } catch (e) {
      return { online: false, error: e.message };
    }
  },

  // Fetch all engagements from remote server
  async fetchAudits() {
    try {
      const res = await fetch(`${API_BASE_URL}/audits`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('API fetchAudits warning:', e.message);
      return null;
    }
  },

  // Sync a single audit engagement to the server
  async syncAudit(auditData) {
    try {
      const res = await fetch(`${API_BASE_URL}/audits/${auditData.id}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auditData)
      });
      if (!res.ok) throw new Error(`Sync failed with HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('API syncAudit error:', e.message);
      throw e;
    }
  },

  // Batch sync all offline engagements
  async batchSync(auditsArray) {
    try {
      const res = await fetch(`${API_BASE_URL}/sync/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audits: auditsArray })
      });
      if (!res.ok) throw new Error(`Batch sync failed with HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('API batchSync error:', e.message);
      throw e;
    }
  },

  // Upload photo evidence to server for cryptographic sealing
  async uploadEvidence(evidencePayload) {
    try {
      const res = await fetch(`${API_BASE_URL}/evidence/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evidencePayload)
      });
      if (!res.ok) throw new Error(`Evidence upload failed: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('API uploadEvidence error:', e.message);
      throw e;
    }
  },

  // Reset server database to master KPMG template
  async resetServerDatabase() {
    try {
      const res = await fetch(`${API_BASE_URL}/audits/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch (e) {
      console.warn('API reset warning:', e.message);
      return null;
    }
  }
};
