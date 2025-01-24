import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface InterludeProps {
  visible: boolean;
  onComplete: () => void;
  content: any;
}

export default function Interlude({ visible, onComplete, content }: InterludeProps) {

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (visible) {
      const startTime = Date.now();
      const duration = 3000; // 3 seconds

      const updateProgress = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        
        setProgress(newProgress);

        if (elapsed < duration) {
          requestAnimationFrame(updateProgress);
        } else {
          onComplete();
        }
      };

      requestAnimationFrame(updateProgress);

      // Lock scroll when component mounts
      document.body.style.overflow = 'hidden';
      
      // Cleanup: restore scroll when component unmounts
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [visible]);

  if (!content) return null;

  return(
    <div className={`interlude ${visible ? "" : "hide"}`}>
      <div className="h-full">
        <div className="relative h-full">
          <Image 
            src={content.image} 
            alt={content.credits} 
            width={1200} 
            height={800} 
            // className="w-full h-auto" 
          />
          <div className="absolute bottom-0 left-0 p-2 min-h-24 w-full flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent">
            <p className="serif text-xs">{content.description}</p>
            <p className="uppercase text-xs futura">{content.credits}</p>
          </div>
        </div>
        <div className="w-full h-[2px] relative">
          <div 
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}