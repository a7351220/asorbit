import React, { useState } from 'react';
import Image from 'next/image';

interface NFTGroupLogoProps {
  group: string;
}

const NFTGroupLogo: React.FC<NFTGroupLogoProps> = ({ group }) => {
  const [fileExtension, setFileExtension] = useState<'png' | 'jpg'>('png');

  // 构建图片 URL
  const logoUrl = `/group-logos/${group.toLowerCase()}.${fileExtension}`;

  return (
    <Image 
      src={logoUrl} 
      alt={`${group.toLowerCase()}.${fileExtension}`}
      width={20} 
      height={20}
      onError={(e) => {
        if (fileExtension === 'png') {
          setFileExtension('jpg');
        } else {
          e.currentTarget.src = "/api/placeholder/20/20";
        }
      }}
    />
  );
};

export default NFTGroupLogo;