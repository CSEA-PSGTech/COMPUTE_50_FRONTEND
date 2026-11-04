import { paymentApi } from './api';
import type { BackendPaymentRecord, BackendRedirectPayload } from '../types/backend';

const extractGatewayUrl = (data: unknown): string => {
  if (typeof data === 'string') return data;
  const d = (data ?? {}) as Record<string, unknown>;
  const url = d.url ?? d.paymentUrl ?? d.redirectUrl ?? d.gatewayUrl ?? (d.data as Record<string, unknown>)?.url;
  if (typeof url !== 'string' || !url) {
    throw new Error('Payment gateway URL missing from server response.');
  }
  return url;
};

const pickArray = (data: unknown): BackendPaymentRecord[] => {
  if (Array.isArray(data)) return data;
  const d = (data ?? {}) as Record<string, unknown>;
  for (const k of ['payments', 'paymentDetails', 'data', 'records']) {
    if (Array.isArray(d[k])) return d[k] as BackendPaymentRecord[];
  }
  return [];
};

export const isSuccessfulPayment = (p: BackendPaymentRecord) => String(p.status).toUpperCase() === 'SUCCESS';

export const paymentService = {

  payGeneral: async (): Promise<string> => {
    const { data } = await paymentApi.post('/api/payment/pay-general');
    return extractGatewayUrl(data);
  },

  redirectToGateway: (url: string) => {
    window.location.assign(url);
  },

  startGeneralPayment: async () => paymentService.redirectToGateway(await paymentService.payGeneral()),

  getMyPayments: async (): Promise<BackendPaymentRecord[]> => {
    const { data } = await paymentApi.get('/api/payment/payment-details');
    return pickArray(data);
  },

  decryptRedirect: async (encrypted: string): Promise<BackendRedirectPayload> => {
    const { data } = await paymentApi.post('/api/payment/decrypt-redirect', { data: encrypted });
    return (data?.decryptedData ?? data?.data ?? data) as BackendRedirectPayload;
  },

  hasPaid: async (uniqueId: string, eventId: string): Promise<boolean> => {
    const { data } = await paymentApi.post('/api/payment/user-payment-details', { uniqueId, eventId });
    if (typeof data === 'boolean') return data;
    return Boolean(data?.paid ?? data?.hasPaid ?? (data?.status ? data.status === 'SUCCESS' : data?.success));
  },
};