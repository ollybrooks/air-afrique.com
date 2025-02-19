import Link from "next/link";
import { useRouter } from "next/router";
import fr from "../locales/fr";
import en from "../locales/en";
import Tint from "./Tint";
import { useEffect, useState, useRef } from "react";
import { useTime } from "../context/time";
import LanguageSwitcher from "./LanguageSwitcher";
import { getArticles } from "../sanity/utils";
import client from "@/shopify/client";
import Image from "next/image";

export default function Menu({ visible, menuItems }: { visible: boolean, menuItems: any }) {

  const router = useRouter();
  const { locale = "fr" } = router || {};

  const t = locale === 'en' ? en : fr;

  useEffect(() => {
    if (visible) {
      // Lock scroll when component mounts
      document.body.style.overflow = 'hidden';
      
      // Cleanup: restore scroll when component unmounts
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [visible]);

  const { visitTime } = useTime();

  // const [startTime, setStartTime] = useState(new Date().getTime());
  const formatTime = (elapsedTime: number) => {
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [timeElapsed, setTimeElapsed] = useState("00:00:00");  // Initialize with a static value

  useEffect(() => {
    // Set initial time and start interval only on client-side
    const calculateTime = () => {
      const elapsedTime = new Date().getTime() - visitTime.getTime();
      setTimeElapsed(formatTime(elapsedTime));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [visitTime]);

  const [articleCount, setArticleCount] = useState("000");
  const [productCount, setProductCount] = useState("000");

  useEffect(() => {
    const fetchArticleCount = async () => {
      try {
        const response = await fetch(`/api/article-count?locale=${locale}`);
        const data = await response.json();
        setArticleCount(data.count.toString().padStart(3, '0'));
      } catch (error) {
        console.error('Error fetching article count:', error);
        setArticleCount('000');
      }
    };
    
    fetchArticleCount();
  }, [locale]);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await fetch('/api/product-count');
        const data = await response.json();
        setProductCount(data.count.toString().padStart(3, '0'));
      } catch (error) {
        console.error('Error fetching product count:', error);
        setProductCount('000');
      }
    };
    
    fetchProductCount();
  }, [locale]);

  const menuRef = useRef<HTMLDivElement>(null);
  const [background, setBackground] = useState("transparent");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const [currentDate, setCurrentDate] = useState(""); 
  const [localTime, setLocalTime] = useState("");
  const [destinationTime, setDestinationTime] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}));
      setLocalTime(`${now.toLocaleTimeString('en-GB', {hour: 'numeric', minute: 'numeric', second: 'numeric'})} ${now.toLocaleTimeString('en-GB', {timeZoneName: 'short'}).split(' ')[1]}`);
      setDestinationTime(`${now.toLocaleTimeString('en-GB', {hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'CET'})} CET`);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleHover = (item: string) => {
    if (item === "shop") {
      setBackground("var(--yellow)");
      setImage(menuItems.find((item: any) => item.type === "shop")?.image);
    } else if (item === "editorial") {
      setBackground("var(--green)");
      setImage(menuItems.find((item: any) => item.type === "editorial")?.image);
    } else if (item === "about") {
      setBackground("var(--red)");
      setImage(menuItems.find((item: any) => item.type === "about")?.image);
    }
  }

  return(
    <div className={`menu ${visible ? "" : "hide"}`} onMouseMove={handleMouseMove}>
      <Tint />

      <div ref={menuRef} className="relative z-10 flex flex-col md:flex-row w-full h-3/4 items-center justify-around text-xl md:text-3xl font-medium">
        <div onMouseEnter={() => handleHover("shop")} onMouseLeave={() => setBackground("transparent")}>
          <Link href="/shop">{t.menu.shop}</Link>
        </div>
        <div onMouseEnter={() => handleHover("editorial")} onMouseLeave={() => setBackground("transparent")}>
          <Link href="/editorial">{t.menu.editorial}</Link>
        </div>
        <div onMouseEnter={() => handleHover("about")} onMouseLeave={() => setBackground("transparent")}>
          <Link href="/about">{t.menu.about}</Link>
        </div>

        {background !== "transparent" && 
          <Image
            src={image}
            alt="cursor"
            width={428}
            height={428}
            className="absolute z-10 pointer-events-none select-none hidden md:block"
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        }
      </div>

      <div className="absolute z-10 bottom-8 md:bottom-auto md:top-0 right-0 p-4 md:p-6 text-xl md:text-3xl pointer-events-auto">
        <LanguageSwitcher />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-full md:h-auto p-4 pt-20 flex flex-col md:flex-row justify-between items-end text-[8px] md:text-xs font-medium">
        <div className="flex md:hidden xl:flex gap-8 justify-between md:justify-start uppercase w-full md:w-auto leading-tight md:leading-[1.4]">
          <div className="grid grid-cols-[auto_auto] gap-4  whitespace-nowrap">
            <div>
              <div>Date</div>
              <div>Local Time at Origin</div>
              <div>Local Time at Destination</div>
            </div>
            <div>
              <div>{currentDate}</div>
              <div>{localTime}</div>
              <div>{destinationTime}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 whitespace-nowrap">
            <div>
              <div>Time Elapsed</div>
              <div>Products</div>
              <div>Articles</div>
            </div>
            <div>
              <div>{timeElapsed}</div>
              <div>{productCount}</div>
              <div>{articleCount}</div>
            </div>
          </div>
        </div>
        <div className="pointer-events-auto flex gap-8 w-full md:w-auto pb-8 md:pb-0 leading-tight md:leading-[1.4]">
          <div className="max-w-[110px] md:max-w-[960px]">
            <div>DISTRIBUTION</div>
            <div>KD PRESSE</div>
            <div><a href="mailto:contact@kdpresse.com">contact@kdpresse.com</a></div>
            <div>101 rue du Faubourg Saint Denis 75010, Paris FR</div>
          </div>
          <div className="max-w-[110px] md:max-w-[960px]">
            <div>AIR AFRIQUE</div>
            <div>Bienvenue à Bord SAS</div>
            <div><a href="mailto:contact@air-afrique.com">contact@air-afrique.com</a></div>
            <div>9 rue des colonnes 75002, Paris FR</div>
          </div>
          <div className="uppercase w-full md:w-auto absolute md:relative bottom-0 left-0 leading-[1] flex flex-row flex-wrap md:flex-col gap-1 p-4 md:p-0 md:gap-0 justify-between md:justify-start whitespace-nowrap">
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