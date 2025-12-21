// Academic Year Settings Component (Integration with existing module)
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { AcademicYearList, AcademicYearForm } from '@/modules/academic-years';
import { Modal } from '@/shared/components/ui/Modal';
import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';

export function AcademicYearSettings() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setIsCreateModalOpen(false);
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Academic Year Management
                    </CardTitle>
                    <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Academic Year
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <AcademicYearList key={refreshKey} />

                <Modal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Add Academic Year"
                >
                    <AcademicYearForm onSuccess={handleSuccess} onCancel={() => setIsCreateModalOpen(false)} />
                </Modal>
            </CardContent>
        </Card>
    );
}

