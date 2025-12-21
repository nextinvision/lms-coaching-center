// Settings Page - Role-based
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { useAuth } from '@/modules/auth';
import { ProfileSettings, SecuritySettings, SystemStatsComponent, AcademicYearSettings } from '@/modules/settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import { User, Lock, BarChart3, Calendar } from 'lucide-react';
import { Loader } from '@/shared/components/ui/Loader';

export default function SettingsPage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading settings..." />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    // Admin Settings - Full access
    if (user?.role === 'ADMIN') {
        return (
            <ProtectedRoute requiredPermissions={['system_settings']}>
                <DashboardLayout>
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                            <p className="text-gray-600 mt-2">Manage your account and system settings</p>
                        </div>

                        <Tabs defaultValue="profile" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="profile" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="security" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Security
                                </TabsTrigger>
                                <TabsTrigger value="system" className="flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4" />
                                    System
                                </TabsTrigger>
                                <TabsTrigger value="academic" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Academic Years
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="space-y-6">
                                <ProfileSettings />
                            </TabsContent>

                            <TabsContent value="security" className="space-y-6">
                                <SecuritySettings />
                            </TabsContent>

                            <TabsContent value="system" className="space-y-6">
                                <SystemStatsComponent />
                            </TabsContent>

                            <TabsContent value="academic" className="space-y-6">
                                <AcademicYearSettings />
                            </TabsContent>
                        </Tabs>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    // Teacher and Student Settings - Profile and Security only
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-600 mt-2">Manage your account settings</p>
                    </div>

                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="security" className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Security
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-6">
                            <ProfileSettings />
                        </TabsContent>

                        <TabsContent value="security" className="space-y-6">
                            <SecuritySettings />
                        </TabsContent>
                    </Tabs>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

