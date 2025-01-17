import { useEffect, useState } from "react";

export default function Loader() {

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (current < 14) {
        setCurrent(current + 1);
      } else {
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className={`loader transition-opacity duration-300 ${current >= 10 ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'}`}>
      <div className="w-full h-full relative">
        {Array.from({ length: 14 }).map((_, index) => (
          <div 
            key={index} 
            className={`absolute w-full h-full top-0 left-0 flex items-center justify-center ${current === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={`/img/0${index + 10}.png`} alt={`Loader ${index + 10}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}