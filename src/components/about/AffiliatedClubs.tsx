import React, { useState } from 'react';
import { Card } from '../common/Card';
import { clubs } from '../../data/clubs';
import { Badge } from '../common/Badge';
import { ExternalLink, ChevronDown, ChevronUp, Users, Rocket, Target } from 'lucide-react';

const ClubAvatar: React.FC<{ logo?: string; name: string; abbreviation?: string; accent?: string }> = ({
  logo,
  name,
  abbreviation,
  accent,
}) => {
  const [hasError, setHasError] = useState(false);
  const initials = abbreviation || name;

  if (logo && !hasError) {
    return (
      <div className="w-14 h-14 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
        <img
          src={logo}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
    );
  }

  return (
    <div
      className="w-14 h-14 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center font-mono font-bold p-1 text-[11px] leading-none shrink-0 overflow-hidden text-center shadow-xs"
      style={{ color: accent || 'var(--accent)' }}
    >
      <span className="whitespace-nowrap truncate max-w-full px-0.5">{initials}</span>
    </div>
  );
};

export const AffiliatedClubs: React.FC = () => {
  const [expandedClub, setExpandedClub] = useState<string | null>(null);

  // Group clubs into pairs of 2 for row-level layout
  const rows: (typeof clubs)[] = [];
  for (let i = 0; i < clubs.length; i += 2) {
    rows.push(clubs.slice(i, i + 2));
  }

  return (
    <div className="space-y-6">
      <div className="text-left space-y-1">
        <Badge variant="primary">UNDER CSEA</Badge>
        <h3 className="text-2xl font-bold text-[var(--text-primary)]">Clubs & Bodies under CSEA</h3>
      </div>

      <div className="space-y-6">
        {rows.map((row, rowIndex) => {
          const expandedClubObj = row.find((c) => c.id === expandedClub);

          return (
            <div key={rowIndex} className="space-y-4">
              {/* Cards row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {row.map((club) => {
                  const isExpanded = expandedClub === club.id;

                  return (
                    <Card
                      key={club.id}
                      className={`h-full flex flex-col justify-between gap-4 transition-all duration-300 border-t-2 ${
                        isExpanded ? 'ring-2 ring-[var(--accent)]' : ''
                      }`}
                      style={{ borderTopColor: club.accent || 'var(--accent)' }}
                    >
                      {/* Card Top Content */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
                          <ClubAvatar logo={club.logo} name={club.name} abbreviation={club.abbreviation} accent={club.accent} />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-lg text-[var(--text-primary)] leading-snug">
                              {club.fullName || club.name}
                            </h4>
                            <span className="text-xs font-mono font-semibold text-[var(--text-secondary)]">
                              {club.name}
                            </span>
                          </div>
                        </div>

                        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-medium">
                          {club.summary || club.description}
                        </p>
                      </div>

                      {/* Fixed Footer Row */}
                      <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2 mt-auto">
                        <button
                          onClick={() => setExpandedClub(isExpanded ? null : club.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 rounded px-1.5 py-1 cursor-pointer"
                          aria-expanded={isExpanded}
                        >
                          <span>{isExpanded ? 'Hide details' : 'Learn more'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {club.url ? (
                          <a
                            href={club.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[var(--text-primary)] dark:hover:text-[var(--accent)] bg-[var(--bg-secondary)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] rounded-lg transition-colors shrink-0"
                            aria-label={`Explore ${club.name}`}
                          >
                            <span>Explore</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : null}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Full-width expanded panel under the row */}
              {expandedClubObj && (
                <div className="w-full bg-[var(--bg-secondary)] border border-[var(--accent)]/30 rounded-2xl p-6 space-y-4 animate-fadeIn shadow-lg text-left">
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                    <div className="flex items-center gap-3">
                      <ClubAvatar
                        logo={expandedClubObj.logo}
                        name={expandedClubObj.name}
                        abbreviation={expandedClubObj.abbreviation}
                        accent={expandedClubObj.accent}
                      />
                      <div>
                        <h4 className="font-bold text-lg text-[var(--text-primary)] font-mono">
                          About {expandedClubObj.name}
                        </h4>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {expandedClubObj.fullName || expandedClubObj.name}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedClub(null)}
                      className="px-3 py-1 rounded-lg text-xs font-mono font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                    >
                      Close ✕
                    </button>
                  </div>

                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-medium">
                    {expandedClubObj.description}
                  </p>

                  {/* E-CELL Rich Details */}
                  {expandedClubObj.details && (
                    <div className="space-y-4 pt-2">
                      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed italic bg-[var(--bg-tertiary)] p-3 rounded-xl border border-[var(--border-color)]">
                        "{expandedClubObj.details.intro}"
                      </p>

                      {/* Our Approach */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5 font-mono">
                          <Rocket className="w-3.5 h-3.5" /> Our Approach
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {expandedClubObj.details.approach.map((item, idx) => (
                            <div key={idx} className="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)] space-y-1">
                              <span className="font-bold text-xs text-[var(--text-primary)] block">
                                {item.title}
                              </span>
                              <p className="text-[12px] text-[var(--text-secondary)] leading-normal">
                                {item.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* What E-Cell Works Towards */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5 font-mono">
                          <Target className="w-3.5 h-3.5" /> Works Towards
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                          {expandedClubObj.details.worksTowards.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-[var(--bg-tertiary)] p-2.5 rounded-xl border border-[var(--border-color)] leading-normal">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Who It's For */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5 font-mono">
                          <Users className="w-3.5 h-3.5" /> Who It's For
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {expandedClubObj.details.whoItsFor.map((persona, idx) => (
                            <div key={idx} className="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)] space-y-1">
                              <span className="font-semibold text-xs text-[var(--text-primary)] block">
                                {persona.title}
                              </span>
                              <p className="text-[12px] text-[var(--text-secondary)] leading-normal">
                                {persona.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
