import React, { useRef, useState } from 'react';
import axios from 'axios';
import { CreditCard, Upload, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { PaymentGuidelinesModal } from './PaymentGuidelinesModal';
import { authService } from '../../services/auth.service';
import { getApiErrorMessage } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import type { PaymentStatus } from '../../types/user';
import type { BackendPaymentReceipt } from '../../types/backend';
import type { User } from '../../types/auth';

interface FeePaymentCardProps {
  paymentStatus: PaymentStatus;
  feeReceipt?: BackendPaymentReceipt;
  user?: User;
  onUpdated?: () => Promise<void> | void;
}

const MAX_BYTES = 10 * 1024 * 1024;

export const FeePaymentCard: React.FC<FeePaymentCardProps> = ({ paymentStatus, feeReceipt, user, onUpdated }) => {
  const { addToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [uploading, setUploading] = useState(false);

  const paid = paymentStatus === 'Paid';
  const notApplicable = paymentStatus === 'Not Applicable';
  const awaitingVerification = !paid && !!feeReceipt && !feeReceipt.verified;

  const badge = paid ? 'Paid' : notApplicable ? 'Not Required' : awaitingVerification ? 'Verifying' : 'Pending';
  const badgeVariant = paid ? 'success' : notApplicable ? 'secondary' : awaitingVerification ? 'info' : 'warning';

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf') {
      addToast('Please upload the PDF receipt downloaded from the payment portal.', 'error');
      return;
    }
    if (file.size > MAX_BYTES) {
      addToast('Receipt must be 10 MB or smaller.', 'error');
      return;
    }
    setUploading(true);
    try {
      const res = await authService.uploadFeeReceipt(file);
      addToast(
        res.verified
          ? 'Receipt verified! Your registration fee is confirmed.'
          : 'Receipt uploaded. It will be verified by the team shortly.',
        res.verified ? 'success' : 'info'
      );
      await onUpdated?.();
    } catch (err) {
      const data = axios.isAxiosError(err) ? (err.response?.data as { message?: string; details?: string }) : undefined;
      if (data?.message === 'Receipt already exists and is verified') {
        addToast('Your receipt is already verified.', 'info');
        await onUpdated?.();
      } else {
        addToast(data?.details || getApiErrorMessage(err, 'Could not upload the receipt.'), 'error');
      }
    } finally {
      setUploading(false);
    }
  };

  const hint = paid
    ? 'Your registration fee is confirmed.'
    : notApplicable
    ? 'No registration fee is required.'
    : awaitingVerification
    ? 'Receipt received — it will be verified shortly. Registration unlocks once it is approved.'
    : 'Pay on the college fee portal, then upload your receipt here.';

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 text-[var(--accent)] shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h4 className="text-[15px] font-semibold text-[var(--text-primary)]">Registration Fee</h4>
              <Badge variant={badgeVariant}>{badge}</Badge>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">{hint}</p>
            {feeReceipt?.receiptNumber && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-mono text-[var(--text-secondary)]">
                {feeReceipt.verified ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                )}
                Receipt #{feeReceipt.receiptNumber}
              </p>
            )}
          </div>
        </div>

        {!paid && !notApplicable && (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button size="sm" onClick={() => setShowGuide(true)}>
              Pay Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              isLoading={uploading}
              leftIcon={!uploading ? <Upload className="w-4 h-4" /> : undefined}
            >
              {feeReceipt ? 'Re-upload Receipt' : 'Upload Receipt'}
            </Button>
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
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