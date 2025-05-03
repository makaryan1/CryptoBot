import { useState } from "react";
import { useLocation } from "wouter";
import { LanguageSwitcher } from "@/components/language-switcher";
import { T } from "@/lib/i18n";

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
  subtitle?: string;
}

export default function Header({ toggleSidebar, title, subtitle }: HeaderProps) {
  const [location] = useLocation();
  
  return (
    <>
      <div className="md:hidden mb-4 flex items-center">
        <button 
          className="flex items-center justify-center w-10 h-10 rounded-md border border-neutral-200 bg-white text-neutral-400 mr-3" 
          onClick={toggleSidebar}
        >
          <i className="ri-menu-line"></i>
        </button>
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-white">
            <i className="ri-robot-line"></i>
          </div>
          <span className="font-bold text-lg">CryptoBot</span>
        </div>
      </div>

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-dark">{title}</h1>
          {subtitle && <p className="text-neutral-400">{subtitle}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <LanguageSwitcher />
          {location === "/" && (
            <>
              <button className="flex items-center justify-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-blue-50 font-medium">
                <i className="ri-wallet-3-line mr-2"></i>
                <T keyName="wallet.deposit" />
              </button>
              <button className="flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 font-medium">
                <i className="ri-robot-line mr-2"></i>
                <T keyName="bots.launch" />
              </button>
            </>
          )}
        </div>
      </header>
    </>
  );
}
