import React, { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import './App.css';

interface ConversionResult {
  fileName: string;
  gifUrl: string;
  originalSize: number;
  gifSize?: number;
}

interface FileProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'converting' | 'completed' | 'failed';
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [gifResults, setGifResults] = useState<ConversionResult[]>([]);
  const [converting, setConverting] = useState(false);
  const [fileProgresses, setFileProgresses] = useState<FileProgress[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const ffmpegRef = useRef(new FFmpeg());

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    
    ffmpeg.on('log', ({ message }) => {
      setLogs(prev => [...prev, message]);
    });

    // Load ffmpeg
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setLoaded(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const videoFileList: File[] = [];
    const progressList: FileProgress[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('video/')) {
        videoFileList.push(file);
        progressList.push({
          fileName: file.name,
          progress: 0,
          status: 'pending'
        });
      }
    }

    setVideoFiles(videoFileList);
    setFileProgresses(progressList);
    setGifResults([]);
    setCurrentFileIndex(0);
    setLogs([]);
  };

  const convertToGif = async () => {
    if (videoFiles.length === 0) return;

    setConverting(true);
    setLogs([]);

    const ffmpeg = ffmpegRef.current;
    const results: ConversionResult[] = [];

    // Progress 이벤트 핸들러 설정
    ffmpeg.on('progress', ({ progress }) => {
      setFileProgresses(prev => {
        const newProgresses = [...prev];
        if (newProgresses[currentFileIndex]) {
          newProgresses[currentFileIndex].progress = Math.round(progress * 100);
        }
        return newProgresses;
      });
    });

    for (let index = 0; index < videoFiles.length; index++) {
      const videoFile = videoFiles[index];
      setCurrentFileIndex(index);

      // 현재 파일 상태를 'converting'으로 업데이트
      setFileProgresses(prev => {
        const newProgresses = [...prev];
        newProgresses[index].status = 'converting';
        return newProgresses;
      });

      try {
        // Write the file to the virtual file system
        await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

        // Convert to GIF with optimized settings
        await ffmpeg.exec([
          '-i', 'input.mp4',
          '-vf', 'fps=10,scale=480:-1:flags=lanczos,palettegen=max_colors=256',
          '-y', 'palette.png'
        ]);

        await ffmpeg.exec([
          '-i', 'input.mp4',
          '-i', 'palette.png',
          '-filter_complex', '[0:v]fps=10,scale=480:-1:flags=lanczos[v];[v][1:v]paletteuse=dither=bayer:bayer_scale=5',
          '-y', 'output.gif'
        ]);

        // Read the result
        const data = await ffmpeg.readFile('output.gif');
        const blob = new Blob([data], { type: 'image/gif' });
        const url = URL.createObjectURL(blob);
        
        results.push({
          fileName: videoFile.name,
          gifUrl: url,
          originalSize: videoFile.size,
          gifSize: data.length
        });

        // 현재 파일 상태를 'completed'로 업데이트
        setFileProgresses(prev => {
          const newProgresses = [...prev];
          newProgresses[index].status = 'completed';
          newProgresses[index].progress = 100;
          return newProgresses;
        });

        // Clean up
        await ffmpeg.deleteFile('input.mp4');
        await ffmpeg.deleteFile('palette.png');
        await ffmpeg.deleteFile('output.gif');
      } catch (error) {
        console.error(`Conversion failed for ${videoFile.name}:`, error);
        
        // 현재 파일 상태를 'failed'로 업데이트
        setFileProgresses(prev => {
          const newProgresses = [...prev];
          newProgresses[index].status = 'failed';
          return newProgresses;
        });
      }
    }

    setGifResults(results);
    setConverting(false);
  };

  const downloadGif = (result: ConversionResult) => {
    const a = document.createElement('a');
    a.href = result.gifUrl;
    a.download = `${result.fileName.split('.')[0]}.gif`;
    a.click();
  };

  const downloadAllGifs = async () => {
    // 모든 GIF를 순차적으로 다운로드
    for (const result of gifResults) {
      downloadGif(result);
      // 브라우저가 다운로드를 처리할 시간을 주기 위한 지연
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎬 Video to GIF Converter</h1>
        <p>브라우저에서 직접 MP4 비디오를 GIF로 변환하세요!</p>
        
        {!loaded && (
          <div className="load-section">
            <button onClick={load} className="load-button">
              변환기 로드하기
            </button>
            <p>처음 로드시 약간의 시간이 걸릴 수 있습니다.</p>
          </div>
        )}

        {loaded && (
          <div className="converter-section">
            <div className="file-input-container">
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleFileChange}
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

            <button
              onClick={convertToGif}
              disabled={videoFiles.length === 0 || converting}
              className="convert-button"
            >
              {converting ? '🔄 변환 중...' : '🎯 GIF로 변환'}
            </button>

            {converting && fileProgresses[currentFileIndex] && (
              <div className="progress-section">
                <p>현재 변환 중: {fileProgresses[currentFileIndex].fileName}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${fileProgresses[currentFileIndex].progress}%` }}
                  ></div>
                </div>
                <p>진행률: {fileProgresses[currentFileIndex].progress}%</p>
              </div>
            )}

            {gifResults.length > 0 && (
              <div className="result-section">
                <h3>✅ 변환 완료! ({gifResults.length}개)</h3>
                {gifResults.length > 1 && (
                  <button onClick={downloadAllGifs} className="download-button download-all">
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
                      <button onClick={() => downloadGif(result)} className="download-button">
                        ⬇️ 다운로드
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {logs.length > 0 && (
              <details className="logs-section">
                <summary>변환 로그 보기</summary>
                <div className="logs">
                  {logs.slice(-10).map((log, index) => (
                    <div key={index} className="log-line">{log}</div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
