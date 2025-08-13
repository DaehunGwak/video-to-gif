import React from 'react';

interface LogsSectionProps {
  logs: string[];
}

export const LogsSection: React.FC<LogsSectionProps> = ({ logs }) => {
  if (logs.length === 0) return null;

  return (
    <details className="logs-section">
      <summary>변환 로그 보기</summary>
      <div className="logs">
        {logs.slice(-10).map((log, index) => (
          <div key={index} className="log-line">{log}</div>
        ))}
      </div>
    </details>
  );
};
