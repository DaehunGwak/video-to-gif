import { useState } from 'react';
import { ConversionResult, FileProgress } from '../types';

export const useFileHandler = () => {
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [gifResults, setGifResults] = useState<ConversionResult[]>([]);
  const [fileProgresses, setFileProgresses] = useState<FileProgress[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

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
  };

  const updateProgress = (index: number, progress: number) => {
    setFileProgresses(prev => {
      const newProgresses = [...prev];
      if (newProgresses[index]) {
        newProgresses[index].progress = progress;
      }
      return newProgresses;
    });
  };

  const updateStatus = (index: number, status: FileProgress['status']) => {
    setFileProgresses(prev => {
      const newProgresses = [...prev];
      if (newProgresses[index]) {
        newProgresses[index].status = status;
      }
      return newProgresses;
    });
  };

  const downloadGif = (result: ConversionResult) => {
    try {
      const a = document.createElement('a');
      a.href = result.gifUrl;
      a.download = `${result.fileName.split('.')[0]}.gif`;
      a.style.display = 'none';
      
      // DOM에 추가한 후 클릭
      document.body.appendChild(a);
      a.click();
      
      // 클릭 후 엘리먼트 제거
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      // 브라우저가 a.download를 지원하지 않는 경우 새 탭에서 열기
      window.open(result.gifUrl, '_blank');
    }
  };

  const downloadAllGifs = async () => {
    // 모든 GIF를 순차적으로 다운로드
    for (const result of gifResults) {
      downloadGif(result);
      // 브라우저가 다운로드를 처리할 시간을 주기 위한 지연
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  return {
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
  };
};
