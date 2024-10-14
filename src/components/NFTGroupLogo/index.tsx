import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface NFTGroupLogoProps {
  group: string;
  className?: string;
}

const NFTGroupLogo: React.FC<NFTGroupLogoProps> = ({ group, className }) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      const extensions = ['png', 'jpg'];
      let loadedSrc = '';

      for (const ext of extensions) {
        try {
          const url = `/group-logos/${group.toLowerCase()}.${ext}`;
          const res = await fetch(url);
          if (res.ok) {
            loadedSrc = url;
            break;
          }
        } catch (error) {
          console.error(`Failed to load image for ${group} with extension ${ext}:`, error);
        }
      }

      if (!loadedSrc) {
        loadedSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='; // 1x1 透明像素
      }

      setImageSrc(loadedSrc);
      setIsLoading(false);
    };

    loadImage();
  }, [group]);

  if (isLoading) {
    return <div className={`bg-gray-200 rounded-full ${className || ''}`} />;
  }

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-full ${className || ''}`}>
      <Image
        src={imageSrc}
        alt={`${group} logo`}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

export default NFTGroupLogo;