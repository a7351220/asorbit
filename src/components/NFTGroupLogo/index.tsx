import React, { useState } from 'react';
import Image from 'next/image';

interface NFTGroupLogoProps {
  group: string;
  className?: string;
}

const NFTGroupLogo: React.FC<NFTGroupLogoProps> = ({ group, className }) => {
  const [fileExtension, setFileExtension] = useState<'png' | 'jpg'>('png');

  // 构建图片 URL
  const logoUrl = `/group-logos/${group.toLowerCase()}.${fileExtension}`;

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-full ${className || ''}`}>
      <Image 
        src={logoUrl} 
        alt={`${group} logo`}
        layout="fill"
        objectFit="cover"
        onError={(e) => {
          if (fileExtension === 'png') {
            setFileExtension('jpg');
          } else {
            // 将错误图片的 src 设置为占位图
            (e.target as HTMLImageElement).src = "/api/placeholder/20/20";
          }
        }}
      />
    </div>
  );
};

export default NFTGroupLogo;