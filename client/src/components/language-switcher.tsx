import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useEffect } from "react";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale, availableLocales } = useI18n();
  
  // Установить язык документа
  useEffect(() => {
    document.documentElement.lang = locale;
    
    // Если язык RTL
    if (['ar', 'he', 'fa', 'ur'].includes(locale)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [locale]);
  
  // Отфильтровать доступные языки
  const filteredLanguages = languages.filter(lang => 
    availableLocales.includes(lang.code)
  );
  
  // Получить текущий язык
  const currentLanguage = filteredLanguages.find(lang => lang.code === locale) || filteredLanguages[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {filteredLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className={locale === lang.code ? "font-medium" : ""}>{lang.name}</span>
            {locale === lang.code && (
              <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                ✓
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}