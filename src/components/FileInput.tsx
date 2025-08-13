import React from 'react';
import { FileProgress } from '../types';

interface FileInputProps {
  videoFiles: File[];
  fileProgresses: FileProgress[];
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ 
  videoFiles, 
  fileProgresses, 
  onFileChange 
}) => {
  return (
    <>
      <div className="file-input-container">
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={onFileChange}
          id="video-input"
          className="file-input"
        />
        <label htmlFor="video-input" className="file-input-label">
          📁 비디오 파일 선택 (여러 개 가능)
        </label>
      </div>

      {videoFiles.length > 0 && (
        <div className="file-info">
          <p>선택된 파일: <strong>{videoFiles.length}개</strong></p>
          <div className="file-list">
            {fileProgresses.map((fileProgress, index) => (
              <div key={index} className="file-item">
                <span className="file-name">{fileProgress.fileName}</span>
                <span className="file-size">
                  ({(videoFiles[index].size / 1024 / 1024).toFixed(2)} MB)
                </span>
                {fileProgress.status === 'converting' && (
                  <span className="file-status"> - 변환 중... {fileProgress.progress}%</span>
                )}
                {fileProgress.status === 'completed' && (
                  <span className="file-status" style={{ color: '#4caf50' }}> ✓ 완료</span>
                )}
                {fileProgress.status === 'failed' && (
                  <span className="file-status" style={{ color: '#f44336' }}> ✗ 실패</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
