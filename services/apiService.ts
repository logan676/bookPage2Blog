import { Idea } from '../types';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';

interface CreateIdeaRequest {
  post_id: string;
  paragraphId: number;
  quote: string;
  note: string;
}

interface IdeaResponse {
  id: string;
  post: string;
  paragraph: number;
  quote: string;
  note: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all ideas for a specific post
 */
export const fetchIdeas = async (postId: string): Promise<Idea[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ideas/?post=${postId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ideas: ${response.statusText}`);
    }

    const data: IdeaResponse[] = await response.json();

    // Transform backend format to frontend format
    return data.map(item => ({
      id: item.id,
      paragraphId: item.paragraph,
      quote: item.quote,
      note: item.note,
      timestamp: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return []; // Return empty array on error
  }
};

/**
 * Create a new idea
 */
export const createIdea = async (postId: string, paragraphId: number, quote: string, note: string): Promise<Idea | null> => {
  try {
    const requestBody: CreateIdeaRequest = {
      post_id: postId,
      paragraphId,
      quote,
      note
    };

    const response = await fetch(`${API_BASE_URL}/api/ideas/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Failed to create idea: ${response.statusText}`);
    }

    const data: IdeaResponse = await response.json();

    // Transform backend format to frontend format
    return {
      id: data.id,
      paragraphId: data.paragraph,
      quote: data.quote,
      note: data.note,
      timestamp: data.created_at
    };
  } catch (error) {
    console.error('Error creating idea:', error);
    return null;
  }
};

/**
 * Update an existing idea
 */
export const updateIdea = async (ideaId: string, quote: string, note: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ideas/${ideaId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quote, note })
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating idea:', error);
    return false;
  }
};

/**
 * Delete an idea
 */
export const deleteIdea = async (ideaId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ideas/${ideaId}/`, {
      method: 'DELETE'
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting idea:', error);
    return false;
  }
};
