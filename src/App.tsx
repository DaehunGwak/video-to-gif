import React from 'react';
import { useFFmpeg } from './hooks/useFFmpeg';
import { useFileHandler } from './hooks/useFileHandler';
import { LoadSection, FileInput, ProgressSection, GifResults, LogsSection } from './components';
import './App.css';

function App() {
  const { loaded, converting, logs, load, convertToGif } = useFFmpeg();
  const {
    videoFiles,
    gifResults,
    fileProgresses,
    currentFileIndex,
    setGifResults,
    handleFileChange,
    updateProgress,
    updateStatus,
    downloadGif,
    downloadAllGifs
  } = useFileHandler();

  const handleConvert = async () => {
    if (videoFiles.length === 0) return;

    const results = await convertToGif(
      videoFiles,
      updateProgress,
      updateStatus
    );
    setGifResults(results);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎬 Video to GIF Converter</h1>
        <p>브라우저에서 직접 MP4 비디오를 GIF로 변환하세요!</p>
        
        {!loaded && <LoadSection onLoad={load} />}

        {loaded && (
          <div className="converter-section">
            <FileInput
              videoFiles={videoFiles}
              fileProgresses={fileProgresses}
              onFileChange={handleFileChange}
            />

            <button
              onClick={handleConvert}
              disabled={videoFiles.length === 0 || converting}
              className="convert-button"
            >
              {converting ? '🔄 변환 중...' : '🎯 GIF로 변환'}
            </button>

            <ProgressSection
              converting={converting}
              currentFileProgress={fileProgresses[currentFileIndex]}
            />

            <GifResults
              gifResults={gifResults}
              onDownloadGif={downloadGif}
              onDownloadAll={downloadAllGifs}
            />

            <LogsSection logs={logs} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
