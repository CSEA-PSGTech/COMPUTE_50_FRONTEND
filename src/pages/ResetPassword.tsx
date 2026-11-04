import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { getApiErrorMessage } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const ResetPassword: React.FC = () => {
  const { token: pathToken } = useParams();
  const [params] = useSearchParams();
  const token = pathToken || params.get('token') || '';
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      addToast('Password reset successful. Please log in.', 'success');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid or expired reset link.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-black font-mono text-[var(--text-primary)]">RESET PASSWORD</h2>
        {!token && <p className="text-xs text-red-500">Reset token missing from the link.</p>}
        {error && <p className="text-xs font-mono text-red-500">{error}</p>}
        <form onSubmit={submit} className="space-y-3">
          <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <Button type="submit" fullWidth isLoading={loading} disabled={!token}>
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;