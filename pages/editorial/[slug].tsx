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
      <div className="page" style={{
        background: article.background === "green" ? "var(--green)" : ""
      }}>
        <div className="py-24 overflow-y-scroll" ref={textContainerRef}>
          <h1 className="text-3xl font-bold uppercase title">{article.title}</h1>
          <h2 className="text-xs uppercase my-4 futura whitespace-pre-wrap">{article.credits}</h2>
          <div className="font-medium text-sm leading-[17px] mt-8 text-justify">
            <PortableText value={article.content} />
          </div>
        </div>
        <div 
          ref={imagesContainerRef} 
          className="flex flex-col py-24 overflow-y-scroll"
        >
          {article.images.map((image, index) => (
            <div key={index} className="relative flex flex-col items-end pt-24">
              <Image 
                src={image.url}
                alt={image.caption || article.title}
                width={1200}
                height={800}
                className="w-full h-auto"
              />
              <div className="text-[10px] serif mt-2">{index}</div>
            </div>
          ))}
        </div>
        <div className="pt-48 serif flex flex-col gap-2 items-start">
          {article.images.map((image, index) => (
            <button
              key={index} 
              className="relative cursor-pointer"
              onClick={() => scrollToImage(index)}
            >
              <sup>{index}</sup> {image.caption}
            </button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full p-2 bg-white bg-opacity-70 backdrop-blur-sm">
        <div className={`absolute top-0 left-0 bg-[var(--green)] opacity-80 h-full`} style={{
          width: `${scrollAmount * 100}%`
        }} />
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
