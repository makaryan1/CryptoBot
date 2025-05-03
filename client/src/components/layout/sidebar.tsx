import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import UserProfile from "./user-profile";

interface NavItemProps {
  icon: string;
  label: string;
  href: string;
  active: boolean;
}

const NavItem = ({ icon, label, href, active }: NavItemProps) => {
  return (
    <li>
      <Link href={href}>
        <div className={`flex items-center transition-all duration-200 ${
          active 
            ? 'text-primary bg-primary/10 font-medium border-l-4 border-primary pl-[0.625rem]' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted border-l-4 border-transparent pl-[0.625rem]'
          } rounded-md py-2.5 pr-3 cursor-pointer`}>
          <i className={`${icon} mr-3 text-lg ${active ? 'text-primary' : ''}`}></i>
          <span>{label}</span>
        </div>
      </Link>
    </li>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const sidebarClasses = isMobileOpen 
    ? "w-[85%] max-w-[320px] md:w-72 bg-card border-r border-border flex-shrink-0 shadow-xl md:h-screen md:sticky md:top-0 transition-all duration-300 fixed inset-y-0 left-0 z-50" 
    : "w-[85%] max-w-[320px] md:w-72 bg-card border-r border-border flex-shrink-0 shadow-xl md:h-screen md:sticky md:top-0 transition-all duration-300 hidden md:block";

  return (
    <div className="relative">
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <button 
        className="fixed top-4 left-4 z-30 md:hidden bg-card p-2 rounded-lg shadow-md border border-border text-muted-foreground"
        onClick={toggleMobileSidebar}
      >
        <i className="ri-menu-line text-xl"></i>
      </button>
      
      <aside className={sidebarClasses} id="sidebar">
        <div className="p-5 flex items-center justify-between border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-white shadow-md">
              <i className="ri-robot-line text-xl"></i>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">CryptoBot</span>
          </div>
          <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors" onClick={toggleMobileSidebar}>
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
      
        <nav className="p-5">
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-1 h-5 bg-primary rounded-r-md mr-2"></div>
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Main</p>
            </div>
            <ul className="space-y-1">
              <NavItem 
                icon="ri-dashboard-line" 
                label="Dashboard" 
                href="/" 
                active={location === "/"}
              />
              <NavItem 
                icon="ri-robot-line" 
                label="Trading Bots" 
                href="/bots" 
                active={location === "/bots"}
              />
              <NavItem 
                icon="ri-wallet-3-line" 
                label="Wallet" 
                href="/wallet" 
                active={location === "/wallet"}
              />
              <NavItem 
                icon="ri-exchange-funds-line" 
                label="Transactions" 
                href="/transactions" 
                active={location === "/transactions"}
              />
              <NavItem 
                icon="ri-group-line" 
                label="Referrals" 
                href="/referrals" 
                active={location === "/referrals"}
              />
            </ul>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-1 h-5 bg-primary rounded-r-md mr-2"></div>
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Account</p>
            </div>
            <ul className="space-y-1">
              <NavItem 
                icon="ri-user-line" 
                label="Profile" 
                href="/profile" 
                active={location === "/profile"}
              />
              <NavItem 
                icon="ri-shield-check-line" 
                label="KYC Verification" 
                href="/kyc" 
                active={location === "/kyc"}
              />
              <NavItem 
                icon="ri-settings-4-line" 
                label="Settings" 
                href="/profile" 
                active={location === "/settings"}
              />
            </ul>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-1 h-5 bg-primary rounded-r-md mr-2"></div>
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Support</p>
            </div>
            <ul className="space-y-1">
              <NavItem 
                icon="ri-question-line" 
                label="Help Center" 
                href="/support" 
                active={location === "/help"}
              />
              <NavItem 
                icon="ri-customer-service-2-line" 
                label="Contact Support" 
                href="/support" 
                active={location === "/support"}
              />
            </ul>
          </div>
          
          {user?.isAdmin && (
            <div className="mt-6">
              <div className="flex items-center mb-3">
                <div className="w-1 h-5 bg-destructive rounded-r-md mr-2"></div>
                <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Admin</p>
              </div>
              <ul className="space-y-1">
                <NavItem 
                  icon="ri-dashboard-line" 
                  label="Admin Dashboard" 
                  href="/admin" 
                  active={location === "/admin"}
                />
                <NavItem 
                  icon="ri-robot-line" 
                  label="Bot Management" 
                  href="/admin/bots" 
                  active={location === "/admin/bots"}
                />
                <NavItem 
                  icon="ri-user-settings-line" 
                  label="User Management" 
                  href="/admin/users" 
                  active={location === "/admin/users"}
                />
                <NavItem 
                  icon="ri-shield-check-line" 
                  label="KYC Management" 
                  href="/admin/kyc" 
                  active={location === "/admin/kyc"}
                />
                <NavItem 
                  icon="ri-percent-line" 
                  label="Commission Settings" 
                  href="/admin/commissions" 
                  active={location === "/admin/commissions"}
                />
              </ul>
            </div>
          )}
        </nav>
        
        <div className="mt-auto p-5 border-t border-border">
          <UserProfile />
        </div>
      </aside>
    </div>
  );
}
