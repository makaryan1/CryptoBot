import { useAuth } from "@/hooks/use-auth";

export default function UserProfile() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) return null;

  return (
    <div className="bg-blue-50 rounded-md p-3">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 mr-2">
          <div className="w-full h-full bg-primary text-white flex items-center justify-center font-medium">
            {user.email.charAt(0).toUpperCase()}
          </div>
        </div>
        <div>
          <p className="font-medium text-sm">
            {user.fullName || user.email.split('@')[0]}
          </p>
          <p className="text-xs text-neutral-400">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-600 mr-1"></span>
            {user.referralLevel === 'gold' ? 'Gold Level' : 
             user.referralLevel === 'silver' ? 'Silver Level' : 'Bronze Level'}
          </span>
        </div>
        <button 
          className="text-neutral-400 hover:text-primary"
          onClick={handleLogout}
        >
          <i className="ri-logout-box-r-line"></i>
        </button>
      </div>
    </div>
  );
}
