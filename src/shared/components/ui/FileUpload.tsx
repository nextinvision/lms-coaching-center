// FileUpload Component
'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { Upload, X, File } from 'lucide-react';

export interface FileUploadProps {
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
    onFileSelect?: (files: File[]) => void;
    onFileRemove?: (file: File) => void;
    label?: string;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    className?: string;
    value?: File[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
    accept,
    multiple = false,
    maxSize,
    onFileSelect,
    onFileRemove,
    label,
    error,
    helperText,
    disabled = false,
    className,
    value = [],
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>(value);
    const [dragActive, setDragActive] = useState(false);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const validateFile = (file: File): string | null => {
        if (maxSize && file.size > maxSize * 1024 * 1024) {
            return `File size exceeds ${maxSize}MB limit`;
        }
        return null;
    };

    const handleFiles = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const fileArray = Array.from(selectedFiles);
        const validFiles: File[] = [];
        const errors: string[] = [];

        fileArray.forEach((file) => {
            const error = validateFile(file);
            if (error) {
                errors.push(`${file.name}: ${error}`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            console.error('File validation errors:', errors);
        }

        const newFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(newFiles);
        onFileSelect?.(newFiles);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled) return;
        handleFiles(e.dataTransfer.files);
    };

    const removeFile = (index: number) => {
        const fileToRemove = files[index];
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFileRemove?.(fileToRemove);
        onFileSelect?.(newFiles);
    };

    return (
        <div className={cn('w-full', className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                    'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                    dragActive && 'border-blue-500 bg-blue-50',
                    !dragActive && error ? 'border-red-300' : 'border-gray-300',
                    disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileInput}
                    disabled={disabled}
                    className="hidden"
                />
                <div className="flex flex-col items-center justify-center">
                    <Upload
                        className={cn(
                            'h-10 w-10 mb-2',
                            error ? 'text-red-400' : 'text-gray-400'
                        )}
                    />
                    <p className="text-sm text-gray-600 mb-1">
                        <button
                            type="button"
                            onClick={() => !disabled && fileInputRef.current?.click()}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Click to upload
                        </button>
                        {' or drag and drop'}
                    </p>
                    {accept && (
                        <p className="text-xs text-gray-500">Accepted: {accept}</p>
                    )}
                    {maxSize && (
                        <p className="text-xs text-gray-500">Max size: {maxSize}MB</p>
                    )}
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                disabled={disabled}
                                className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default FileUpload;

