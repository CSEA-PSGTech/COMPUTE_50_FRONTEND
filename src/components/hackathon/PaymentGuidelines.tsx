import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';

const steps: Array<[string, React.ReactNode]> = [
  ['Create your Compute 50 account', 'Sign up on this site and open your profile. The Pay Now button there takes you to the payment portal.'],
  ['Official portal only', 'Pay only through the PSG College of Technology events portal opened from your profile.'],
  [
    'Use your Compute 50 mobile number',
    'Enter the same mobile number and email as your Compute 50 account. Payments are matched using your mobile number, so a different number means your payment won’t show up.',
  ],
  [
    'Keep these ready',
    <>
      The portal verifies your mobile and email with an OTP, then asks for:
      <ul className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[13px]">
        <li>• A passport-size photo (max 512 KB)</li>
        <li>• Prefix, full name and gender</li>
        <li>• Participant type: choose “Participant”</li>
        <li>• Your college name</li>
        <li>• Full address</li>
        <li>• Pincode</li>
      </ul>
    </>,
  ],
  ['Review and pay ₹150', 'Check the details on the review page and click “Proceed to Payment”. Read the portal’s payment guidelines, choose a payment mode and complete the payment. Keep the receipt or transaction ID.'],
  ['Check your payment status', 'Return to your profile and click “Check Payment Status”. Once it shows Paid, register for the hackathon.'],
  ['Pay only once', 'Payments can take a few minutes to reflect. Check again later instead of paying twice.'],
  ['No refunds', 'All payments are non-refundable. Paying the fee alone does not register you. Register for the hackathon afterwards.'],
];

export const PaymentGuidelines: React.FC = () => {
  return (
    <Card className="space-y-5">
      <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {steps.map(([title, body], i) => (
          <li key={title} className="flex gap-3">
            <span className="w-6 h-6 shrink-0 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/40 text-[var(--accent)] text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <div className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
              <strong className="block text-[var(--text-primary)]">{title}</strong>
              {body}
            </div>
          </li>
        ))}
      </ol>

      <div className="flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-[13px] leading-relaxed text-amber-800 dark:text-amber-300">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Never pay through links shared on WhatsApp or elsewhere. Use only the Pay Now button on your profile.</span>
      </div>

      <Link
        to="/profile"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline"
      >
        Go to your profile to pay
        <ArrowRight className="w-4 h-4" />
      </Link>
    </Card>
  );
};

export default PaymentGuidelines;