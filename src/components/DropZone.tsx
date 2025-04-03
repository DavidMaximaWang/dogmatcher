import React, { useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { MAX_FILES } from '../config/constants';
import { generateHash } from '../utils';
import toast from 'react-hot-toast';
type DropZoneProps = {
    isDisabled: boolean;
    setFiles: (value: React.SetStateAction<File[]>) => void;
};
export default function DropZone({ setFiles, isDisabled }: DropZoneProps) {
    console.log("isDisabled", isDisabled);
    const hashSet = useRef<Set<string>>(new Set());
    const getUniqueFiles = useCallback(async (files: File[]) => {
        const newFiles: File[] = [];

        for (const file of files) {
            const hash = await generateHash(file);
            if (!hashSet.current.has(hash)) {
                hashSet.current.add(hash);
                newFiles.push(file);
            }
        }

        return newFiles;
    }, []);

    const handleFiles = useCallback(
        async (files: File[]) => {
            const newFiles: File[] = await getUniqueFiles(files);

            if (newFiles.length > 0) {
                // setFiles(newFiles);
                setFiles((prev) => [...prev, ...newFiles].slice(0, MAX_FILES));
            }
        },
        [setFiles, getUniqueFiles]
    );

    const  handleDrop = useCallback((acceptedFiles: File[]) => {
        handleFiles(acceptedFiles)
        }, [handleFiles]);

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                handleFiles([...e.target.files]);
            }
        },
        [handleFiles]
    );

    useEffect(() => {
        const handlePaste = async (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (!items) return;

            const files: File[] = [];

            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        files.push(file);
                    }
                }
            }
            if (files.length > 0) {
                handleFiles(files);
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [handleFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        maxFiles: MAX_FILES,
        disabled: isDisabled,
        accept: {
            'image/*': []
        },    onDropRejected: (fileRejections) => {
            if (fileRejections.length > MAX_FILES) {
                toast(`You choosed ${fileRejections.length} files, please choose at most ${MAX_FILES} files`)
            }
            const errors: string[] = []
            fileRejections.forEach((rejection) => {
                console.log('Rejected file:', rejection.file.name);
                rejection.errors.forEach((error) => {
                  errors.push(`Reason: ${error.message} (code: ${error.code})`);
                });
              });
            toast(errors.join('\n'))
          }
    });

    return (
        <>
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

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginTop: '1rem'
                    }}
                >
                    <span
                        style={{
                            color: isDisabled ? '#9ca3af' : '#4f46e5',
                            fontSize: '1.1rem',
                            flex: '1',
                            textAlign: 'left'
                        }}
                    >
                        {isDisabled ? 'Upload limit reached.' : isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to browse'}
                    </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setFiles([]);
                            hashSet.current = new Set()

                        }}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Clear to reselect
                    </button>
                </div>
            </div>
        </>
    );
}
