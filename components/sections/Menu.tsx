import en from "@/locales/en";
import fr from "@/locales/fr";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import LanguageSwitcher from "../LanguageSwitcher";
import Image from "next/image";

export default function MenuSection({ menuItems }: { menuItems: any }) {

  const router = useRouter();
  const { pathname, asPath, query, locale } = router
  const t = locale === 'en' ? en : fr;

  const [background, setBackground] = useState("transparent");
  const [image, setImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

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
    <div 
      style={{ background: background }}
      className="menu-section transition-colors duration-300"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute z-10 bottom-0 md:bottom-auto md:top-0 right-0 p-4 md:p-6 text-xl md:text-3xl font-medium pointer-events-auto">
        <LanguageSwitcher />
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
      <div className="relative flex flex-col md:flex-row w-full h-3/4 items-center justify-around text-xl md:text-3xl font-medium">
        <div onMouseEnter={() => handleHover("shop")} onMouseLeave={() => setBackground("transparent")}>
          <Link href="/shop" className="p-12">{t.menu.shop}</Link>
        </div>
        <div onMouseEnter={() => handleHover("editorial")} onMouseLeave={() => setBackground("transparent")}>
          <Link href="/editorial" className="p-12">{t.menu.editorial}</Link>
        </div>
        <div onMouseEnter={() => handleHover("about")} onMouseLeave={() => setBackground("transparent")}>
          <Link href="/about" className="p-12">{t.menu.about}</Link>
        </div>
      </div>
    </div>
  );
}