import { useAuth } from "@/hooks/use-auth";

export default function UserProfile() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) return null;

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 shadow-md">
          <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-semibold text-lg">
            {user.email.charAt(0).toUpperCase()}
          </div>
        </div>
        <div>
          <p className="font-medium text-sm text-foreground">
            {user.fullName || user.email.split('@')[0]}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          {user.referralLevel === 'gold' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
              Gold Level
            </span>
          ) : user.referralLevel === 'silver' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700/30 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
              Silver Level
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5"></span>
              Bronze Level
            </span>
          )}
        </div>
        
        <button 
          className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={handleLogout}
          title="Logout"
        >
          <i className="ri-logout-box-r-line text-lg"></i>
        </button>
      </div>
    </div>
  );
}
