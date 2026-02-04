import React from 'react';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={`animate-pulse rounded-md bg-sidebar/80 ${className}`} {...props} />;
};
