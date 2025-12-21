// Error Boundary Component
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert } from './Alert';
import { Button } from './Button';
import { RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full space-y-4">
                        <Alert variant="error" title="Something went wrong">
                            <p className="text-sm">
                                {this.state.error?.message || 'An unexpected error occurred'}
                            </p>
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                    {this.state.error.stack}
                                </pre>
                            )}
                        </Alert>

                        <div className="flex gap-2">
                            <Button onClick={this.handleReset} variant="primary">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                            <Button onClick={this.handleGoHome} variant="outline">
                                <Home className="h-4 w-4 mr-2" />
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

