import en from "@/locales/en";
import fr from "@/locales/fr";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import LanguageSwitcher from "../LanguageSwitcher";

export default function MenuSection() {

  const router = useRouter();
  const { pathname, asPath, query, locale } = router
  const t = locale === 'en' ? en : fr;

  const [background, setBackground] = useState("transparent");

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  return(
    <div 
      style={{ background: background }}
      className="menu-section transition-colors duration-300"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute z-10 bottom-0 md:bottom-auto md:top-0 right-0 p-4 md:p-6 text-xl md:text-3xl pointer-events-auto">
        <LanguageSwitcher />
      </div>
      {background !== "transparent" && <img 
        src="/example.png" 
        alt="cursor" 
        className="h-72 absolute z-10 pointer-events-none select-none" 
        style={{ 
          left: `${cursorPosition.x - 205}px`, 
          top: `${cursorPosition.y - 144}px` 
        }} 
      />}
      <div className="relative flex flex-col md:flex-row w-full h-3/4 items-center justify-around text-xl md:text-3xl font-medium md:font-normal">
        <div onMouseEnter={() => setBackground("var(--yellow)")} onMouseLeave={() => setBackground("transparent")}>
          <Link href="/shop" className="p-12">{t.menu.shop}</Link>
        </div>
        <div onMouseEnter={() => setBackground("var(--green)")} onMouseLeave={() => setBackground("transparent")}>
          <Link href="/editorial" className="p-12">{t.menu.editorial}</Link>
        </div>
        <div onMouseEnter={() => setBackground("var(--red)")} onMouseLeave={() => setBackground("transparent")}>
          <Link href="/about" className="p-12">{t.menu.about}</Link>
        </div>
      </div>
    </div>
  );
}