import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Code2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event';
import { CountUp } from './CountUp';

export const AboutCsea: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cseaStats = [
    { value: '24', label: 'Projects Launched' },
    { value: '18', label: 'Workshops Conducted' },
    { value: '300+', label: 'Active Members' },
    { value: '12', label: 'Signature Events' },
  ];

  const cseaParagraphs = [
    'The Computer Science and Engineering Association (CSEA) of PSG College of Technology is a student-driven professional body that aims to enhance the technical knowledge, leadership qualities, and overall development of Computer Science and Engineering students.',

    'CSEA serves as a platform for students to explore emerging technologies, share knowledge, and develop skills beyond the classroom curriculum. The association organizes various technical events such as workshops, coding competitions, hackathons, seminars, guest lectures, and industrial interactions.',

    'In addition to technical activities, CSEA also focuses on soft skill development, teamwork, and leadership through cultural events, quizzes, and outreach programs.',

    'By encouraging innovation, collaboration, and continuous learning, CSEA bridges the gap between academic learning and real-world applications, helping students prepare for careers in industry, research, and entrepreneurship.',
  ];

  return (
    <Card className="h-full flex flex-col justify-between space-y-6">
      <div className="space-y-5">
        {/* Header - Aligned one line header with small subtitle */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3 min-h-[44px]">
          <div className="flex items-center gap-2.5 text-[var(--accent)]">
            <Code2 className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight">
                About CSEA
              </h3>
              <span className="text-[11px] font-mono text-[var(--text-secondary)] font-semibold block">
                Computer Science and Engineering Association
              </span>
            </div>
          </div>
          <a
            href={EVENT_CONFIG.organizerWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-secondary)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[12px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] rounded-lg transition-colors shrink-0"
          >
            <span>Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Stats moved to top of card as large numerals with count-up once */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {cseaStats.map((stat, idx) => (
            <div
              key={idx}
              className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-center shadow-xs"
            >
              <CountUp
                value={stat.value}
                className="block text-2xl font-black text-[var(--accent)] font-mono leading-none"
              />
              <span className="block text-[11px] text-[var(--text-secondary)] font-mono font-medium mt-1 leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Collapsible Paragraphs */}
        <div className="space-y-4 text-[14px] sm:text-[15px] text-[var(--text-secondary)] leading-[1.7]">
          <p>{cseaParagraphs[0]}</p>
          <p>{cseaParagraphs[1]}</p>

          {isExpanded && (
            <div className="space-y-4 animate-fadeIn">
              <p>{cseaParagraphs[2]}</p>
              <p>{cseaParagraphs[3]}</p>
            </div>
          )}
        </div>
      </div>

      {/* Read More Toggle */}
      <div className="pt-4 border-t border-[var(--border-color)] mt-auto">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent)] hover:underline focus:outline-none cursor-pointer"
        >
          <span>{isExpanded ? 'Show less' : 'Read more'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </Card>
  );
};
