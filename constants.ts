import { BlogPost, Idea } from './types';

export const CURRENT_USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuAUk9vXu3yQ9KXSM9BnaOW8ALUREHr7FHnEl8LGrwSz6JkxNQgdG8lJ_OOyVolwBWzhgfFLjMwYvpWORoBmPjbWwV1MSQSRfQvSD_6nSwQhLnW013eMEOV2IrErRm4791VGBoKVEfUt8QgO_lkeGV220shHHQTGQCQTme5LnpnmntCG29n7Z-ZuGmqzpyRbNRuH7NcOXegfM9S9NvhfaD0I8QSxpetJG_5gms5ClGaQaiekZYenk3qqX_7FiCUGHNxQc-5q2N-s83s";

export const MOCK_POST: BlogPost = {
  title: "Chapter One: The Journey Begins",
  author: "Jane Doe",
  publishDate: "August 15, 2024",
  imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6pw4abjr5gkUxf5k3XBobnxxxfoC74DnVL4DfXWGfVw20UJ4lZaRxUZK7k988L4FUSZcrgvtMh2rcXulYsUTsHEhftpgFTuZ5JVrRstdVf5YCgqNtjO_2L5Lr-ochnTliGSzFm6rtIqcpYtZelbQ9YI9CYq7OQ8bbXEmpl8pMyCP3HUvNM_m3zUHdG0BOptcVAHhCL47Fgoc0ssmZfBbMjIBjWEsyimTJRShZ9AlzP7SUublTfX4cWxhTnWmApghFsgacnwZrWeI",
  content: [
    {
      id: 1,
      text: "The sun had barely kissed the horizon, casting long, ethereal shadows across the cobblestone streets. It was in this quiet moment, before the city awoke to its usual cacophony, that our story finds its feet. The air was crisp, carrying the scent of morning dew and distant bakeries. For our protagonist, this was not just another day; it was the dawn of an adventure that had been whispered about in hushed tones for generations."
    },
    {
      id: 2,
      text: "In the heart of the old library, amidst towering shelves that smelled of aging paper and forgotten tales, a single book lay open. Its pages were filled with cryptic symbols and elegant prose, detailing a quest for a relic of immense power. It was said that this relic could rewrite the stars themselves, a concept both terrifying and tantalizing. This was the catalyst, the spark that would ignite a journey into the unknown. The text was clear: \"He who seeks the Azure Star must first understand that the path is not on any map, but written in the heart of the courageous.\""
    },
    {
      id: 3,
      text: "Every journey requires a first step, and this was no different. Packing a simple leather satchel with a few provisions, a water skin, and the timeworn map that was more riddle than guide, the protagonist stepped out into the nascent light. The world was vast and full of uncertainty, but the call to adventure was a siren song that could not be ignored. This was the beginning of everything."
    }
  ]
};

export const INITIAL_IDEAS: Idea[] = [
  {
    id: "idea-1",
    paragraphId: 2,
    quote: "rewrite the stars themselves",
    note: "A powerful metaphor for changing one's destiny or reality.",
    timestamp: "2024-08-16T10:00:00Z"
  },
  {
    id: "idea-2",
    paragraphId: 2,
    quote: "the path is not on any map, but written in the heart of the courageous.",
    note: "Suggests an internal journey of self-discovery, not just a physical one.",
    timestamp: "2024-08-16T10:15:00Z"
  },
  {
    id: "idea-3",
    paragraphId: 3,
    quote: "a siren song that could not be ignored",
    note: "This phrase perfectly captures the irresistible pull of adventure.",
    timestamp: "2024-08-16T11:00:00Z"
  }
];