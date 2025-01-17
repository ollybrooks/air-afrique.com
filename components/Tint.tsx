import React from 'react';

export default function Tint() {
  const [devTime, setDevTime] = React.useState<number | null>(null);
  
  // DEV MODE: Cycle through 24 hours in 1 minute (2.5 seconds per hour)
  // React.useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     const interval = setInterval(() => {
  //       setDevTime((prev) => {
  //         const next = (prev === null ? 0 : prev + 0.1) % 24;
  //         return next;
  //       });
  //     }, 100);
  //     return () => clearInterval(interval);

  //     // setDevTime(2);
  //   }
  // }, []);

  // Get current hour and minutes for precise time
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeAsDecimal = devTime ?? (hour + minute / 60);

  // console.log(timeAsDecimal);

  // Define our color stops with their times (in 24h format)
  const timeStops = [
    { time: 0, colors: { start: [25, 25, 112], end: [0, 0, 51], alpha: 0.9 } }, // midnight/night
    { time: 5, colors: { start: [255, 183, 77], end: [255, 166, 158], alpha: 0.9 } }, // sunrise
    { time: 8, colors: { start: [135, 206, 235], end: [255, 255, 255], alpha: 0.7 } }, // day
    { time: 17, colors: { start: [255, 153, 51], end: [255, 51, 51], alpha: 0.9 } }, // sunset
    { time: 20, colors: { start: [25, 25, 112], end: [0, 0, 51], alpha: 0.9 } }, // night
  ];

  // Need to generate month by month timeRange averages to define the gradients

  const timeGradients = [
    { // Night
      timeRange: [0, 6],
      gradient: 'linear-gradient(to bottom, rgba(54, 67, 150, 0.5), rgba(105, 109, 121, 0.5))'
    },
    { // Morning
      timeRange: [6, 10], 
      gradient: 'linear-gradient(to bottom, rgba(72, 108, 156, 0.5), rgba(205, 225, 244, 0.5), rgba(255, 249, 177, 0.5))'
    },
    { // Day
      timeRange: [10, 17],
      gradient: 'linear-gradient(to bottom, rgba(137, 196, 255, 0.5), rgba(231, 237, 243, 0.5))'
    },
    { // Evening
      timeRange: [17, 20],
      gradient: 'linear-gradient(to bottom, rgba(74, 84, 145, 0.5), rgba(169, 173, 198, 0.5), rgba(242, 198, 175, 0.5), rgba(247, 238, 188, 0.5))'
    },
    { // Night
      timeRange: [20, 24],
      gradient: 'linear-gradient(to bottom, rgba(54, 67, 150, 0.5), rgba(105, 109, 121, 0.5))'
    }
  ];

  const getTintGradient = () => {
    // Normalize time for the night period (20-24)
    const normalizedTime = timeAsDecimal < 5 ? timeAsDecimal + 24 : timeAsDecimal;

    // Find the matching gradient for the current time
    const currentGradient = timeGradients.find(({ timeRange }) => {
      const [start, end] = timeRange;
      if (start < end) {
        return timeAsDecimal >= start && timeAsDecimal < end;
      } else {
        // Handle the night period (20-24)
        return timeAsDecimal >= start || timeAsDecimal < end;
      }
    });

    return currentGradient?.gradient ?? timeGradients[0].gradient; // Default to first gradient if none found
  };

  return (
    <div 
      className="tint"
      style={{
        background: getTintGradient(),
      }}
    >
      {/* <div className="font-bold text-2xl">{devTime}</div> */}
    </div>
  );
}