import React from 'react';

export const Separator: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({ className, ...props }) => {
  return <hr className={`border-card-border ${className}`} {...props} />;
};