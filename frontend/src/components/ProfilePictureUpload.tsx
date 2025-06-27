
import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfilePictureUploadProps {
  onImageChange: (imageUrl: string | null) => void;
  currentImage?: string | null;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  onImageChange,
  currentImage
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPreviewUrl(url);
        onImageChange(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div
          className={`relative w-32 h-32 rounded-full border-2 border-dashed transition-all duration-300 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400'
          } ${previewUrl ? 'border-solid border-gray-200' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-full h-full rounded-full object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
              <Camera size={32} className="text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleUploadClick}
        className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
      >
        <Upload size={16} />
        <span>{previewUrl ? 'Change Photo' : 'Upload Photo'}</span>
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <p className="text-sm text-gray-500 text-center">
        Drag & drop an image or click to upload
        <br />
        <span className="text-xs">JPG, PNG up to 5MB</span>
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
