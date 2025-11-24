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