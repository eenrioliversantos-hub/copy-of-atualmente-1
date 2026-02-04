import React from 'react';
import Avatar from '../shared/Avatar';

interface AvatarGroupProps {
  avatars: { name: string; avatar: string }[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars }) => {
  const maxVisible = 3;
  const visibleAvatars = avatars.slice(0, maxVisible);
  const hiddenCount = avatars.length - maxVisible;

  return (
    <div className="flex -space-x-2">
      {visibleAvatars.map((user, index) => (
        <div key={index} className="ring-2 ring-background rounded-full">
          <Avatar src={user.avatar} alt={user.name} fallback={user.name.charAt(0)} size="sm" />
        </div>
      ))}
      {hiddenCount > 0 && (
        <div className="ring-2 ring-background rounded-full h-6 w-6 text-xs bg-sidebar flex items-center justify-center font-bold text-text-secondary">
          +{hiddenCount}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
