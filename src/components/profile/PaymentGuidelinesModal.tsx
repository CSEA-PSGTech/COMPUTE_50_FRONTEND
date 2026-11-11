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
    ['Official portal only', 'Pay only through the PSG College of Technology events portal using the button below.'],
    [
      'Use your Compute 50 mobile number',
      <>
        Enter the same mobile number and email as your Compute 50 account
        {(name || email || phone) && (
          <span className="block mt-1 font-mono text-[12px] text-[var(--text-primary)]">
            {[name, email, phone].filter(Boolean).join(' · ')}
          </span>
        )}
        Payments are matched using your mobile number — a different number means it won't show up here.
      </>,
    ],
    [
      'Keep these ready',
      <>
        The portal verifies your mobile and email with an OTP, then asks for:
        <ul className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[12.5px]">
          <li>• A passport-size photo (max 512 KB)</li>
          <li>• Prefix, full name and gender</li>
          <li>• Participant type: choose “Participant”</li>
          <li>• Your college name</li>
          <li>• Full address</li>
          <li>• Pincode</li>
        </ul>
      </>,
    ],
    ['Review and pay ₹150', 'Check the details on the review page and click “Proceed to Payment”. Read the portal’s payment guidelines, continue, choose a payment mode and complete the payment. Keep the receipt or transaction ID.'],
    [
      'Check your payment status',
      'Come back to this page and click “Check Payment Status”. Once it shows Paid, register for the hackathon.',
    ],
    ['Pay only once', 'Payments can take a few minutes to reflect. Check again later instead of paying twice.'],
    ['No refunds', 'All payments are non-refundable. Paying the fee alone does not register you — register for the hackathon afterwards.'],
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
            The portal opens in a new tab. Keep this tab open so you can check your payment status right after paying.
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