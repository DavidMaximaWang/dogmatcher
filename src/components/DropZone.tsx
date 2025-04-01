import React from 'react';
import { useDropzone } from 'react-dropzone';
import { MAX_FILES } from '../config/constants';
type DropZoneProps = {
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isDisabled: boolean;
    handleDrop: (acceptedFiles: File[]) => void;
};
export default function DropZone({ handleFileChange, handleDrop, isDisabled }: DropZoneProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        maxFiles: MAX_FILES,
        disabled: isDisabled
    });

    return (
        <div
            {...getRootProps()}
            style={{
                border: '2px dashed #4f46e5',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                background: isDragActive ? '#eef2ff' : '#f9fafb',
                transition: 'all 0.2s ease-in-out',
                cursor: isDisabled ? 'not-allowed' : 'pointer'
            }}
        >
            <input {...getInputProps()} onChange={handleFileChange} disabled={isDisabled} />
            <p
                style={{
                    color: isDisabled ? '#9ca3af' : '#4f46e5', // grey when disabled
                    fontSize: '1.2rem',
                    marginBottom: '1rem'
                }}
            >
                {isDisabled ? 'Upload limit reached.' : isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to browse'}
            </p>
        </div>
    );
}
