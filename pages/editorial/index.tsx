import Interlude from "@/components/Interlude";
import Layout from "@/components/Layout";
import { getArticles, getEditorial, getGeneral } from "@/sanity/utils";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Editorial({ articles, general, editorial }: { articles: any, general: any, editorial: any }) {
  const [showInterlude, setShowInterlude] = useState(false);

  const handleInterludeComplete = () => {
    setShowInterlude(false);
  };

  const hero = articles.find((article: any) => article._id === editorial.heroArticle._ref);

  return(
    <Layout metadata={general}>
      <div className="editorial">
        <div className="hero">
          <div>
            <div className="text-3xl font-medium uppercase title p-4 md:p-0">
              {hero.title}
            </div>
            <Link 
              href={`/editorial/${hero.slug}`} 
              className="text-sm uppercase font-medium text-[var(--red)] tracking-wider mt-4 hidden md:block"
            >
              Read More
            </Link>
          </div>
          <div>
            <Image 
              src={hero.heroImage}
              alt={hero.title}
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>
          <div className="p-4 md:p-0">
            <p className="serif leading-[18.5px]">{hero.summary}</p>
            <p className="futura uppercase mt-2">{hero.credits}</p>
            <Link 
              href={`/editorial/${hero.slug}`} 
              className="text-xs uppercase font-medium text-[var(--red)] tracking-wider mt-8 block md:hidden"
            >
              Read More
            </Link>
          </div>
        </div>
        <div className="index">
          {articles.filter((article: any) => article._id !== editorial.heroArticle._ref).map((article: any, index: number) => (
            <Item 
              key={article.slug} 
              article={article} 
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* <button onClick={() => setShowInterlude(true)} className="bg-sky-200 rounded-full py-2 px-4 mx-auto block mt-48">
        Page Button Example
      </button> */}
      {showInterlude && <Interlude onComplete={handleInterludeComplete} />}
    </Layout>
  );
}

function Item({ article, index }: { article: any, index: number }) {
  const [showDescription, setShowDescription] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    if (!isHovering && window.matchMedia('(hover: hover)').matches) {
      setShowDescription(prev => !prev);
    }
    setIsHovering(true);
  };

  const [colours] = useState([
    'bg-[var(--green)]',
    'bg-[var(--yellow)]',
    'bg-[var(--red)]',
  ])

  const backgroundColour = colours[index % colours.length];

  return(
    <Link 
      href={`/editorial/${article.slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-full h-[560px]"
    >
      {article.heroImage && <img 
        src={article.heroImage} 
        alt={article.title} 
        className={`w-full h-full object-cover ${showDescription ? 'opacity-0' : 'opacity-100'}`}
      />}
      <div className={`md:absolute bottom-0 left-0 w-full h-full ${backgroundColour} p-8 ${showDescription || !article.heroImage ? 'opacity-100' : 'md:opacity-0'}`}>
        <div className="border border-black w-full h-full p-12 flex flex-col justify-center items-start">
          <div className="text-4xl font-medium uppercase title">{article.title}</div>
          <div className="text-sm futura uppercase">{article.credits}</div>
          <button className="text-sm uppercase font-medium mt-4 tracking-wider">Read More</button>
        </div>
      </div>
    </Link>
  )
}

export async function getStaticProps(context: any) {
  const { locale } = context;
  const articles = await getArticles(locale);
  const general = await getGeneral(locale);
  const editorial = await getEditorial();

  return {
    props: { articles, general, editorial },
    revalidate: 60
  };
}