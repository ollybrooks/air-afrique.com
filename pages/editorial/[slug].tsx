import { GetStaticProps, GetStaticPaths } from 'next'
import { getArticles, getGeneral } from '@/sanity/utils'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useEffect, useRef, useState } from 'react'

interface Article {
  _id: string
  title: string
  content: any
  images: {
    url: string
    caption: string
  }[]
  slug: string
  credits: string
  background: string
  type: string
}

interface Props {
  article: Article
  general: any
}

export default function ArticlePage({ article, general }: Props) {
  const router = useRouter()
  const locale = router.locale || 'fr'
  
  const textContainerRef = useRef<HTMLDivElement>(null)
  const imagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToImage = (index: number) => {
    if (imagesContainerRef.current) {
      const imageElements = imagesContainerRef.current.children
      if (imageElements[index]) {
        imageElements[index].scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const [scrollAmount, setScrollAmount] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const container = article.type === 'text' ? textContainerRef.current : imagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      setScrollAmount(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [showReferences, setShowReferences] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return (
    <Layout metadata={general}>
      <div className="page h-full" style={{
        background: article.background === "green" ? "var(--green)" : "",
        height: "100dvh"
      }}>
        <div className="absolute left-0 bottom-0 w-full h-1/2 md:h-auto md:relative px-4 pt-8 pb-12 md:px-0 md:py-24 overflow-y-scroll" ref={textContainerRef}>
          <h1 className="text-3xl font-bold uppercase title">{article.title}</h1>
          <h2 className="text-xs uppercase my-4 futura whitespace-pre-wrap">{article.credits}</h2>
          <div className="font-medium text-sm leading-[17px] mt-8 text-justify">
            <PortableText value={article.content} />
          </div>
        </div>
        <div 
          ref={imagesContainerRef} 
          className="fixed top-0 left-0 w-full md:relative flex flex-col justify-center md:justify-normal items-center py-24 overflow-y-scroll h-1/2 md:h-auto border-b border-black md:border-b-0"
        >
          {article.images.map((image, index) => (
            <div 
              key={index} 
              className={`absolute md:relative w-full h-2/3 md:h-auto flex flex-col items-end pt-6 md:pt-24 ${index === current ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}
              onClick={() => setCurrent(current === article.images.length - 1 ? 0 : current + 1)}
            >
              <Image 
                src={image.url}
                alt={image.caption || article.title}
                width={1200}
                height={800}
                className="w-full h-full md:h-auto object-contain"
              />
              <div className="text-[10px] serif mt-2 hidden md:block">{index}</div>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 p-4 flex justify-between items-end w-full md:hidden">
            <div className="text-[10px] serif"><sup>{current}</sup> {article.images[current].caption}</div>
            <button className="text-[8px] leading-[9.5px] serif" onClick={() => setShowReferences(true)}>REFERENCES</button>
          </div>
          {/* <div className="fixed top-0 left-1/3 border border-pink-500 w-1/3 h-screen flex-col hidden md:flex">
            <button className="w-full h-1/2 bg-pink-200 bg-opacity-50" onClick={() => scrollToImage(current-1)}></button>
            <button className="w-full h-1/2 bg-sky-200 bg-opacity-50" onClick={() => scrollToImage(current+1)}></button>
          </div> */}
        </div>
        <div className="pt-48 serif flex-col gap-2 items-start hidden md:flex">
          {article.images.map((image, index) => (
            <button
              key={index} 
              className="relative cursor-pointer text-left"
              onClick={() => scrollToImage(index)}
            >
              <sup>{index}</sup> {image.caption}
            </button>
          ))}
        </div>
        {showReferences && <div 
          className="fixed z-50 top-0 left-0 w-full h-screen bg-white bg-opacity-70 serif block md:hidden" 
          style={{height: "100dvh"}}
          onClick={() => setShowReferences(false)}
        >
          <div 
            className="relative bg-white border-b border-black text-[10px] w-full h-1/2 flex flex-col gap-2 items-start justify-end p-4"
            onClick={e => e.stopPropagation()}
          >
            {article.images.map((image, index) => (
              <button
                key={index} 
                className={`relative cursor-pointer text-left ${index === current ? 'font-bold' : ''}`}
                onClick={() => {
                  setCurrent(index)
                  setShowReferences(false)
                }}
              >
                <sup>{index}</sup> {image.caption}
              </button>
            ))}
            <button className="text-[8px] leading-[9.5px] serif absolute bottom-0 right-0 m-4" onClick={() => setShowReferences(false)}>(CLOSE)</button>
          </div>
        </div>}
      </div>
      <div className="fixed bottom-0 left-0 w-full p-2 bg-white bg-opacity-70 backdrop-blur-sm">
        <div className={`absolute top-0 left-0 bg-[var(--green)] opacity-80 h-full`} style={{
          width: `${scrollAmount * 100}%`
        }} />
        {current > 0 && <div className={`absolute top-0 left-0 bg-[var(--green)] opacity-80 h-full md:hidden`} style={{
          width: `${(100 / article.images.length) * (current+1)}%`
        }} />}
        <div className="relative text-xs font-medium">
          <span className="opacity-50">ELAPSED</span> {formatTime(elapsedTime)}
        </div>
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales = ['fr', 'en'] }) => {
  const articles = await getArticles('fr')
  
  const paths = articles.flatMap((article: Article) =>
    locales.map((locale) => ({
      params: { slug: article.slug },
      locale
    }))
  )

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context: any) => {
  const { locale } = context;
  const { params } = context;
  if (!params?.slug) return { notFound: true }

  const general = await getGeneral(locale);
  const articles = await getArticles(locale)
  const article = articles.find((a: Article) => a.slug === params.slug)

  if (!article) return { notFound: true }

  return {
    props: {
      article,
      general
    }
  }
}
