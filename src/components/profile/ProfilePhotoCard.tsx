import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { authService } from '../../services/auth.service';
import { getApiErrorMessage } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { validatePhotoFile } from '../../lib/profilePhoto';

interface ProfilePhotoCardProps {
  onUploaded?: (url: string) => Promise<void> | void;
}

export const ProfilePhotoCard: React.FC<ProfilePhotoCardProps> = ({ onUploaded }) => {
  const { addToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const invalid = validatePhotoFile(file);
    if (invalid) {
      addToast(invalid, 'error');
      return;
    }
    setUploading(true);
    try {
      const url = await authService.uploadProfilePhoto(file);
      addToast('Profile photo uploaded!', 'success');
      await onUploaded?.(url);
    } catch (err) {
      addToast(getApiErrorMessage(err, 'Failed to upload photo.'), 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-5 sm:p-6 border-amber-500/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h4 className="text-[15px] font-semibold text-[var(--text-primary)]">Profile Photo</h4>
              <Badge variant="warning">Required</Badge>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
              Upload a clear photo of your face (JPEG, PNG or WebP, up to 5 MB). It&apos;s required to register for the
              hackathon.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => inputRef.current?.click()}
          isLoading={uploading}
          leftIcon={!uploading ? <Upload className="w-4 h-4" /> : undefined}
        >
          Upload Photo
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </Card>
  );
};

export default ProfilePhotoCard;