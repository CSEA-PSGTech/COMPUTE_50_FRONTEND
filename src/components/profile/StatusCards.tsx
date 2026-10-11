import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CheckCircle2 } from 'lucide-react';
import { RegistrationStatus } from '../../types/user';

interface StatusCardsProps {
  registrationStatus: RegistrationStatus;
}

export const StatusCards: React.FC<StatusCardsProps> = ({ registrationStatus }) => {
  const getBadgeVariant = (status: string) => {
    if (status === 'Confirmed' || status === 'Paid') return 'success';
    if (status === 'Pending') return 'warning';
    return 'secondary';
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 text-[var(--accent)] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h4 className="text-[15px] font-semibold text-[var(--text-primary)]">Registration Status</h4>
              <Badge variant={getBadgeVariant(registrationStatus)}>{registrationStatus}</Badge>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
              Hackathon registration verification status.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
