import Interlude from "@/components/Interlude";
import Layout from "@/components/Layout";
import { getArticles } from "@/sanity/utils";
import Link from "next/link";
import { useState } from "react";

export default function Editorial({ articles }: { articles: any }) {
  const [showInterlude, setShowInterlude] = useState(false);

  const handleInterludeComplete = () => {
    setShowInterlude(false);
  };

  return(
    <Layout>
      <div className="editorial">
        <div className="hero">
          <div>
            <div className="text-4xl font-medium uppercase title">{articles[0].title}</div>
            <br/>
            <button className="text-sm uppercase font-medium text-[var(--red)]">Read More</button>
          </div>
          <div>
            <img src={articles[0].images[0].url} alt={articles[0].title} />
          </div>
          <div>
            <p className="futura uppercase">{articles[0].credits}</p>
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
    if (!isHovering) {
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
      {!showDescription && <img src={article.images[0].url} alt={article.title} className="w-full h-full object-cover" />}
      {showDescription && 
        <div className="absolute bottom-0 left-0 w-full h-full bg-[var(--green)] p-8">
          <div className="border border-black w-full h-full p-12">
            <div className="text-4xl font-medium uppercase title">{article.title}</div>
            <div className="text-sm serif">{article.credits}</div>
            <br/>
            <button className="text-sm uppercase font-medium">Read More</button>
          </div>
        </div>
      }
    </Link>
  )
}

export async function getStaticProps(context: any) {
  const locale = context.locale;
  const articles = await getArticles(locale);
  return {
    props: { articles },
  };
}