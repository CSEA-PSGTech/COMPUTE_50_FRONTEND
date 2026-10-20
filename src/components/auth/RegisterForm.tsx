import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Copy, LogIn, Plus, Users } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { teamService } from '../../services/team.service';
import { HackathonTeam } from '../../types/user';
import { User } from '../../types/auth';

type TeamAction = 'create' | 'join' | null;

export const RegisterForm: React.FC = () => {
  const { user, updateUser } = useAuth();
  return <TeamRegistrationFlow key={user?.email.toLowerCase() ?? 'signed-out'} user={user} updateUser={updateUser} />;
};

const TeamRegistrationFlow: React.FC<{ user: User | null; updateUser: (user: User) => void }> = ({ user, updateUser }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [action, setAction] = useState<TeamAction>(null);
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [team, setTeam] = useState<HackathonTeam>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    if (!user) {
      return;
    }

    teamService.getTeamForUser(user).then((existingTeam) => {
      if (active) setTeam(existingTeam);
    }).catch(() => {
      if (active) setError('Unable to load your team right now. Please refresh and try again.');
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => { active = false; };
  }, [user]);

  const acceptTeam = (updatedTeam: HackathonTeam) => {
    setTeam(updatedTeam);
    if (user) updateUser({ ...user, teamId: updatedTeam.id, role: updatedTeam.leaderId === user.id ? 'leader' : 'user' });
    setAction(null);
    setError('');
    addToast(updatedTeam.leaderId === user?.id ? 'Team created. Share the team ID with your members.' : 'You joined the team successfully.', 'success');
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError('');
    try {
      acceptTeam(await teamService.createTeam(teamName, user));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create your team. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError('');
    try {
      acceptTeam(await teamService.joinTeam(teamCode, user));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to join the team. Please check the ID and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = async () => {
    if (!team) return;
    try {
      await navigator.clipboard.writeText(team.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      addToast('Team ID copied.', 'success');
    } catch {
      setError('Copy failed. Select and copy the team ID manually.');
    }
  };

  if (loading && user) {
    return <div className="py-16 text-center text-sm text-[var(--text-secondary)]">Checking your team…</div>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="text-center space-y-2">
        <p className="font-mono text-xs font-bold tracking-[0.2em] text-[var(--accent)]">COMPUTE 50 HACKATHON</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          {team ? 'Your Team' : 'Build Your Team'}
        </h1>
        <p className="mx-auto max-w-xl text-sm text-[var(--text-secondary)]">
          {team ? 'Your team is ready. Share its ID so your teammates can join.' : 'Create a new team and invite members, or join an existing team with its ID.'}
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {team ? (
        <Card className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-[var(--border-color)] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Team name</p>
              <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{team.name}</h2>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Team ID</p>
                <p className="font-mono font-bold tracking-wider text-[var(--accent)]">{team.code}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-muted)] hover:text-[var(--accent)]"
                aria-label="Copy team ID"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--text-primary)]">Team members</h3>
              <span className="text-xs text-[var(--text-secondary)]">{team.members.length} / {team.maxMembers}</span>
            </div>
            <ul className="divide-y divide-[var(--border-color)] rounded-xl border border-[var(--border-color)]">
              {team.members.map((member) => (
                <li key={member.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{member.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{member.email}</p>
                  </div>
                  <span className="rounded-full bg-[var(--accent-muted)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">Teams can have up to 4 members. Each teammate signs in and joins with this ID.</p>
          <Button variant="outline" fullWidth onClick={() => navigate('/profile')}>View Profile</Button>
        </Card>
      ) : (
        <>
          {!action ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => { setAction('create'); setError(''); }}
                className="group rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 text-left transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] focus-visible:outline-none"
              >
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-text)]">
                  <Plus className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Create a Team</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">Start a team, choose its name, and get a unique ID to share with your teammates.</p>
              </button>
              <button
                type="button"
                onClick={() => { setAction('join'); setError(''); }}
                className="group rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 text-left transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] focus-visible:outline-none"
              >
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-text)]">
                  <Users className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Join a Team</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">Have a team ID? Enter it to join your teammates’ team.</p>
              </button>
            </div>
          ) : (
            <Card className="mx-auto max-w-xl space-y-5">
              <button
                type="button"
                onClick={() => { setAction(null); setError(''); }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to options
              </button>
              {action === 'create' ? (
                <form onSubmit={handleCreate} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Create a Team</h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">You’ll be the team leader. You can invite up to 3 teammates.</p>
                  </div>
                  <Input
                    label="Team name"
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    placeholder="Enter a team name"
                    maxLength={40}
                    required
                    autoComplete="organization"
                  />
                  <Button type="submit" fullWidth isLoading={submitting} leftIcon={<Plus className="h-4 w-4" />}>
                    Create Team
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleJoin} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Join a Team</h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Ask your team leader for the unique team ID.</p>
                  </div>
                  <Input
                    label="Team ID"
                    value={teamCode}
                    onChange={(event) => setTeamCode(event.target.value.toUpperCase())}
                    placeholder="C50-ABC234"
                    maxLength={10}
                    autoCapitalize="characters"
                    autoComplete="off"
                    required
                  />
                  <Button type="submit" fullWidth isLoading={submitting} leftIcon={<LogIn className="h-4 w-4" />}>
                    Join Team
                  </Button>
                </form>
              )}
            </Card>
          )}
        </>
      )}

      <p className="border-t border-[var(--border-color)] pt-5 text-center text-xs text-[var(--text-secondary)]">
        Need to update your details? <Link to="/profile" className="font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline">View Profile</Link>
      </p>
    </div>
  );
};
