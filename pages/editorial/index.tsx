import Interlude from "@/components/Interlude";
import Layout from "@/components/Layout";
import { getArticles, getGeneral } from "@/sanity/utils";
import Link from "next/link";
import { useState } from "react";

export default function Editorial({ articles, general }: { articles: any, general: any }) {
  const [showInterlude, setShowInterlude] = useState(false);

  const handleInterludeComplete = () => {
    setShowInterlude(false);
  };

  return(
    <Layout metadata={general}>
      <div className="editorial">
        <div className="hero">
          <div>
            <div className="text-4xl font-medium uppercase title p-4 md:p-0">
              {articles[0].title}
            </div>
            <Link 
              href={`/editorial/${articles[0].slug}`} 
              className="text-sm uppercase font-medium text-[var(--red)] mt-4 hidden md:block"
            >
              Read More
            </Link>
          </div>
          <div>
            <img src={articles[0].heroImage} alt={articles[0].title} />
          </div>
          <div className="p-4 md:p-0">
            <p className="serif leading-tight">{articles[0].summary}</p>
            <p className="futura uppercase mt-2">{articles[0].credits}</p>
            <Link 
              href={`/editorial/${articles[0].slug}`} 
              className="text-xs uppercase font-medium text-[var(--red)] mt-8 block md:hidden"
            >
              Read More
            </Link>
          </div>
        </div>
        <div className="index">
          {articles.map((article: any) => (
            <Item key={article.slug} article={article} />
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

function Item({ article }: { article: any }) {
  const [showDescription, setShowDescription] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    if (!isHovering && window.matchMedia('(hover: hover)').matches) {
      setShowDescription(prev => !prev);
    }
    setIsHovering(true);
  };

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
      <div className={`md:absolute bottom-0 left-0 w-full h-full bg-[var(--green)] p-8 ${showDescription || !article.heroImage ? 'opacity-100' : 'md:opacity-0'}`}>
        <div className="border border-black w-full h-full p-12">
          <div className="text-4xl font-medium uppercase title">{article.title}</div>
          <div className="text-sm futura uppercase">{article.credits}</div>
          <button className="text-sm uppercase font-medium mt-4">Read More</button>
        </div>
      </div>
    </Link>
  )
}

export async function getStaticProps(context: any) {
  const { locale } = context;
  const articles = await getArticles(locale);
  const general = await getGeneral(locale);
  return {
    props: { articles, general },
    revalidate: 60
  };
}