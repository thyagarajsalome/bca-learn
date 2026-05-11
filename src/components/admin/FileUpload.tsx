import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, Loader2, Trash2, FolderOpen, Download, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../../contexts/NotificationContext';

interface FileUploadProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  path: string;
}

export default function FileUpload({
  onUploadComplete,
  maxFiles = 20,
  maxSize = 50,
  acceptedTypes = ['application/pdf']
}: FileUploadProps) {
  const { addNotification } = useNotifications();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [allFiles, setAllFiles] = useState<UploadedFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load all uploaded files from Supabase Storage
  const loadAllFiles = async () => {
    setLoadingFiles(true);
    try {
      const { data, error } = await supabase.storage
        .from('lesson-pdfs')
        .list();

      if (error) throw error;

      const files = data.map(file => ({
        name: file.name,
        url: `${supabase.storage.from('lesson-pdfs').getPublicUrl(file.name).data.publicUrl}`,
        size: file.metadata?.size || 0,
        path: file.name
      }));

      setAllFiles(files);
    } catch (err) {
      console.error('Error loading files:', err);
      addNotification({
        type: 'error',
        message: 'Failed to load uploaded files'
      });
    } finally {
      setLoadingFiles(false);
    }
  };

  // Load files on component mount and after upload
  useEffect(() => {
    loadAllFiles();
  }, [uploadedFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Validate files
    const validFiles = selectedFiles.filter(file => {
      if (!acceptedTypes.includes(file.type)) {
        addNotification({
          type: 'error',
          message: `File ${file.name} is not a PDF`
        });
        return false;
      }
      if (file.size > maxSize * 1024 * 1024) {
        addNotification({
          type: 'error',
          message: `File ${file.name} exceeds ${maxSize}MB limit`
        });
        return false;
      }
      return true;
    });

    if (files.length + validFiles.length > maxFiles) {
      addNotification({
        type: 'warning',
        message: `Maximum ${maxFiles} files allowed`
      });
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);
    console.log('Files selected:', validFiles.map(f => f.name));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const deleteUploadedFile = async (file: UploadedFile) => {
    setDeleting(prev => ({ ...prev, [file.path]: true }));

    try {
      const { error } = await supabase.storage
        .from('lesson-pdfs')
        .remove([file.path]);

      if (error) throw error;

      setUploadedFiles(prev => prev.filter(f => f.path !== file.path));
      setAllFiles(prev => prev.filter(f => f.path !== file.path));
      addNotification({
        type: 'success',
        message: `Successfully deleted ${file.name}`
      });

    } catch (err) {
      addNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete file'
      });
    } finally {
      setDeleting(prev => ({ ...prev, [file.path]: false }));
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploaded: UploadedFile[] = [];

    try {
      for (const file of files) {
        // Sanitize filename - remove special characters and spaces
        const sanitizedName = file.name
          .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
          .replace(/_{2,}/g, '_') // Replace multiple underscores with single
          .replace(/^_|_$/g, ''); // Remove leading/trailing underscores

        const fileName = `${Date.now()}-${sanitizedName}`;
        const filePath = `${fileName}`; // Fixed: removed duplicate folder name

        console.log('Uploading file:', file.name, 'sanitized to:', sanitizedName, 'path:', filePath);

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('lesson-pdfs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error for', file.name, ':', error);
          throw error;
        }

        console.log('Upload successful for', file.name, ':', data);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('lesson-pdfs')
          .getPublicUrl(filePath);

        uploaded.push({
          name: file.name, // Keep original name for display
          url: publicUrl,
          size: file.size,
          path: filePath
        });

        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 100
        }));
      }

      setUploadedFiles(uploaded);
      setFiles([]);
      onUploadComplete?.(uploaded);

      // Show success notification
      addNotification({
        type: 'success',
        message: `Successfully uploaded ${uploaded.length} file${uploaded.length > 1 ? 's' : ''}!`
      });

    } catch (err) {
      console.error('Upload failed:', err);
      addNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Upload failed'
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed rounded-lg p-12 text-center transition-colors border-[#1e2340] hover:border-[#5b6af0]/50"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('border-[#5b6af0]', 'bg-[#5b6af0]/5');
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-[#5b6af0]', 'bg-[#5b6af0]/5');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-[#5b6af0]', 'bg-[#5b6af0]/5');

          const droppedFiles = Array.from(e.dataTransfer.files);
          const validFiles = droppedFiles.filter(file => {
            if (!acceptedTypes.includes(file.type)) {
              addNotification({
                type: 'error',
                message: `File ${file.name} is not a PDF`
              });
              return false;
            }
            if (file.size > maxSize * 1024 * 1024) {
              addNotification({
                type: 'error',
                message: `File ${file.name} exceeds ${maxSize}MB limit`
              });
              return false;
            }
            return true;
          });

          if (files.length + validFiles.length > maxFiles) {
            addNotification({
              type: 'warning',
              message: `Maximum ${maxFiles} files allowed`
            });
            return;
          }

          setFiles(prev => [...prev, ...validFiles]);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          style={{ display: 'none' }}
        />

        <Upload className="w-12 h-12 text-[#8890b5] mx-auto mb-4" />
        <p className="text-[#e8eaf6] mb-2">Upload PDF Files</p>
        <p className="text-sm text-[#8890b5] mb-4">
          Drag and drop PDF files here, or click to browse
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            console.log('Button clicked, fileInputRef:', fileInputRef.current);
            if (fileInputRef.current) {
              fileInputRef.current.click();
            } else {
              console.error('File input ref is null');
            }
          }}
          className="bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Select Files
        </button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#e8eaf6]">Selected Files ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#13172a] rounded-lg p-4 border border-[#1e2340]"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-[#5b6af0]" />
                  <div>
                    <p className="text-sm font-medium text-[#e8eaf6]">{file.name}</p>
                    <p className="text-xs text-[#8890b5]">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {uploading && uploadProgress[file.name] !== undefined && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-5 h-5 text-[#5b6af0] animate-spin" />
                      <span className="text-sm text-[#5b6af0]">{uploadProgress[file.name]}%</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                    className="p-2 rounded-lg hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading {files.length} File{files.length > 1 ? 's' : ''}...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload {files.length} File{files.length > 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* All Uploaded Files */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#e8eaf6] flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-[#5b6af0]" />
            <span>All Uploaded Files ({allFiles.length})</span>
          </h3>
          <button
            onClick={loadAllFiles}
            disabled={loadingFiles}
            className="text-sm text-[#5b6af0] hover:text-[#4a5ae0] transition-colors disabled:opacity-50 flex items-center space-x-1"
          >
            <RefreshCw className={`w-4 h-4 ${loadingFiles ? 'animate-spin' : ''}`} />
            <span>{loadingFiles ? 'Loading...' : 'Refresh'}</span>
          </button>
        </div>

        {allFiles.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#13172a] rounded-lg p-4 border border-[#1e2340] hover:border-[#5b6af0]/50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileText className="w-8 h-8 text-[#5b6af0] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#e8eaf6] truncate">{file.name}</p>
                    <p className="text-xs text-[#8890b5]">{formatFileSize(file.size)}</p>
                    <p className="text-xs text-[#5b6af0] truncate mt-1" title={file.url}>
                      {file.url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(file.url);
                      addNotification({
                        type: 'success',
                        message: 'URL copied to clipboard!'
                      });
                    }}
                    className="p-2 rounded-lg hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
                    title="Copy URL"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-[#1e2340] text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
                    title="View File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteUploadedFile(file)}
                    disabled={deleting[file.path]}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-[#8890b5] hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Delete File"
                  >
                    {deleting[file.path] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-[#13172a] rounded-lg border border-[#1e2340]">
            <FolderOpen className="w-12 h-12 text-[#8890b5] mx-auto mb-3" />
            <p className="text-[#8890b5]">No files uploaded yet</p>
            <p className="text-xs text-[#8890b5] mt-2">Upload PDF files to get started</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-[#13172a] rounded-lg p-6 border border-[#1e2340]">
        <h3 className="text-lg font-semibold text-[#e8eaf6] mb-4">Upload Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-[#8890b5]">
          <li>Select or drag PDF files from your computer</li>
          <li>Files will be uploaded to Supabase Storage bucket "lesson-pdfs"</li>
          <li>After upload, copy the file URLs from the "All Uploaded Files" section above</li>
          <li>Go to "Lessons" tab and create lessons using these URLs</li>
          <li>Supported formats: PDF only</li>
          <li>Maximum file size: {maxSize}MB per file</li>
          <li>Maximum files: {maxFiles} at a time</li>
        </ol>
        <div className="mt-4 p-4 bg-[#0c0f1a] rounded-lg border border-[#1e2340]">
          <h4 className="text-sm font-semibold text-[#e8eaf6] mb-2">💡 Where to find your uploaded files:</h4>
          <ul className="list-disc list-inside space-y-1 text-xs text-[#8890b5]">
            <li>View all files in the "All Uploaded Files" section above</li>
            <li>Copy file URLs by clicking the copy icon</li>
            <li>Use URLs when creating lessons in the Lessons tab</li>
            <li>Delete files using the trash icon</li>
            <li>Files are stored in Supabase Storage, not database</li>
          </ul>
        </div>
      </div>
    </div>
  );
}