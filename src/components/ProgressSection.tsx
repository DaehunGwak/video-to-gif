import React from 'react';
import { FileProgress } from '../types';

interface ProgressSectionProps {
  converting: boolean;
  currentFileProgress?: FileProgress;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({ 
  converting, 
  currentFileProgress 
}) => {
  if (!converting || !currentFileProgress) return null;

  return (
    <div className="progress-section">
      <p>현재 변환 중: {currentFileProgress.fileName}</p>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${currentFileProgress.progress}%` }}
        ></div>
      </div>
      <p>진행률: {currentFileProgress.progress}%</p>
    </div>
  );
};
