import React, { useState, useEffect } from 'react';

interface InterludeProps {
  onComplete: () => void;
}

export default function Interlude({ onComplete }: InterludeProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000; // 5 seconds

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
  }, [onComplete]);

  return(
    <div className="interlude">
      <div>
        <div className="relative">
          <img src="/example.png" alt="Example" />
          <div className="absolute bottom-0 left-0 p-2 min-h-24 w-full flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent">
            <p className="font-serif text-sm">Caption</p>
            <p className="uppercase text-sm">Subtitle</p>
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