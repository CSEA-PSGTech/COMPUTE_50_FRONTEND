import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CheckCircle2 } from 'lucide-react';
import { PaymentStatus, RegistrationStatus, UserProfile } from '../../types/user';
import { FeePaymentCard } from './FeePaymentCard';
import type { User } from '../../types/auth';

interface StatusCardsProps {
  registrationStatus: RegistrationStatus;
  paymentStatus?: PaymentStatus;
  onRegister?: () => Promise<void>;
  hackathon?: UserProfile['hackathon'];
  user?: User;
  onFeeUpdated?: () => Promise<void> | void;
  photoOk?: boolean;
}

const getBadgeVariant = (status: string) => {
  if (status === 'Confirmed' || status === 'Paid') return 'success';
  if (status === 'Pending') return 'warning';
  if (status === 'Failed') return 'error';
  return 'secondary';
};

export const StatusCards: React.FC<StatusCardsProps> = ({
  registrationStatus,
  paymentStatus,
  onRegister,
  hackathon,
  user,
  onFeeUpdated,
  photoOk = true,
}) => {
  const [registering, setRegistering] = useState(false);

  const handleRegister = async () => {
    if (!onRegister) return;
    setRegistering(true);
    try {
      await onRegister();
    } finally {
      setRegistering(false);
    }
  };

  const feeOk = paymentStatus === 'Paid' || paymentStatus === 'Not Applicable';
  const registered = registrationStatus === 'Confirmed';
  const notOpen = hackathon ? !hackathon.exists : false;
  const closed = hackathon?.closed === true;
  const canRegister = !registered && !notOpen && !closed && feeOk && photoOk;

  const badgeLabel = registered ? 'Confirmed' : notOpen ? 'Not Open Yet' : closed ? 'Closed' : registrationStatus;
  const badgeVariant = registered ? 'success' : closed ? 'error' : notOpen ? 'secondary' : getBadgeVariant(registrationStatus);
  const hint = registered
    ? `You're registered for ${hackathon?.eventName || 'the hackathon'}.`
    : notOpen
    ? "Hackathon registration hasn't opened yet."
    : closed
    ? 'Registration for the hackathon is closed.'
    : !feeOk
    ? 'Pay the registration fee to unlock hackathon registration.'
    : !photoOk
    ? 'Upload your profile photo to unlock hackathon registration.'
    : 'Your fee is confirmed. Register for the hackathon to secure your spot.';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 text-[var(--accent)] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <h4 className="text-[15px] font-semibold text-[var(--text-primary)] whitespace-nowrap">Registration Status</h4>
                <Badge variant={badgeVariant}>{badgeLabel}</Badge>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">{hint}</p>
            </div>
          </div>
          {canRegister && onRegister && (
            <div className="flex">
              <Button size="sm" onClick={handleRegister} isLoading={registering} className="whitespace-nowrap">
                Register for Hackathon
              </Button>
            </div>
          )}
        </div>
      </Card>

      {paymentStatus && (
        <FeePaymentCard paymentStatus={paymentStatus} user={user} onUpdated={onFeeUpdated} />
      )}
    </div>
  );
};