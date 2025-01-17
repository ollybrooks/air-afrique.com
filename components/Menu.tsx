import Link from "next/link";
import { useRouter } from "next/router";
import fr from "../locales/fr";
import en from "../locales/en";
import Tint from "./Tint";
import { useEffect, useState } from "react";
import { useTime } from "../context/time";
import LanguageSwitcher from "./LanguageSwitcher";
import { getArticles } from "../sanity/utils";

export default function Menu() {

  const router = useRouter();
  const { locale = "fr" } = router || {};

  const t = locale === 'en' ? en : fr;

  useEffect(() => {
    // Lock scroll when component mounts
    document.body.style.overflow = 'hidden';
    
    // Cleanup: restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const { visitTime } = useTime();

  // const [startTime, setStartTime] = useState(new Date().getTime());
  const formatTime = (elapsedTime: number) => {
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [timeElapsed, setTimeElapsed] = useState(() => {
    const elapsedTime = new Date().getTime() - visitTime.getTime();
    return formatTime(elapsedTime);
  });

  useEffect(() => {
    const calculateTime = () => {
      const elapsedTime = new Date().getTime() - visitTime.getTime();
      setTimeElapsed(formatTime(elapsedTime));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [visitTime]);

  const [articleCount, setArticleCount] = useState("000");

  useEffect(() => {
    const fetchArticleCount = async () => {
      const articles = await getArticles(locale);
      setArticleCount(articles.length.toString().padStart(3, '0'));
    };
    
    fetchArticleCount();
  }, [locale]);

  return(
    <div className={`menu`}>
      <Tint />

      <div className="relative flex w-full justify-around text-3xl">
        <div>
          <Link href="/shop">{t.menu.shop}</Link>
        </div>
        <div>
          <Link href="/editorial">{t.menu.editorial}</Link>
        </div>
        <div>
          <Link href="/about">{t.menu.about}</Link>
        </div>
      </div>

      <div className="absolute top-0 right-0 p-6 text-3xl pointer-events-auto">
        <LanguageSwitcher />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end text-sm font-medium">
        <div className="flex gap-8 uppercase">
          <div className="grid grid-cols-[auto_auto] gap-4">
            <div>
              <div>Date</div>
              <div>Local Time at Origin</div>
              <div>Local Time at Destination</div>
            </div>
            <div>
              <div>{new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</div>
              <div>{new Date().toLocaleTimeString('en-GB', {hour: 'numeric', minute: 'numeric', second: 'numeric'})} {new Date().toLocaleTimeString('en-GB', {timeZoneName: 'short'}).split(' ')[1]}</div>
              <div>{new Date().toLocaleTimeString('en-GB', {hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'CET'})} CET</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div>Time Elapsed</div>
              <div>Products</div>
              <div>Articles</div>
            </div>
            <div>
              <div>{timeElapsed}</div>
              <div>000</div>
              <div>{articleCount}</div>
            </div>
          </div>
        </div>
        <div className="pointer-events-auto flex gap-8">
          <div>
            <div>DISTRIBUTION</div>
            <div>KD PRESSE</div>
            <div>contact@kdpresse.com</div>
            <div>101 rue du Faubourg Saint Denis 75010, Paris FR</div>
          </div>
          <div>
            <div>AIR AFRIQUE</div>
            <div>Bienvenue à Bord SAS</div>
            <div>contact@air-afrique.com</div>
            <div>9 rue des colonnes 75002, Paris FR</div>
          </div>
          <div className="uppercase">
            <div>
              <a href="https://www.instagram.com/airafrique_" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
            <div>
              <Link href="/shipping">{t.menu.shipping}</Link>
            </div>
            <div>
              <Link href="/terms">{t.menu.terms}</Link>
            </div>
            <div>
              <Link href="/privacy">{t.menu.privacy}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}