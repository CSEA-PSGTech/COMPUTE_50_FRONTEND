import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { PaymentStatus, RegistrationStatus, UserProfile } from '../../types/user';
import { paymentService } from '../../services/payment.service';
import { getApiErrorMessage } from '../../services/api';
import { useToast } from '../../hooks/useToast';

interface StatusCardsProps {
  registrationStatus: RegistrationStatus;
  paymentStatus?: PaymentStatus;
  onRegister?: () => Promise<void>;
  hackathon?: UserProfile['hackathon'];
}

const getBadgeVariant = (status: string) => {
  if (status === 'Confirmed' || status === 'Paid') return 'success';
  if (status === 'Pending') return 'warning';
  if (status === 'Failed') return 'error';
  return 'secondary';
};

export const StatusCards: React.FC<StatusCardsProps> = ({ registrationStatus, paymentStatus, onRegister, hackathon }) => {
  const { addToast } = useToast();
  const [paying, setPaying] = useState(false);
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
  const canRegister = !registered && !notOpen && !closed && feeOk;

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
    : 'Your fee is confirmed. Register for the hackathon to secure your spot.';

  const handlePay = async () => {
    setPaying(true);
    try {

      await paymentService.startGeneralPayment();
    } catch (err) {
      addToast(getApiErrorMessage(err, 'Could not start payment.'), 'error');
      setPaying(false);
    }
  };

  const needsPayment = paymentStatus === 'Pending' || paymentStatus === 'Failed';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 text-[var(--accent)] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h4 className="text-[15px] font-semibold text-[var(--text-primary)]">Registration Status</h4>
              <Badge variant={badgeVariant}>{badgeLabel}</Badge>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
              {hint}
            </p>
          </div>
        </div>
        {canRegister && onRegister && (
          <Button size="sm" onClick={handleRegister} isLoading={registering}>
            Register for Hackathon
          </Button>
        )}
        </div>
      </Card>

      {paymentStatus && (
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 text-[var(--accent)] shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-[15px] font-semibold text-[var(--text-primary)]">Registration Fee</h4>
                  <Badge variant={getBadgeVariant(paymentStatus)}>{paymentStatus}</Badge>
                </div>
                <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
                  Fee is calculated by the server (PSG / non-PSG).
                </p>
              </div>
            </div>
            {needsPayment && (
              <Button size="sm" onClick={handlePay} isLoading={paying}>
                {paymentStatus === 'Failed' ? 'Retry Payment' : 'Pay Now'}
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};