export interface Idea {
  id: string;
  paragraphId: number;
  quote: string; // The specific text selected/quoted
  note: string; // The user's thought
  timestamp: string;
}

export interface Underline {
  id: string;
  paragraphId: number;
  text: string;
  startOffset: number;
  endOffset: number;
}

export interface Paragraph {
  id: number;
  text: string;
}

export interface BlogPost {
  id?: string;
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

// Post types for gallery/list view
export interface Post {
  id: string;
  title: string;
  description: string; // Short excerpt or summary
  fullText?: string;
  imageUrl: string;
  publishedDate: string;
  tags?: string[];
}

export enum ViewState {
  GRID = 'GRID',
  LIST = 'LIST'
}

export interface CreatePostData {
  title: string;
  description: string;
  imageUrl: string;
}