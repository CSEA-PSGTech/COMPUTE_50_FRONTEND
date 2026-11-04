import React, { useRef, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { User } from '../../types/auth';
import { Edit3, Mail, Phone, Building, GraduationCap, Camera, Loader2 } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { getApiErrorMessage } from '../../services/api';
import { API_CONFIG, fileUrl } from '../../config/api';
import { useToast } from '../../hooks/useToast';
import { hasProfilePhoto, validatePhotoFile } from '../../lib/profilePhoto';

interface PersonalDetailsProps {
  user: User;
  onEdit: () => void;
  onPhotoChange?: (url: string) => void;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ user, onEdit, onPhotoChange }) => {
  const { addToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const showPhoto = hasProfilePhoto(user.profilePhoto) && !imgFailed;

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
      setImgFailed(false);
      onPhotoChange?.(url);
      addToast('Profile photo updated!', 'success');
    } catch (err) {
      addToast(getApiErrorMessage(err, 'Failed to upload photo.'), 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            aria-label="Change profile photo"
            title="Change profile photo"
            className="group relative w-12 h-12 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] font-bold text-lg font-mono overflow-hidden cursor-pointer shrink-0"
          >
            {showPhoto ? (
              <img
                src={fileUrl(user.profilePhoto as string)}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={() => setImgFailed(true)}
              />
            ) : (
              user.name.charAt(0)
            )}
            <span
              className={`absolute inset-0 flex items-center justify-center bg-black/50 text-white transition-opacity ${
                uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
              }`}
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </span>
          </button>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[var(--accent)] text-zinc-950 border-2 border-[var(--bg-surface)] flex items-center justify-center"
          >
            <Camera className="w-2.5 h-2.5" />
          </span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFile}
          />
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{user.name}</h3>
            <span className="text-[13px] text-[var(--text-secondary)] font-mono">{user.id}</span>
          </div>
        </div>
        {API_CONFIG.profileEditEnabled && (
          <Button variant="outline" size="sm" onClick={onEdit} leftIcon={<Edit3 className="w-4 h-4" />}>
          Edit Profile
        </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[var(--text-secondary)]">
        <div className="flex items-center gap-2.5">
          <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span><strong className="text-[var(--text-primary)]">Email:</strong> {user.email}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span><strong className="text-[var(--text-primary)]">Phone:</strong> {user.phone}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Building className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span><strong className="text-[var(--text-primary)]">College:</strong> {user.college}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span><strong className="text-[var(--text-primary)]">Dept & Year:</strong> {user.department} ({user.year})</span>
        </div>
      </div>
    </Card>
  );
};