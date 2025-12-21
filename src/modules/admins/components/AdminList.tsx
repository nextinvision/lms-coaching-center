// Admin List Component
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Loader } from '@/shared/components/ui/Loader';
import { Edit, Trash2, Mail, Phone, UserCheck, UserX } from 'lucide-react';
import type { AdminWithDetails } from '../types/admin.types';

interface AdminListProps {
    onEdit?: (admin: AdminWithDetails) => void;
    onDelete?: (adminId: string) => void;
}

export function AdminList({ onEdit, onDelete }: AdminListProps) {
    const [admins, setAdmins] = useState<AdminWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/admins');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch admins');
                }

                const result = await response.json();
                setAdmins(result.data || []);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading admins..." />
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-red-600 text-center">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (admins.length === 0) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-gray-600 text-center">No admins found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map((admin) => (
                <Card key={admin.id}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                {admin.user.isActive ? (
                                    <UserCheck className="h-5 w-5 text-green-600" />
                                ) : (
                                    <UserX className="h-5 w-5 text-red-600" />
                                )}
                                {admin.user.name}
                            </CardTitle>
                            <div className="flex gap-2">
                                {onEdit && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(admin)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDelete(admin.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-4 w-4" />
                                {admin.user.email}
                            </div>
                            {admin.user.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    {admin.user.phone}
                                </div>
                            )}
                            <div className="pt-2">
                                <span
                                    className={`inline-block px-2 py-1 text-xs rounded ${
                                        admin.user.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {admin.user.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default AdminList;

