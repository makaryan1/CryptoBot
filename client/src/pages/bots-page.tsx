import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import ActiveBots from "@/components/dashboard/active-bots";
import AvailableBots from "@/components/dashboard/available-bots";

export default function BotsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title="Trading Bots" 
          subtitle="Manage your automated trading bots" 
        />
        
        <ActiveBots />
        <AvailableBots />
      </main>
    </div>
  );
}
