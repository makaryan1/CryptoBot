import { useState } from "react";
import { useLocation } from "wouter";
import LanguageSwitcher from "@/components/language-switcher";
import { T } from "@/lib/i18n";
import { Bot } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export default function Header({ toggleSidebar, title, subtitle }: HeaderProps) {
  const [location] = useLocation();
  
  return (
    <>
      <div className="md:hidden mb-4 flex items-center">
        <button 
          className="flex items-center justify-center w-10 h-10 rounded-md border border-neutral-200 backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 text-neutral-400 mr-3 shadow-sm" 
          onClick={toggleSidebar}
        >
          <i className="ri-menu-line"></i>
        </button>
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-primary to-accent text-white shadow-sm">
            <Bot size={18} />
          </div>
          <span className="font-bold text-lg gradient-heading">TradeMaster AI</span>
        </div>
      </div>

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <div className="text-muted-foreground">{subtitle}</div>}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <LanguageSwitcher />
          {location === "/" && (
            <>
              <button className="flex items-center justify-center px-4 py-2 rounded-md border border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 font-medium transition-colors">
                <i className="ri-wallet-3-line mr-2"></i>
                <T keyName="wallet.deposit" />
              </button>
              <button className="flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 font-medium shadow-sm transition-colors">
                <Bot className="h-4 w-4 mr-2" />
                <T keyName="bots.launch" />
              </button>
            </>
          )}
        </div>
      </header>
    </>
  );
}
