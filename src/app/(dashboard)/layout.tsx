import React from 'react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import AdminTopbar from '@/components/dashboard/AdminTopbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#070b12] text-slate-100 flex font-sans antialiased overflow-x-hidden">
            {/* Left Sidebar */}
            <AdminSidebar />

            {/* Right Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
