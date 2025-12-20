// PDF Viewer Component
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Loader } from '@/shared/components/ui/Loader';
import { Download, ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import react-pdf components to avoid SSR issues
const PDFDocument = dynamic(
    () => import('react-pdf').then((mod) => mod.Document),
    { ssr: false }
);

const PDFPage = dynamic(
    () => import('react-pdf').then((mod) => mod.Page),
    { ssr: false }
);

// Set up PDF.js worker (only on client)
if (typeof window !== 'undefined') {
    import('react-pdf').then((module) => {
        module.pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${module.pdfjs.version}/pdf.worker.min.js`;
    });
}

interface PDFViewerProps {
    fileUrl: string;
    fileName?: string;
    isDownloadable?: boolean;
}

export function PDFViewer({ fileUrl, fileName, isDownloadable = true }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
    };

    const onDocumentLoadError = (error: Error) => {
        setError(error.message);
        setLoading(false);
    };

    const handleDownload = () => {
        window.open(fileUrl, '_blank');
    };

    const handleOpenInNewTab = () => {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
    };

    if (error) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-red-600 mb-4">Failed to load PDF</p>
                    <div className="flex gap-2 justify-center">
                        {isDownloadable && (
                            <Button onClick={handleDownload} variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                            </Button>
                        )}
                        <Button onClick={handleOpenInNewTab} variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{fileName || 'PDF Document'}</CardTitle>
                    <div className="flex gap-2">
                        {isDownloadable && (
                            <Button onClick={handleDownload} variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        )}
                        <Button onClick={handleOpenInNewTab} variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex justify-center py-12">
                        <Loader text="Loading PDF..." />
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex justify-center bg-gray-100 rounded-lg p-4">
                        {typeof window !== 'undefined' && PDFDocument && PDFPage ? (
                            <PDFDocument
                                file={fileUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={onDocumentLoadError}
                                loading={<Loader text="Loading PDF..." />}
                            >
                                <PDFPage
                                    pageNumber={pageNumber}
                                    width={Math.min(800, typeof window !== 'undefined' ? window.innerWidth - 100 : 800)}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                />
                            </PDFDocument>
                        ) : (
                            <div className="flex justify-center py-12">
                                <Loader text="Loading PDF viewer..." />
                            </div>
                        )}
                    </div>

                    {numPages && numPages > 1 && (
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                                disabled={pageNumber <= 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-600">
                                Page {pageNumber} of {numPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                                disabled={pageNumber >= numPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default PDFViewer;

