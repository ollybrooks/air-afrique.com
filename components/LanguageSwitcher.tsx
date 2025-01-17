import en from "@/locales/en";
import fr from "@/locales/fr";
import { useRouter } from "next/router";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { pathname, asPath, query, locale = "fr" } = router || {};

  const handleLocaleChange = (id: string) => {
    if (!router) return;
    document.cookie = `NEXT_LOCALE=${id}; path=/; max-age=31536000`; // 1 year expiry
    router.push({ pathname, query }, asPath, { locale: id });
  };

  const t = locale === 'en' ? en : fr;
  
  return(
    <>
      <button onClick={() => handleLocaleChange('fr')} className={locale === 'fr' ? 'underline' : ''}>fr</button> / <button onClick={() => handleLocaleChange('en')} className={locale === 'en' ? 'underline' : ''}>en</button>
    </>
  )
}