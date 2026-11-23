import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Users,
  Lock,
  Crown,
  UserPlus,
  UserMinus,
  Search,
  Pencil,
  Trash2,
  Check,
  X,
  Copy,
  RefreshCw,
  Loader2,
  AlertCircle,
  BadgeCheck,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useToast } from '../../hooks/useToast';
import { getApiErrorMessage } from '../../services/api';
import { teamService, Team, TeamSettings, AvailableUser } from '../../services/team.service';
import { API_CONFIG } from '../../config/api';

interface HackathonTeamCardProps {
  registered: boolean;
  myId: string;
}

type Confirm =
  | { kind: 'remove'; member: { uniqueId: string; name?: string } }
  | { kind: 'leader'; member: { uniqueId: string; name?: string } }
  | { kind: 'leave' }
  | { kind: 'delete' };

const inputClass =
  'w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20';

const doneKey = (teamId: string) => `c50:team-done:${teamId}`;

const CardShell: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; muted?: boolean }> = ({
  icon,
  title,
  children,
  muted,
}) => (
  <Card className="p-5 sm:p-6">
    <div className="flex items-start gap-3.5">
      <div
        className={`p-2.5 rounded-xl border shrink-0 ${
          muted
            ? 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)]'
            : 'bg-[var(--accent-muted)] border-[var(--accent)]/30 text-[var(--accent)]'
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[15px] font-semibold text-[var(--text-primary)]">{title}</h4>
        {children}
      </div>
    </div>
  </Card>
);

const MyIdChip: React.FC<{ myId: string }> = ({ myId }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(myId).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-2.5 py-1 font-mono text-xs font-bold text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer"
      title="Copy your ID"
    >
      {myId}
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
    </button>
  );
};

const initials = (name?: string): string =>
  (name || '?')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const MemberAvatar: React.FC<{ name?: string; leader?: boolean }> = ({ name, leader }) => (
  <div
    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
      leader
        ? 'bg-[var(--accent)] text-[var(--accent-text,#0A0A0A)]'
        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]'
    }`}
    aria-hidden
  >
    {initials(name)}
  </div>
);

