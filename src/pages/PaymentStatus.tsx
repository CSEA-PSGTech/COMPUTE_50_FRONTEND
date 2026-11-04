import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { paymentService } from '../services/payment.service';
import { getApiErrorMessage } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { LoadingState } from '../components/common/LoadingState';
import type { BackendRedirectPayload } from '../types/backend';

export const PaymentStatus: React.FC = () => {
  const [params] = useSearchParams();
  const { refreshUser } = useAuth();
  const [payload, setPayload] = useState<BackendRedirectPayload | null>(null);
  const [error, setError] = useState('');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const encrypted = params.get('code') || params.get('data');
    if (!encrypted) {
      setError('No payment information found in the link.');
      return;
    }
    paymentService
      .decryptRedirect(encrypted)
      .then(async (p) => {
        setPayload(p);
        await refreshUser();
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Could not read payment result.')));
  }, [params, refreshUser]);

  if (!payload && !error) return <LoadingState message="Confirming your payment..." fullScreen />;

  const ok = !error && (payload?.success === true || String(payload?.status).toUpperCase() === 'SUCCESS');

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <Card className="p-8 text-center space-y-4">
        {ok ? (
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
        ) : (
          <XCircle className="w-12 h-12 mx-auto text-red-500" />
        )}
        <h2 className="text-xl font-black font-mono text-[var(--text-primary)]">
          {ok ? 'PAYMENT SUCCESSFUL' : 'PAYMENT NOT COMPLETED'}
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          {error ||
            (ok
              ? 'Your fee is confirmed. A receipt has been emailed to you.'
              : 'The transaction failed or was cancelled. No amount was confirmed — you can retry from your profile.')}
        </p>
        {!ok && payload?.error && !error && (
          <p className="text-xs font-mono text-red-500">{payload.error}</p>
        )}
        {payload?.transactionId && (
          <p className="text-xs font-mono text-[var(--text-secondary)]">Txn: {payload.transactionId}</p>
        )}
        <div className="flex justify-center gap-4 pt-2 text-sm font-bold">
          <Link to="/profile" className="text-[var(--accent)] underline">
            {ok ? 'Continue to hackathon registration' : 'Go to profile'}
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default PaymentStatus;