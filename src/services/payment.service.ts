import { authApi } from './api';
import { API_CONFIG } from '../config/api';
import type {
  BackendPaymentCheckResponse,
  BackendPaymentRecord,
  BackendPaymentRecordsResponse,
} from '../types/backend';

const BASE = '/api/auth/user/payment';

const eventParams = () => (API_CONFIG.paymentEventKey ? { event: API_CONFIG.paymentEventKey } : undefined);

export const paymentService = {
  check: async (): Promise<BackendPaymentCheckResponse> => {
    const { data } = await authApi.get<BackendPaymentCheckResponse>(`${BASE}/check`, {
      params: eventParams(),
      timeout: 30000,
    });
    return data;
  },

  records: async (): Promise<BackendPaymentRecord[]> => {
    const { data } = await authApi.get<BackendPaymentRecordsResponse>(`${BASE}/records`, { params: eventParams() });
    return data.data?.records ?? [];
  },
};