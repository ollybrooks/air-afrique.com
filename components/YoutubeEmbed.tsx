import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router"; 

export default function YoutubeEmbed() {
  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<any | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [length, setLength] = useState(60) // seconds
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    if (ref.current) {
      // Function to initialize the YouTube player
      const initializeYouTubePlayer = () => {
        const videoId = "0h_cqTCT5g0";

        // Check if the YouTube Iframe API is available
        if (window.YT && typeof window.YT.Player === 'function') {
          // If available, initialize the player
          const newPlayer = new window.YT.Player(ref.current, {
            height: window.innerHeight,
            width: window.innerWidth,
            videoId,
            playerVars: { "autoplay": 1, "controls": 0, "mute": 1, "rel": 0 },
            events: {
              onReady: (event: any) => {
                event.target.playVideo();
                setPlayer(event.target);
              },
            },
          });
        } else {
          // If the YouTube Iframe API is not available, log an error
          console.error('YouTube Iframe API is not available');
        }
      };

      // Check if the YouTube Iframe API script is already loaded
      if (window.YT && typeof window.YT.Player === 'function') {
        initializeYouTubePlayer();
      } else {
        // If not loaded, wait for the script to load and then initialize the player
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);

        // Define the callback function to initialize the player once the API is ready
        window.onYouTubeIframeAPIReady = initializeYouTubePlayer as any;
      }

      // Cleanup function
      return () => {
        // Set window.onYouTubeIframeAPIReady to undefined if it's defined
        if (window.onYouTubeIframeAPIReady) {
          window.onYouTubeIframeAPIReady = () => undefined;
        }
      };
    }
  }, [ref.current])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowOverlay(false)
    }, 3500)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/home')
    }, length * 1000)
    return () => clearTimeout(timeout)
  }, [length])

  function handleMute() {
    if (player) {
      console.log(player)
      player.unMute();
      setMuted(false)
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none select-none">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-white transition-opacity duration-1000"
        style={{
          opacity: showOverlay ? 1 : 0
        }}
      />
      <div 
        ref={ref} 
        className="" 
        style={{
          height: "100vh",
          width: "calc((100vh*16)/9)"
        }}
      />
      {muted && <button onClick={handleMute} className="absolute uppercase text-white font-bold bottom-0 right-0 m-16 px-1 pointer-events-auto">
        Unmute
      </button>}
    </div>
  );
}