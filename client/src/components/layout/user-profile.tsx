import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, ChevronRight, Crown } from "lucide-react";
import { Link } from "wouter";

export default function UserProfile() {
  const { user, logoutMutation } = useAuth();
  const { t } = useI18n();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) return null;

  // Default to bronze level if not specified
  const referralLevel = user.referralLevel || 'bronze';
  
  // Get the user's referral badge data
  const referralBadge = referralLevel === 'gold' 
    ? {
        label: t('referral.goldLevel') || 'Gold Level',
        icon: <Crown className="h-3 w-3 mr-1 text-amber-500" />,
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        textColor: 'text-amber-800 dark:text-amber-300'
      }
    : referralLevel === 'silver'
    ? {
        label: t('referral.silverLevel') || 'Silver Level',
        icon: <Crown className="h-3 w-3 mr-1 text-gray-400" />,
        bg: 'bg-slate-100 dark:bg-slate-700/30', 
        textColor: 'text-slate-800 dark:text-slate-300'
      }
    : {
        label: t('referral.bronzeLevel') || 'Bronze Level',
        icon: <Crown className="h-3 w-3 mr-1 text-amber-600" />,
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        textColor: 'text-amber-700 dark:text-amber-400'
      };

  return (
    <div className="glass-effect rounded-xl p-4">
      <div className="flex items-center mb-4">
        <Avatar className="h-10 w-10 mr-3 rounded-md overflow-hidden shadow-sm border-2 border-white/50 dark:border-slate-700/50">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
            {user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {user.fullName || user.email.split('@')[0]}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${referralBadge.bg} ${referralBadge.textColor} w-fit`}>
          {referralBadge.icon}
          {referralBadge.label}
        </div>
        
        <div className="flex justify-between items-center gap-2">
          <Link href="/profile">
            <Button variant="outline" size="sm" className="w-full justify-between text-xs glass-effect">
              {t('sidebar.viewProfile')}
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
            onClick={handleLogout}
            title={t('auth.logout')}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
