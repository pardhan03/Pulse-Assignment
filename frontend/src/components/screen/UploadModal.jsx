import React, { useRef, useState } from 'react';
import { X, UploadCloud, FileVideo } from 'lucide-react';
import { formatFileSize, VIDEO_TYPES } from '../../utils/constant';
import { uploadVideo } from '../../api/axios';

const MAX_SIZE = 100 * 1024 * 1024;

const UploadModal = ({ onClose }) => {
  const filePicker = useRef(null);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    if (!VIDEO_TYPES.includes(file.type)) {
      return 'Invalid file type';
    }
    if (file.size > MAX_SIZE) {
      return `Max size is ${formatFileSize(MAX_SIZE)}`;
    }
    return null;
  };

  const handleSelectFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const err = validateFile(selected);
    if (err) {
      setError(err);
      return;
    }

    setFile(selected);
    setError('');

    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select file');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await uploadVideo(formData, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });

      setFile(null);
      setTitle('');
      setDescription('');
      setUploadProgress(0);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onUploadComplete) {
        onUploadComplete(response.data.data.video);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h3 className="text-white font-bold">Upload Video</h3>
          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-white" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {!file ? (
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
              <UploadCloud className="mx-auto text-blue-500 mb-3" size={40} />
              <button
                onClick={() => filePicker.current.click()}
                className="bg-blue-600 px-4 py-2 rounded-md text-white"
              >
                Select File
              </button>

              <input
                type="file"
                ref={filePicker}
                className="hidden"
                accept="video/*"
                onChange={handleSelectFile}
              />
            </div>
          ) : (
            <div className="flex justify-between items-center bg-slate-800 p-3 rounded">
              <div>
                <p className="text-white text-sm">{file.name}</p>
                <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
              </div>
              <button onClick={() => setFile(null)} className="text-red-400">
                Remove
              </button>
            </div>
          )}

          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-slate-800 px-3 py-2 rounded text-white"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full bg-slate-800 px-3 py-2 rounded text-white"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
        <div className="p-6 flex justify-end gap-3 border-t border-slate-800">
          <button onClick={onClose} className="text-slate-400">Cancel</button>
          <button
            onClick={handleUpload}
            disabled={!file}
            className="bg-blue-600 px-5 py-2 rounded text-white disabled:opacity-50"
          >
            Start Processing
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;