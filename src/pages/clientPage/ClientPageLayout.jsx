import React from 'react';
import Sidebar from './ClientSidebar';
import Header from './ClientHeader';
import {Outlet} from "react-router-dom";

export default function ClientPageLayout() {
  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}