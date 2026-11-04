import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { API_CONFIG } from '../../config/api';

interface PaymentGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  name?: string;
  email?: string;
  phone?: string;
}

export const PaymentGuidelinesModal: React.FC<PaymentGuidelinesModalProps> = ({ isOpen, onClose, name, email, phone }) => {
  const [agreed, setAgreed] = useState(false);
  const portalUrl = API_CONFIG.paymentPortalUrl;

  const goToPortal = () => {
    window.open(portalUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const steps: Array<[string, React.ReactNode]> = [
    ['Official portal only', 'Pay only through the PSG College of Technology fee portal using the button below.'],
    ['Choose “Student”', 'Select the Student participant category. Your receipt must show “Student” to be accepted.'],
    [
      'Use your Compute 50 details',
      <>
        Enter the same name, email and mobile number as your Compute 50 account
        {(name || email || phone) && (
          <span className="block mt-1 font-mono text-[12px] text-[var(--text-primary)]">
            {[name, email, phone].filter(Boolean).join(' · ')}
          </span>
        )}
        Receipts are matched against these details.
      </>,
    ],
    [
      'Upload your receipt here',
      'After paying, download the PDF receipt from the portal, come back to this page and click “Upload Receipt”. Hackathon registration unlocks once it is verified.',
    ],
    ['Pay only once', 'If your payment takes time to reflect, upload the receipt instead of paying again.'],
    ['No refunds', 'All payments are non-refundable. Duplicate or edited receipts will lead to disqualification.'],
  ];

  return createPortal(
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Guidelines" maxWidth="lg">
      <div className="space-y-5">
        <ol className="space-y-3">
          {steps.map(([title, body], i) => (
            <li key={title} className="flex gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/40 text-[var(--accent)] text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
                <strong className="block text-[var(--text-primary)]">{title}</strong>
                {body}
              </div>
            </li>
          ))}
        </ol>

        <div className="flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-[12.5px] leading-relaxed text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            The portal opens in a new tab. Keep this tab open so you can upload your receipt right after paying.
          </span>
        </div>

        <label className="flex items-start gap-2.5 text-[13px] text-[var(--text-primary)] cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          I have read and understood the payment guidelines.
        </label>

        {portalUrl ? (
          <Button fullWidth onClick={goToPortal} disabled={!agreed} rightIcon={<ExternalLink className="w-4 h-4" />}>
            Go to Payment Portal
          </Button>
        ) : (
          <p className="text-center text-[13px] text-[var(--text-secondary)]">
            The payment portal link will be available soon.
          </p>
        )}
      </div>
    </Modal>,
    document.body
  );
};

export default PaymentGuidelinesModal;