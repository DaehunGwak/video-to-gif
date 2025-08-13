export interface ConversionResult {
  fileName: string;
  gifUrl: string;
  originalSize: number;
  gifSize?: number;
}

export interface FileProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'converting' | 'completed' | 'failed';
}
