import React, { useCallback, useEffect, useState } from 'react';
import { CreditCard, RefreshCw, CheckCircle2, Clock, Info, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { PaymentGuidelinesModal } from './PaymentGuidelinesModal';
import { paymentService } from '../../services/payment.service';
import { getApiErrorMessage } from '../../services/api';
import type { PaymentStatus } from '../../types/user';
import type { BackendPaymentRecord } from '../../types/backend';
import type { User } from '../../types/auth';

interface FeePaymentCardProps {
  paymentStatus: PaymentStatus;
  user?: User;
  onUpdated?: () => Promise<void> | void;
}

type StatusMessage = { type: 'success' | 'info' | 'error'; text: string } | null;

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

export const FeePaymentCard: React.FC<FeePaymentCardProps> = ({ paymentStatus, user, onUpdated }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [checking, setChecking] = useState(false);
  const [records, setRecords] = useState<BackendPaymentRecord[]>([]);
  const [message, setMessage] = useState<StatusMessage>(null);

  const paid = paymentStatus === 'Paid';
  const notApplicable = paymentStatus === 'Not Applicable';

  const loadRecords = useCallback(async () => {
    try {
      setRecords(await paymentService.records());
    } catch {
      setRecords([]);
    }
  }, []);

  useEffect(() => {
    if (!notApplicable) loadRecords();
  }, [notApplicable, loadRecords]);

  const handleCheck = async () => {
    setChecking(true);
    setMessage(null);
    try {
      const res = await paymentService.check();
      const total = res.summary?.totalRegistrations ?? 0;
      if (res.generalFeePaid) {
        setMessage({
          type: 'success',
          text: (res.summary?.recordsCreated ?? 0) > 0
            ? 'Payment verified! Your registration fee is confirmed.'
            : 'Your payment is already verified.',
        });
        await onUpdated?.();
      } else if (total === 0) {
        setMessage({
          type: 'info',
          text: 'No payment found yet. If you just paid, wait a few minutes and check again. Make sure you paid with the same mobile number as your Compute 50 account.',
        });
      } else {
        setMessage({
          type: 'info',
          text: 'We found a payment, but not the registration fee. Contact the organizers if this looks wrong.',
        });
      }
      await loadRecords();
    } catch (err) {
      setMessage({ type: 'error', text: getApiErrorMessage(err, 'Could not check payment status. Please try again.') });
    } finally {
      setChecking(false);
    }
  };

  const badge = paid ? 'Paid' : notApplicable ? 'Not Required' : 'Pending';
  const badgeVariant = paid ? 'success' : notApplicable ? 'secondary' : 'warning';
  const hint = paid
    ? 'Your registration fee is confirmed.'
    : notApplicable
    ? 'No registration fee is required.'
    : 'Pay on the college fee portal, then click “Check Payment Status”.';

  const messageStyles = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    info: 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]',
    error: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
  };
  const MessageIcon = message?.type === 'success' ? CheckCircle2 : message?.type === 'error' ? AlertCircle : Info;

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 text-[var(--accent)] shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h4 className="text-[15px] font-semibold text-[var(--text-primary)] whitespace-nowrap">Registration Fee</h4>
              <Badge variant={badgeVariant}>{badge}</Badge>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">{hint}</p>
          </div>
        </div>

        {!paid && !notApplicable && (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button size="sm" onClick={() => setShowGuide(true)} className="whitespace-nowrap">
              Pay Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCheck}
              isLoading={checking}
              leftIcon={!checking ? <RefreshCw className="w-4 h-4" /> : undefined}
              className="whitespace-nowrap"
            >
              Check Payment Status
            </Button>
          </div>
        )}

        {message && (
          <div className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-[13px] leading-relaxed ${messageStyles[message.type]}`}>
            <MessageIcon className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {records.length > 0 && (
          <div className="rounded-xl border border-[var(--border-color)] divide-y divide-[var(--border-color)]">
            {records.map((r) => {
              const ok = r.status === '1';
              return (
                <div key={r._id} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-[13px]">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">{r.category}</p>
                    <p className="font-mono text-[11px] text-[var(--text-secondary)]">
                      {formatDate(r.time)}
                      {r.receiptNo ? ` · #${r.receiptNo}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-mono font-semibold text-[var(--text-primary)]">₹{r.amount}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {ok ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PaymentGuidelinesModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        name={user?.name}
        email={user?.email}
        phone={user?.phone}
      />
    </Card>
  );
};

export default FeePaymentCard;