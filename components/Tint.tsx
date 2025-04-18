import React, { useState, useEffect } from 'react';

export default function Tint() {
  const [devTime, setDevTime] = React.useState<number | null>(null);
  const [clientTime, setClientTime] = useState<Date | null>(null);
  
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
  const hour = clientTime ? clientTime.getHours() : 12; // Default to noon/day if client time not yet available
  const minute = clientTime ? clientTime.getMinutes() : 0;
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

  // Monthly time ranges for different periods of the day
  const monthlyTimeRanges = [
    // Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
    {
      night: [
        [0,7.5], [0,7.2], [0,6.5], [0,6.0], [0,5.5], [0,5.2],
        [0,5.3], [0,5.8], [0,6.2], [0,6.8], [0,7.2], [0,7.6]
      ],
      morning: [
        [7.5,9.5], [7.2,9.3], [6.5,9], [6.0,8.8], [5.5,8.5], [5.2,8.3],
        [5.3,8.4], [5.8,8.6], [6.2,8.8], [6.8,9], [7.2,9.3], [7.6,9.5]
      ],
      day: [
        [9.5,16.0], [9.3,16.5], [9,17.2], [8.8,18.0], [8.5,18.8], [8.3,19.2],
        [8.4,19.1], [8.6,18.5], [8.8,17.8], [9,17.0], [9.3,16.2], [9.5,15.8]
      ],
      evening: [
        [16.0,17.0], [16.5,17.5], [17.2,18.2], [18.0,19.0], [18.8,19.8], [19.2,20.2],
        [19.1,20.1], [18.5,19.5], [17.8,18.8], [17.0,18.0], [16.2,17.2], [15.8,16.8]
      ],
      lateNight: [
        [17.0,24], [17.5,24], [18.2,24], [19.0,24], [19.8,24], [20.2,24],
        [20.1,24], [19.5,24], [18.8,24], [18.0,24], [17.2,24], [16.8,24]
      ]
    }
  ];

  const getMonthlyTimeRanges = () => {
    const currentMonth = new Date().getMonth(); // 0-11
    return {
      night: monthlyTimeRanges[0].night[currentMonth],
      morning: monthlyTimeRanges[0].morning[currentMonth],
      day: monthlyTimeRanges[0].day[currentMonth],
      evening: monthlyTimeRanges[0].evening[currentMonth],
      lateNight: monthlyTimeRanges[0].lateNight[currentMonth]
    };
  };

  // Update timeGradients to use dynamic time ranges
  const timeGradients = () => {
    const ranges = getMonthlyTimeRanges();
    return [
      { // Night
        timeRange: ranges.night,
        gradient: 'linear-gradient(to bottom, rgba(54, 67, 150, 0.5), rgba(105, 109, 121, 0.5))'
      },
      { // Morning
        timeRange: ranges.morning,
        gradient: 'linear-gradient(to bottom, rgba(72, 108, 156, 0.5), rgba(205, 225, 244, 0.5), rgba(255, 249, 177, 0.5))'
      },
      { // Day
        timeRange: ranges.day,
        gradient: 'linear-gradient(to bottom, rgba(137, 196, 255, 0.5), rgba(231, 237, 243, 0.5))'
      },
      { // Evening
        timeRange: ranges.evening,
        gradient: 'linear-gradient(to bottom, rgba(74, 84, 145, 0.5), rgba(169, 173, 198, 0.5), rgba(242, 198, 175, 0.5), rgba(247, 238, 188, 0.5))'
      },
      { // Late Night
        timeRange: ranges.lateNight,
        gradient: 'linear-gradient(to bottom, rgba(54, 67, 150, 0.5), rgba(105, 109, 121, 0.5))'
      }
    ];
  };

  const getTintGradient = () => {
    // Get current gradients based on month
    const currentGradients = timeGradients();
    
    // Find the matching gradient for the current time
    const currentGradient = currentGradients.find(({ timeRange }) => {
      const [start, end] = timeRange;
      
      if (start < end) {
        return timeAsDecimal >= start && timeAsDecimal < end;
      } else {
        // Handle the night period (20-24)
        return timeAsDecimal >= start || timeAsDecimal < end;
      }
    });

    return currentGradient?.gradient ?? currentGradients[0].gradient;
  };

  // Update time only on client side
  useEffect(() => {
    setClientTime(new Date());
    
    // Optional: Set up interval to update time periodically
    const interval = setInterval(() => {
      setClientTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

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