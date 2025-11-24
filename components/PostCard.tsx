import React from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="flex flex-col gap-3 pb-3 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group cursor-pointer">
      <div 
        className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover group-hover:scale-105 transition-transform duration-500" 
        style={{ backgroundImage: `url("${post.imageUrl}")` }}
        role="img"
        aria-label={`Cover for ${post.title}`}
      />
      <div className="px-4 pb-4 flex flex-col flex-1">
        <p className="text-base font-bold leading-normal text-text-light-primary dark:text-text-dark-primary line-clamp-1">
          {post.title}
        </p>
        <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-text-dark-secondary mt-1 flex-1 line-clamp-3">
          {post.description}
        </p>
        <p className="text-xs font-medium leading-normal text-text-light-secondary dark:text-text-dark-secondary mt-3 opacity-70">
          Published on {post.publishedDate}
        </p>
      </div>
    </div>
  );
};