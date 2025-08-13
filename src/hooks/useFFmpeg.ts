import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ConversionResult, FileProgress } from '../types';

export const useFFmpeg = () => {
  const [loaded, setLoaded] = useState(false);
  const [converting, setConverting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const ffmpegRef = useRef(new FFmpeg());

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    
    ffmpeg.on('log', ({ message }) => {
      setLogs(prev => [...prev, message]);
    });

    // Load ffmpeg - GitHub Pages에서는 CDN 사용
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setLoaded(true);
  };

  const convertToGif = async (
    videoFiles: File[],
    onProgressUpdate: (index: number, progress: number) => void,
    onStatusUpdate: (index: number, status: FileProgress['status']) => void
  ): Promise<ConversionResult[]> => {
    if (videoFiles.length === 0) return [];

    setConverting(true);
    setLogs([]);

    const ffmpeg = ffmpegRef.current;
    const results: ConversionResult[] = [];

    for (let index = 0; index < videoFiles.length; index++) {
      // Progress 이벤트 핸들러 설정 (각 파일마다 새로 설정)
      ffmpeg.on('progress', ({ progress }) => {
        onProgressUpdate(index, Math.round(progress * 100));
      });
      const videoFile = videoFiles[index];

      // 현재 파일 상태를 'converting'으로 업데이트
      onStatusUpdate(index, 'converting');

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
        onStatusUpdate(index, 'completed');
        onProgressUpdate(index, 100);

        // Clean up
        await ffmpeg.deleteFile('input.mp4');
        await ffmpeg.deleteFile('palette.png');
        await ffmpeg.deleteFile('output.gif');
      } catch (error) {
        console.error(`Conversion failed for ${videoFile.name}:`, error);
        
        // 현재 파일 상태를 'failed'로 업데이트
        onStatusUpdate(index, 'failed');
      }
    }

    setConverting(false);
    return results;
  };

  return {
    loaded,
    converting,
    logs,
    load,
    convertToGif
  };
};
