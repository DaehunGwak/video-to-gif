import React from 'react';

interface LoadSectionProps {
  onLoad: () => Promise<void>;
}

export const LoadSection: React.FC<LoadSectionProps> = ({ onLoad }) => {
  return (
    <div className="load-section">
      <button onClick={onLoad} className="load-button">
        변환기 로드하기
      </button>
      <p>처음 로드시 약간의 시간이 걸릴 수 있습니다.</p>
    </div>
  );
};
