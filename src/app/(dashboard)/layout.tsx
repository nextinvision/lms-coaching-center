import type { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayoutGroup({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
}

