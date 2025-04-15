import Interlude from "@/components/Interlude";
import Layout from "@/components/Layout";
import { getArticles, getEditorial, getGeneral, getMuseum } from "@/sanity/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/router';

export default function Editorial({ articles, general, editorial, museum }: { articles: any, general: any, editorial: any, museum: any }) {
  
  const router = useRouter();
  const [showInterlude, setShowInterlude] = useState(false);
  const [pendingRoute, setPendingRoute] = useState('');
  const [museumContent, setMuseumContent] = useState<any>(null);

  const handleInterludeComplete = () => {
    if (pendingRoute) {
      router.push(pendingRoute);
    }
  };

  const hero = articles.find((article: any) => article._id === editorial.heroArticle._ref);

  const handleItemClick = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    setPendingRoute(`/editorial/${handle}`);
    setShowInterlude(true);
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * museum.length);
    setMuseumContent(museum[randomIndex]);
  }, [museum]);

  return(
    <Layout metadata={general}>
      <div className="editorial">
        <div className="hero">
          <div>
            {hero.issue && <div className="mb-4 futura uppercase bg-black text-white inline-block">Issue {('0' + hero.issue).slice(-2)}</div>}
            <Link 
              href={`/editorial/${hero.slug}`}
              onClick={(e) => handleItemClick(e, hero.slug)}
            >
              <div className="text-3xl font-medium uppercase title p-4 md:p-0">
                {hero.title}
              </div>
            </Link>
            <Link 
              href={`/editorial/${hero.slug}`}
              onClick={(e) => handleItemClick(e, hero.slug)}
              className="text-sm uppercase font-medium text-[var(--red)] tracking-wider mt-4 hidden md:block"
            >
              Read More
            </Link>
          </div>
          <div>
            <Link 
              href={`/editorial/${hero.slug}`}
              onClick={(e) => handleItemClick(e, hero.slug)}
            >
              <Image 
                src={hero.heroImage}
                alt={hero.title}
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
            </Link>
          </div>
          <div className="p-4 md:p-0">
            <p className="serif leading-[18.5px]">{hero.summary}</p>
            <p className="futura text-sm uppercase mt-2">{hero.credits}</p>
            <Link 
              href={`/editorial/${hero.slug}`} 
              className="text-xs uppercase font-medium text-[var(--red)] tracking-wider mt-8 block md:hidden"
            >
              Read More
            </Link>
          </div>
        </div>
        <div className="index">
          {articles.filter((article: any) => article._id !== editorial.heroArticle._ref).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((article: any, index: number) => (
            <Item 
              key={article.slug} 
              article={article} 
              index={index}
              handleItemClick={handleItemClick}
            />
          ))}
        </div>
      </div>
      <Interlude 
        visible={showInterlude} 
        onComplete={handleInterludeComplete} 
        content={museumContent}
      />
    </Layout>
  );
}

function Item({ article, index, handleItemClick }: { article: any, index: number, handleItemClick: (e: React.MouseEvent, handle: string) => void }) {
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

  const [textColours] = useState([
    'text-[var(--green)]',
    'text-[var(--yellow)]',
    'text-[var(--red)]',
  ])

  const backgroundColour = colours[index % colours.length];
  const textColour = textColours[index % textColours.length];

  return(
    <Link 
      href={`/editorial/${article.slug}`}
      onClick={(e) => handleItemClick(e, article.slug)}
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
        <div className="border border-black w-full h-full p-6 md:p-12 flex flex-col justify-center items-start">
          {article.issue && <div className={`mb-4 futura uppercase bg-black ${textColour}`}>Issue {('0' + article.issue).slice(-2)}</div>}
          <div className="text-2xl md:text-4xl font-medium uppercase title">{article.title}</div>
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
  const museum = await getMuseum(locale);

  return {
    props: { articles, general, editorial, museum },
    revalidate: 60
  };
}