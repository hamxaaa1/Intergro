import React, { useCallback } from "react";
import { UploadCloud } from "lucide-react";

export default function FileUploader({ onUpload }) {
  const handleFiles = useCallback(
    (e) => {
      const files = Array.from(e.target.files || e.dataTransfer.files);

      if (files.length > 0) {
        onUpload(files);
      }
    },
    [onUpload]
  );

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      onDrop={handleFiles}
      onDragOver={handleDragOver}
      className="w-full max-w-4xl"
    >
      <div className="border-2 border-dashed border-primary/30 rounded-2xl p-10 text-center bg-base-100 hover:bg-base-200 transition-all cursor-pointer shadow-sm">
        
        <div className="flex justify-center mb-4">
          <UploadCloud className="w-14 h-14 text-primary" />
        </div>

        <h2 className="text-xl font-bold text-base-content mb-2">
          Drag & Drop Files
        </h2>

        <p className="text-base-content/60 mb-6">
          Upload PDFs, images, docs and more
        </p>

        <label className="btn btn-primary px-6">
          Choose Files
          <input
            type="file"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}