const CopyField: React.FC<{ label: string; value: string; hint?: string; highlight?: boolean }> = ({
  label,
  value,
  hint,
  highlight,
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight
          ? 'border-[var(--accent)]/50 bg-[var(--accent-muted)] shadow-[0_0_0_1px_rgba(251,191,36,0.15)]'
          : 'border-[var(--border-color)] bg-[var(--bg-main)]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
            highlight ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
          }`}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(value).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            });
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors cursor-pointer"
          title={`Copy ${label}`}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-1 font-mono text-[12.5px] text-[var(--text-primary)] break-all select-all">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-[var(--text-secondary)] leading-relaxed">{hint}</p>}
    </div>
  );
};

const ProgressDots: React.FC<{ size: number; maxSize: number }> = ({ size, maxSize }) => (
  <div className="flex items-center gap-1" aria-label={`${size} of ${maxSize} members`}>
    {Array.from({ length: maxSize }).map((_, i) => (
      <span
        key={i}
        className={`h-1.5 rounded-full transition-all duration-300 ${
          i < size ? 'w-5 bg-[var(--accent)]' : 'w-2.5 bg-[var(--border-color)]'
        }`}
      />
    ))}
  </div>
);

const TeamCardBody: React.FC<HackathonTeamCardProps> = ({ registered, myId }) => {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<TeamSettings | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState('');
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<AvailableUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [finalized, setFinalized] = useState(false);
  const searchSeq = useRef(0);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await teamService.getMine();
      setSettings(data.settings);
      setTeam(data.team);
    } catch (err) {
      setLoadError(getApiErrorMessage(err, 'Could not load your team.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (registered) load();
  }, [registered, load]);

  const isLeader = !!team && team.leaderId === myId;
  // Backend open flag AND the frontend feature flag. When either is off, the team
  // is read-only — details stay visible, only editing is disabled (never masked).
  const open = !!settings?.open;
  const formationOpen = open && API_CONFIG.teamFormation;
  const maxSize = settings?.maxSize ?? 4;
  const minSize = settings?.minSize ?? 1;
  const size = team?.members.length ?? 0;
  const full = size >= maxSize;
  const canEdit = formationOpen && isLeader && !finalized;
  const canAdd = canEdit && !full;

  const teamId = team?._id;
  useEffect(() => {
    if (!teamId || !isLeader) {
      setFinalized(false);
      return;
    }
    try {
      setFinalized(localStorage.getItem(doneKey(teamId)) === '1');
    } catch {
      setFinalized(false);
    }
  }, [teamId, isLeader]);

  useEffect(() => {
    if (!canAdd || !showResults) return;
    const seq = ++searchSeq.current;
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const users = await teamService.available(search.trim());
        if (seq === searchSeq.current) setResults(users);
      } catch {
        if (seq === searchSeq.current) setResults([]);
      } finally {
        if (seq === searchSeq.current) setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, canAdd, showResults, size]);

  const run = async (key: string, action: () => Promise<void>, success: string) => {
    setBusy(key);
    try {
      await action();
      addToast(success, 'success');
    } catch (err) {
      addToast(getApiErrorMessage(err, 'Something went wrong. Please try again.'), 'error');
      if (axiosStatus(err) === 409 || axiosStatus(err) === 403) load();
    } finally {
      setBusy('');
    }
  };

  const markDone = () => {
    if (!team) return;
    if (size < minSize) {
      addToast(`Add ${minSize - size} more member${minSize - size === 1 ? '' : 's'} before finishing.`, 'error');
      return;
    }
    try {
      localStorage.setItem(doneKey(team._id), '1');
    } catch {
      /* ignore storage errors */
    }
    setFinalized(true);
    setShowResults(false);
    setSearch('');
    addToast('Team finalized. You can still edit it until team formation closes.', 'success');
  };

  const reopen = () => {
    if (!team) return;
    try {
      localStorage.removeItem(doneKey(team._id));
    } catch {
      /* ignore storage errors */
    }
    setFinalized(false);
  };

  const createTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (name.length < 3 || name.length > 40) {
      addToast('Team name must be 3 to 40 characters.', 'error');
      return;
    }
    run('create', async () => {
      setTeam(await teamService.create(name));
      setNewName('');
    }, 'Team created. You are the team leader.');
  };

  const saveName = () => {
    const name = editName.trim();
    if (!team || name === team.teamName) {
      setEditing(false);
      return;
    }
    if (name.length < 3 || name.length > 40) {
      addToast('Team name must be 3 to 40 characters.', 'error');
      return;
    }
    run('rename', async () => {
      setTeam(await teamService.rename(name));
      setEditing(false);
    }, 'Team renamed.');
  };

  const addMember = (user: AvailableUser) =>
    run(`add-${user.uniqueId}`, async () => {
      setTeam(await teamService.addMember(user.uniqueId));
      setSearch('');
      setResults((prev) => prev.filter((u) => u.uniqueId !== user.uniqueId));
    }, `${user.name || user.uniqueId} added to your team.`);

  const addTyped = () => {
    const id = search.trim().toUpperCase();
    if (!id) return;
    addMember({ uniqueId: id });
  };

  const confirmAction = () => {
    if (!confirm) return;
    const current = confirm;
    setConfirm(null);
    if (current.kind === 'remove') {
      run(`remove-${current.member.uniqueId}`, async () => {
        setTeam(await teamService.removeMember(current.member.uniqueId));
      }, `${current.member.name || current.member.uniqueId} removed from your team.`);
    } else if (current.kind === 'leader') {
      run(`leader-${current.member.uniqueId}`, async () => {
        setTeam(await teamService.makeLeader(current.member.uniqueId));
      }, `${current.member.name || current.member.uniqueId} is now the team leader.`);
    } else if (current.kind === 'leave') {
      run('leave', async () => {
        await teamService.leave();
        setTeam(null);
      }, 'You left the team.');
    } else {
      run('delete', async () => {
        await teamService.remove();
        setTeam(null);
      }, 'Team deleted.');
    }
  };

  if (!registered) {
    return (
      <CardShell icon={<Lock className="w-5 h-5" />} title="Your Team" muted>
        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
          Register for the hackathon first. Once you are registered, you can create a team or be added to one.
        </p>
      </CardShell>
    );
  }

  if (loading) {
    return (
      <CardShell icon={<Users className="w-5 h-5" />} title="Your Team">
        <div className="mt-3 space-y-2 animate-pulse">
          <div className="h-3 w-2/3 rounded bg-[var(--bg-secondary)]" />
          <div className="h-3 w-1/2 rounded bg-[var(--bg-secondary)]" />
        </div>
      </CardShell>
    );
  }

  if (loadError || !settings) {
    return (
      <CardShell icon={<AlertCircle className="w-5 h-5" />} title="Your Team" muted>
        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">{loadError || 'Could not load your team.'}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={load} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Try again
        </Button>
      </CardShell>
    );
  }

  if (!team) {
    return (
      <CardShell
        icon={formationOpen ? <Users className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        title={formationOpen ? 'Create a team' : 'Your Team'}
        muted={!formationOpen}
      >
        {formationOpen ? (
          <>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
              Teams have {minSize === maxSize ? maxSize : `${minSize} to ${maxSize}`} members, including the leader.
              Create a team and add your teammates, or share your ID with your team leader so they can add you.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--text-secondary)]">
              Your ID <MyIdChip myId={myId} />
            </div>
            <form onSubmit={createTeam} className="mt-4 flex flex-col sm:flex-row gap-2.5">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={40}
                placeholder="Team name"
                aria-label="Team name"
                className={inputClass}
              />
              <Button type="submit" size="md" isLoading={busy === 'create'} leftIcon={<Users className="w-4 h-4" />} className="shrink-0">
                Create team
              </Button>
            </form>
          </>
        ) : (
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
            Team formation is not open right now. You are not in a team yet. Updates will be shared in the WhatsApp group.
            Your ID is <span className="font-mono font-bold text-[var(--accent)]">{myId}</span>.
          </p>
        )}
      </CardShell>
    );
  }

  const short = Math.max(0, minSize - size);
  const ready = size >= minSize;

  return (
    <>
    <Card
      className={`p-5 sm:p-6 space-y-5 transition-colors ${
        finalized ? 'border-emerald-500/40 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0">
          <div
            className={`p-2.5 rounded-xl border shrink-0 ${
              finalized
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500'
                : 'bg-[var(--accent-muted)] border-[var(--accent)]/30 text-[var(--accent)]'
            }`}
          >
            {finalized ? <BadgeCheck className="w-5 h-5" /> : <Users className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">Your Team</span>
            {editing ? (
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveName();
                    if (e.key === 'Escape') setEditing(false);
                  }}
                  maxLength={40}
                  autoFocus
                  aria-label="New team name"
                  className={`${inputClass} py-1.5`}
                />
                <button type="button" onClick={saveName} disabled={busy === 'rename'} className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-500/10 cursor-pointer" aria-label="Save name">
                  {busy === 'rename' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer" aria-label="Cancel">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-[var(--text-primary)] truncate">{team.teamName}</h3>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(team.teamName);
                      setEditing(true);
                    }}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-secondary)] cursor-pointer"
                    aria-label="Rename team"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-2.5 py-1 font-mono text-xs font-bold text-[var(--text-primary)]">
              {size}/{maxSize} members
            </span>
            {finalized ? (
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <BadgeCheck className="w-3.5 h-3.5" /> Finalized
              </span>
            ) : short > 0 ? (
              <span className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                Needs {short} more
              </span>
            ) : (
              <span className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Ready
              </span>
            )}
            {!formationOpen && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>
          <ProgressDots size={size} maxSize={maxSize} />
        </div>
      </div>

      {finalized && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex items-start gap-3">
          <BadgeCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Team finalized</p>
            <p className="text-[12.5px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
              Your team is locked in. You can still make changes until team formation closes — just hit{' '}
              <span className="font-semibold text-[var(--text-primary)]">Edit team</span>.
            </p>
          </div>
        </div>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {team.members.map((m) => {
          const me = m.uniqueId === myId;
          return (
            <li
              key={m.uniqueId}
              className={`rounded-xl border p-3.5 ${
                m.isLeader ? 'border-[var(--accent)]/50 bg-[var(--accent-muted)]/40' : 'border-[var(--border-color)] bg-[var(--bg-main)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <MemberAvatar name={m.name} leader={m.isLeader} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {m.name || 'Unknown user'}
                      {me && <span className="ml-1.5 text-[11px] font-semibold text-[var(--text-secondary)]">(you)</span>}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[11.5px] text-[var(--text-secondary)]">
                      {m.uniqueId}
                      {m.isLeader && (
                        <span className="inline-flex items-center gap-1 font-sans font-bold text-[var(--accent)]">
                          <Crown className="w-3 h-3" /> Leader
                        </span>
                      )}
                    </p>
                    {m.college && <p className="mt-1 text-[12px] text-[var(--text-secondary)] truncate">{m.college}</p>}
                  </div>
                </div>
                {canEdit && !m.isLeader && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConfirm({ kind: 'leader', member: m })}
                      disabled={!!busy}
                      className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-secondary)] disabled:opacity-40 cursor-pointer"
                      title="Make leader"
                      aria-label={`Make ${m.name || m.uniqueId} the leader`}
                    >
                      <Crown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirm({ kind: 'remove', member: m })}
                      disabled={!!busy}
                      className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 disabled:opacity-40 cursor-pointer"
                      title="Remove from team"
                      aria-label={`Remove ${m.name || m.uniqueId}`}
                    >
                      {busy === `remove-${m.uniqueId}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
        {!finalized &&
          Array.from({ length: Math.max(0, maxSize - size) }).map((_, i) => (
            <li
              key={`empty-${i}`}
              className="rounded-xl border border-dashed border-[var(--border-color)] p-3.5 flex items-center justify-center text-[12px] text-[var(--text-secondary)] min-h-[72px]"
            >
              Open slot
            </li>
          ))}
      </ul>

      <CopyField
        label="Team ID"
        value={team._id}
        hint="Everyone on the team can copy this. Share it with the organisers if they ask for it."
        highlight
      />

      {canAdd && (
        <div className="space-y-2">
          <label htmlFor="team-member-search" className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Add a teammate
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              id="team-member-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowResults(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTyped();
                }
              }}
              placeholder="Search by name or ID (e.g. C50H0021)"
              className={`${inputClass} pl-9`}
              autoComplete="off"
            />
          </div>
          <p className="text-[11.5px] text-[var(--text-secondary)]">
            Only students who have paid and registered for the hackathon, and are not in another team, can be added.
          </p>
          {showResults && (
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] divide-y divide-[var(--border-color)] max-h-64 overflow-y-auto">
              {searching && results.length === 0 ? (
                <div className="flex items-center gap-2 p-3 text-[12.5px] text-[var(--text-secondary)]">
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching…
                </div>
              ) : results.length === 0 ? (
                <div className="p-3 text-[12.5px] text-[var(--text-secondary)]">
                  No one available matches “{search.trim() || '…'}”. Check that your teammate has paid and registered.
                </div>
              ) : (
                results.map((u) => (
                  <div key={u.uniqueId} className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{u.name || u.uniqueId}</p>
                      <p className="font-mono text-[11.5px] text-[var(--text-secondary)] truncate">
                        {u.uniqueId}
                        {u.college ? ` · ${u.college}` : ''}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addMember(u)}
                      isLoading={busy === `add-${u.uniqueId}`}
                      disabled={!!busy}
                      leftIcon={<UserPlus className="w-4 h-4" />}
                      className="shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {canEdit && full && (
        <p className="text-[12.5px] text-[var(--text-secondary)]">Your team is full. Remove a member to add someone else.</p>
      )}

      {!formationOpen && (
        <p className="text-[12.5px] text-[var(--text-secondary)]">
          Team formation is closed, so this team can no longer be changed. You can still view your team details above.
        </p>
      )}

      {formationOpen && isLeader && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-color)] pt-4">
          {finalized ? (
            <>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Finalized. You can reopen and change your team anytime before team formation closes.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={reopen}
                disabled={!!busy}
                leftIcon={<Pencil className="w-4 h-4" />}
                className="shrink-0"
              >
                Edit team
              </Button>
            </>
          ) : (
            <>
              <p className="text-[12px] text-[var(--text-secondary)]">
                {ready
                  ? 'Happy with your team? Mark it as done. You can still edit it later.'
                  : `Add ${short} more member${short === 1 ? '' : 's'} to finish your team.`}
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirm({ kind: 'delete' })}
                  isLoading={busy === 'delete'}
                  disabled={!!busy}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  className="text-red-600 hover:bg-red-500/10"
                >
                  Delete
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={markDone}
                  disabled={!ready || !!busy}
                  leftIcon={<BadgeCheck className="w-4 h-4" />}
                >
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {formationOpen && !isLeader && (
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-color)] pt-4">
          <p className="text-[12px] text-[var(--text-secondary)]">
            Only the team leader can change the team. If you need to leave, ask your leader to remove you.
          </p>
        </div>
      )}

    </Card>
      <Modal isOpen={!!confirm} onClose={() => setConfirm(null)} title={confirmTitle(confirm)} maxWidth="sm">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{confirmText(confirm)}</p>
        <div className="mt-5 flex justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button variant={confirm?.kind === 'leader' ? 'primary' : 'danger'} size="sm" onClick={confirmAction}>
            {confirmTitle(confirm)}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export const HackathonTeamCard: React.FC<HackathonTeamCardProps> = (props) => (
  <section className="space-y-3.5">
    <div className="flex items-center gap-3">
      <span className="h-9 w-1.5 rounded-full bg-[var(--accent)] shrink-0" />
      <div className="min-w-0">
        <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] leading-tight">Form Your Team</h2>
        <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
          Team up with 3 to 4 members for the hackathon — create your own team or join your leader&apos;s.
        </p>
      </div>
    </div>
    <TeamCardBody {...props} />
  </section>
);

const axiosStatus = (err: unknown): number | undefined =>
  (err as { response?: { status?: number } })?.response?.status;

const nameOf = (m: { uniqueId: string; name?: string }) => (m.name ? `${m.name} (${m.uniqueId})` : m.uniqueId);

const confirmTitle = (c: Confirm | null): string => {
  if (!c) return '';
  if (c.kind === 'remove') return 'Remove member';
  if (c.kind === 'leader') return 'Make leader';
  if (c.kind === 'leave') return 'Leave team';
  return 'Delete team';
};

const confirmText = (c: Confirm | null): string => {
  if (!c) return '';
  if (c.kind === 'remove') return `Remove ${nameOf(c.member)} from your team? They can then join another team.`;
  if (c.kind === 'leader')
    return `Make ${nameOf(c.member)} the team leader? You will stay in the team, but only they will be able to add or remove members.`;
  if (c.kind === 'leave') return 'Leave this team? You can join or create another team while team formation is open.';
  return 'Delete this team? Everyone in it will be free to join or create another team. This cannot be undone.';
};

export default HackathonTeamCard;