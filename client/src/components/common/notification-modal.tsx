import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface NotificationModalContextType {
  showNotification: (message: string) => void;
  closeNotification: () => void;
}

const NotificationModalContext = createContext<NotificationModalContextType | undefined>(undefined);

export function NotificationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  // Fetch global notifications from the server
  const { data: globalNotification } = useQuery<{ id: number, message: string }>({
    queryKey: ["/api/notifications/global"],
    refetchInterval: 30000, // Check for new notifications every 30 seconds
  });
  
  // Show a global notification when it arrives
  useEffect(() => {
    if (globalNotification && globalNotification.message) {
      showNotification(globalNotification.message);
    }
  }, [globalNotification]);
  
  const showNotification = (message: string) => {
    setMessage(message);
    setIsOpen(true);
  };
  
  const closeNotification = () => {
    setIsOpen(false);
  };
  
  return (
    <NotificationModalContext.Provider value={{ showNotification, closeNotification }}>
      {children}
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                    <i className="ri-notification-3-line text-2xl"></i>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center mb-2">Platform Announcement</h2>
                <p className="text-neutral-400 text-center mb-6">
                  {message}
                </p>
                <Button 
                  className="w-full" 
                  onClick={closeNotification}
                >
                  OK
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </NotificationModalContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationModalContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationModalProvider");
  }
  return context;
}
