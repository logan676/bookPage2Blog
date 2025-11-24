export interface Idea {
  id: string;
  paragraphId: number;
  quote: string; // The specific text selected/quoted
  note: string; // The user's thought
  timestamp: string;
}

export interface Paragraph {
  id: number;
  text: string;
}

export interface BlogPost {
  title: string;
  author: string;
  publishDate: string;
  imageUrl: string;
  content: Paragraph[];
}

// New types for file upload and processing
export interface ExtractedContent {
  text: string;
}

export interface UploadedFile {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}