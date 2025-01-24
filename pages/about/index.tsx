import Layout from "@/components/Layout";
import { getAbout, getGeneral } from "@/sanity/utils";
import { PortableText } from "@portabletext/react";
import { useState } from "react";
import Image from "next/image";

export default function About({ data, general }: { data: any, general: any }) {

  const [colour, setColour] = useState("var(--red)");
  const [images, setImages] = useState<{ x: number, y: number }[]>([]);

  const [colours] = useState([
    "var(--red)",
    "var(--green)",
    "var(--yellow)",
  ])

  const handleClick = () => {
    const currentIndex = colours.indexOf(colour);
    const nextIndex = (currentIndex + 1) % colours.length;
    setColour(colours[nextIndex]);
    setImages(prev => {
      const newImage = {
        x: 0,
        y: 0
      };
      
      // Try up to 50 times to find a non-overlapping position
      let attempts = 0;
      let foundSpot = false;
      
      while (!foundSpot && attempts < 50) {
        newImage.x = Math.random() * 80; // Leave 10% padding on edges
        newImage.y = Math.random() * 80;
        
        foundSpot = true;
        // Check against all existing images
        for (const existing of prev) {
          // Calculate if too close (within 20% of viewport)
          const tooClose = 
            Math.abs(existing.x - newImage.x) < 20 &&
            Math.abs(existing.y - newImage.y) < 20;
          
          if (tooClose) {
            foundSpot = false;
            break;
          }
        }
        attempts++;
      }

      return [...prev, newImage].slice(0, 16);
    });
  }

  // Preload images

  return(
    <Layout metadata={general}>
      <div 
        className={`absolute top-0 left-0 w-full min-h-screen pt-24`}
        style={{
          background: colour
        }}
        onClick={handleClick}
      >
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none select-none">
          {images.map((image, index) => (
            <Image
              key={index}
              src={`/img/0${index + 1}.png`}
              alt={`Air Afrique ${index + 1}`}
              className="absolute max-w-48 max-h-48"
              width={192}
              height={192}
              style={{
                left: `${image.x}%`,
                top: `${image.y}%`,
                // transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
        <div className="relative text-center text-xl md:text-4xl font-medium tracking-[-0.01em] select-none max-w-5xl mx-auto mt-48 px-4 md:px-0">
          <PortableText value={data.content} />
        </div>
        <div className="relative flex flex-col gap-4 md:gap-8 my-36 text-center items-center select-none">
          <div className="text-xl md:text-4xl font-medium uppercase tracking-[-0.01em]">
            Team
          </div>
          {data.team.map((item: any) => (
            item.link ? (
              <a href={item.link} key={item.name}>
                <div>
                  <p className="uppercase text-xs md:text-xl">{item.title}</p>
                  <p className="font-medium text-base md:text-3xl tracking-[-0.01em]">{item.name}</p>
                </div>
              </a>
            ) : (
              <div key={item.name}>
                <p className="uppercase text-xs md:text-xl">{item.title}</p>
                <p className="font-medium text-base md:text-3xl tracking-[-0.01em]">{item.name}</p>
              </div>
            )
          ))}
        </div>
        
      </div>
    </Layout>
  );
}

export async function getStaticProps(context: any) {
  const { locale } = context;
  const data = await getAbout(locale)
  const general = await getGeneral(locale);
  return {
    props: { data, general },
    revalidate: 60
  }
}