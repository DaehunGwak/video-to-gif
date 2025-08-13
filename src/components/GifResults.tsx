import React from 'react';
import { ConversionResult } from '../types';

interface GifResultsProps {
  gifResults: ConversionResult[];
  onDownloadGif: (result: ConversionResult) => void;
  onDownloadAll: () => Promise<void>;
}

export const GifResults: React.FC<GifResultsProps> = ({ 
  gifResults, 
  onDownloadGif, 
  onDownloadAll 
}) => {
  if (gifResults.length === 0) return null;

  return (
    <div className="result-section">
      <h3>✅ 변환 완료! ({gifResults.length}개)</h3>
      {gifResults.length > 1 && (
        <button onClick={onDownloadAll} className="download-button download-all">
          ⬇️ 모두 다운로드
        </button>
      )}
      <div className="gif-grid">
        {gifResults.map((result, index) => (
          <div key={index} className="gif-item">
            <h4>{result.fileName}</h4>
            <img src={result.gifUrl} alt={`GIF ${index + 1}`} className="result-gif" />
            <div className="gif-info">
              <p>원본: {(result.originalSize / 1024 / 1024).toFixed(2)} MB</p>
              <p>GIF: {((result.gifSize || 0) / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => onDownloadGif(result)} className="download-button">
              ⬇️ 다운로드
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
