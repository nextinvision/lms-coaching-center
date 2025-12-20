// ErrorBoundary Component
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
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
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <Alert
                            variant="error"
                            title="Something went wrong"
                            onClose={this.handleReset}
                        >
                            <p className="mt-2 text-sm">
                                {this.state.error?.message ||
                                    'An unexpected error occurred. Please try again.'}
                            </p>
                            <div className="mt-4">
                                <Button onClick={this.handleReset} variant="primary" size="sm">
                                    Try Again
                                </Button>
                            </div>
                        </Alert>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

