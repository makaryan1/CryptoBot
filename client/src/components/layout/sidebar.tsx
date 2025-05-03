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
        <a className={`flex items-center ${active ? 'text-primary bg-blue-50' : 'text-neutral-400 hover:text-primary hover:bg-blue-50'} rounded-md p-2`}>
          <i className={`${icon} mr-3`}></i>
          {label}
        </a>
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
    ? "w-full md:w-64 bg-white border-r border-neutral-200 flex-shrink-0 shadow-sm md:h-screen md:sticky md:top-0 transition-all duration-300 fixed inset-0 z-40" 
    : "w-full md:w-64 bg-white border-r border-neutral-200 flex-shrink-0 shadow-sm md:h-screen md:sticky md:top-0 transition-all duration-300";

  return (
    <aside className={sidebarClasses} id="sidebar">
      <div className="p-4 flex items-center justify-between border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-white">
            <i className="ri-robot-line"></i>
          </div>
          <span className="font-bold text-lg">CryptoBot</span>
        </div>
        <button className="md:hidden text-neutral-400 hover:text-dark" onClick={toggleMobileSidebar}>
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>
      
      <nav className="p-4">
        <div className="mb-4">
          <p className="text-xs uppercase text-neutral-400 font-medium mb-2">Main</p>
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
        
        <div className="mb-4">
          <p className="text-xs uppercase text-neutral-400 font-medium mb-2">Account</p>
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
        
        <div>
          <p className="text-xs uppercase text-neutral-400 font-medium mb-2">Support</p>
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
          <div className="mt-4">
            <p className="text-xs uppercase text-neutral-400 font-medium mb-2">Admin</p>
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
      
      <div className="mt-auto p-4 border-t border-neutral-200">
        <UserProfile />
      </div>
    </aside>
  );
}
