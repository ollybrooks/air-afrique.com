import Layout from "@/components/Layout";
import { getAbout } from "@/sanity/utils";
import { PortableText } from "@portabletext/react";
import { useState } from "react";

export default function About({ data }: { data: any }) {

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
        newImage.x = Math.random() * 80 + 10; // Leave 10% padding on edges
        newImage.y = Math.random() * 80 + 10;
        
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

  return(
    <Layout>
      <div 
        className={`absolute top-0 left-0 w-full min-h-screen pt-24`}
        style={{
          background: colour
        }}
        onClick={handleClick}
      >
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden">
          {images.map((image, index) => (
            <img 
              key={index}
              src={`/img/0${index + 1}.png`} 
              className="absolute max-w-48 max-h-48"
              style={{
                left: `${image.x}%`,
                top: `${image.y}%`,
                // transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
        <div className="relative text-center text-4xl font-medium max-w-5xl mx-auto select-none mt-48">
          <PortableText value={data.content} />
        </div>
        <div className="relative flex flex-col gap-8 my-36 text-center items-center select-none">
          <div className="text-4xl font-medium uppercase">Team</div>
          {data.team.map((item: any) => (
            item.link ? (
              <a href={item.link} key={item.name}>
                <div>
                  <p className="uppercase text-xl">{item.title}</p>
                  <p className="font-medium text-[28px]">{item.name}</p>
                </div>
              </a>
            ) : (
              <div key={item.name}>
                <p className="uppercase text-xl">{item.title}</p>
                <p className="font-medium text-3xl">{item.name}</p>
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
  return {
    props: { data }
  }
}