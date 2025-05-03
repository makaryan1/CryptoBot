import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useI18n, T } from "@/lib/i18n";
import UserProfile from "./user-profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Bot, 
  Wallet, 
  BarChart3,
  Users, 
  User, 
  Shield, 
  Settings, 
  HelpCircle, 
  MessagesSquare,
  Menu,
  X,
  ChevronRight
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  badge?: string;
  highlight?: "primary" | "success" | "warning" | "destructive";
  adminItem?: boolean;
}

const NavItem = ({ icon, label, href, active, badge, highlight, adminItem }: NavItemProps) => {
  const highlightColor = highlight ? `text-${highlight}` : 'text-primary';

  return (
    <li>
      <Link href={href}>
        <div 
          className={`flex items-center justify-between group transition-all duration-200 ${
            active 
              ? `text-foreground bg-${adminItem ? 'destructive' : 'primary'}/10 font-medium border-l-4 ${adminItem ? 'border-destructive' : 'border-primary'} rounded-r-md pl-3`
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60 border-l-4 border-transparent pl-4 rounded-md'
            } py-2.5 pr-3 cursor-pointer`
          }
        >
          <div className="flex items-center">
            <span className={`mr-3 ${active ? highlightColor : 'text-muted-foreground group-hover:text-foreground'}`}>
              {icon}
            </span>
            <span className="text-sm font-medium">{label}</span>
          </div>
          
          {badge && (
            <Badge 
              variant={active ? "default" : "outline"} 
              className={`ml-2 px-1.5 py-0 text-xs ${active ? 'bg-primary text-primary-foreground' : ''}`}
            >
              {badge}
            </Badge>
          )}
          
          {!badge && (
            <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-all ${active ? 'opacity-100' : ''}`} />
          )}
        </div>
      </Link>
    </li>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  const { t } = useI18n();
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const sidebarClasses = isMobileOpen 
    ? "w-[85%] max-w-[320px] md:w-72 glass-effect flex-shrink-0 shadow-xl md:h-screen md:sticky md:top-0 transition-all duration-300 fixed inset-y-0 left-0 z-50 overflow-y-auto" 
    : "w-[85%] max-w-[320px] md:w-72 glass-effect flex-shrink-0 shadow-xl md:h-screen md:sticky md:top-0 transition-all duration-300 hidden md:block overflow-y-auto";

  return (
    <div className="relative">
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <Button 
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-30 md:hidden glass-effect text-muted-foreground shadow-md"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <aside className={sidebarClasses} id="sidebar">
        <div className="p-5 flex items-center justify-between border-b border-border/50">
          <Link href="/">
            <div className="flex items-center space-x-3 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white shadow-md group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-200">
                <Bot className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl gradient-heading">CryptoBot</span>
            </div>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-muted-foreground hover:text-foreground" 
            onClick={toggleMobileSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      
        <nav className="p-5">
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-1 h-5 bg-gradient-to-b from-primary to-accent rounded-r-md mr-2"></div>
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                {t('sidebar.main')}
              </p>
            </div>
            <ul className="space-y-1">
              <NavItem 
                icon={<LayoutDashboard className="h-4 w-4" />}
                label={t('sidebar.dashboard')}
                href="/" 
                active={location === "/"}
              />
              <NavItem 
                icon={<Bot className="h-4 w-4" />}
                label={t('sidebar.bots')}
                href="/bots" 
                active={location.startsWith("/bot")}
                badge={user?.userBots?.length?.toString()}
              />
              <NavItem 
                icon={<Wallet className="h-4 w-4" />}
                label={t('sidebar.wallet')}
                href="/wallet" 
                active={location === "/wallet"}
              />
              <NavItem 
                icon={<BarChart3 className="h-4 w-4" />}
                label={t('sidebar.transactions')}
                href="/transactions" 
                active={location === "/transactions"}
              />
              <NavItem 
                icon={<Users className="h-4 w-4" />}
                label={t('sidebar.referrals')}
                href="/referrals" 
                active={location === "/referrals"}
                highlight="success"
              />
            </ul>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-1 h-5 bg-gradient-to-b from-primary to-accent rounded-r-md mr-2"></div>
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                {t('sidebar.account')}
              </p>
            </div>
            <ul className="space-y-1">
              <NavItem 
                icon={<User className="h-4 w-4" />}
                label={t('sidebar.profile')}
                href="/profile" 
                active={location === "/profile"}
              />
              <NavItem 
                icon={<Shield className="h-4 w-4" />}
                label={t('sidebar.kyc')}
                href="/kyc" 
                active={location === "/kyc"}
                highlight={user?.kyc?.length > 0 && user?.kyc[0]?.status === "verified" ? "success" : user?.kyc?.length > 0 && user?.kyc[0]?.status === "pending" ? "warning" : undefined}
              />
              <NavItem 
                icon={<Settings className="h-4 w-4" />}
                label={t('sidebar.settings')}
                href="/profile" 
                active={location === "/settings"}
              />
            </ul>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-1 h-5 bg-gradient-to-b from-primary to-accent rounded-r-md mr-2"></div>
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                {t('sidebar.support')}
              </p>
            </div>
            <ul className="space-y-1">
              <NavItem 
                icon={<HelpCircle className="h-4 w-4" />}
                label={t('sidebar.help')}
                href="/support" 
                active={location === "/help"}
              />
              <NavItem 
                icon={<MessagesSquare className="h-4 w-4" />}
                label={t('sidebar.contact')}
                href="/support" 
                active={location === "/support"}
              />
            </ul>
          </div>
          
          {user?.isAdmin && (
            <div className="mt-6">
              <div className="flex items-center mb-3">
                <div className="w-1 h-5 bg-gradient-to-b from-destructive to-rose-500 rounded-r-md mr-2"></div>
                <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                  {t('sidebar.admin')}
                </p>
              </div>
              <ul className="space-y-1">
                <NavItem 
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  label={t('sidebar.adminDashboard')}
                  href="/admin" 
                  active={location === "/admin"}
                  adminItem
                />
                <NavItem 
                  icon={<Bot className="h-4 w-4" />}
                  label={t('sidebar.botManagement')}
                  href="/admin/bots" 
                  active={location === "/admin/bots"}
                  adminItem
                />
                <NavItem 
                  icon={<Users className="h-4 w-4" />}
                  label={t('sidebar.userManagement')}
                  href="/admin/users" 
                  active={location === "/admin/users"}
                  adminItem
                />
                <NavItem 
                  icon={<Shield className="h-4 w-4" />}
                  label={t('sidebar.kycManagement')}
                  href="/admin/kyc" 
                  active={location === "/admin/kyc"}
                  adminItem
                />
                <NavItem 
                  icon={<BarChart3 className="h-4 w-4" />}
                  label={t('sidebar.commissionSettings')}
                  href="/admin/commissions" 
                  active={location === "/admin/commissions"}
                  adminItem
                />
              </ul>
            </div>
          )}
        </nav>
        
        <div className="mt-auto p-5 border-t border-border/50">
          <UserProfile />
        </div>
      </aside>
    </div>
  );
}
