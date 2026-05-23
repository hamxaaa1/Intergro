import React, { useState } from "react";
import axios from "axios";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import FileUploader from "./FileUploader";

import {
  Loader2,
  FileText,
  Download,
  Trash2,
  FileCode,
  FileImage,
  File as GenericFile,
  SortAsc,
} from "lucide-react";

import { toast } from "react-toastify";

import SidebarLayout from "../../components/layouts/SidebarLayout";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // FILE TYPE ICONS
  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "svg", "webp"].includes(ext)) {
      return (
        <FileImage
          size={40}
          className="text-orange-500"
        />
      );
    }

    if (["js", "html", "css", "json", "py"].includes(ext)) {
      return (
        <FileCode
          size={40}
          className="text-blue-500"
        />
      );
    }

    if (["doc", "docx", "txt"].includes(ext)) {
      return (
        <FileText
          size={40}
          className="text-blue-700"
        />
      );
    }

    return (
      <GenericFile
        size={40}
        className="text-slate-400"
      />
    );
  };

  // GENERATE THUMBNAIL
  const generateThumbnail = async (file) => {
    try {
      // IMAGE PREVIEW
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }

      // PDF PREVIEW
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();

        const pdf = await pdfjsLib
          .getDocument({ data: arrayBuffer })
          .promise;

        const page = await pdf.getPage(1);

        const viewport = page.getViewport({
          scale: 1,
        });

        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        return canvas.toDataURL("image/png");
      }

      return null;
    } catch (error) {
      console.error(
        "Thumbnail generation failed:",
        error
      );

      return null;
    }
  };

  // HANDLE UPLOAD
  const handleUpload = async (selectedFiles) => {
    setLoading(true);

    try {
      const newFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const preview = await generateThumbnail(file);

          return Object.assign(file, {
            preview,
            id: crypto.randomUUID(),
          });
        })
      );

      setFiles((prev) => [...prev, ...newFiles]);

      toast.success("Files added!");
    } catch (err) {
      console.error(err);

      toast.error("Failed to process files");
    } finally {
      setLoading(false);
    }
  };

  // REMOVE FILE
  const removeFile = (id) => {
    setFiles((prev) =>
      prev.filter((file) => file.id !== id)
    );
  };

  // DRAG REORDER
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(files);

    const [reordered] = items.splice(
      result.source.index,
      1
    );

    items.splice(
      result.destination.index,
      0,
      reordered
    );

    setFiles(items);
  };

  // SORT A-Z
  const handleAZSort = () => {
    const sorted = [...files].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setFiles(sorted);

    toast.info("Files sorted A-Z");
  };

  // MERGE FILES
  const handleMerge = async () => {
    if (files.length === 0) {
      return toast.warning("Upload files first!");
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);

      toast.info("Merging files...");

      const response = await axios.post(
        "http://localhost:5000/api/pdf/merge",
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = "merged.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      toast.success(
        "✅ Merge complete! Download started."
      );

      setFiles([]);
    } catch (err) {
      console.error(err);

      toast.error("❌ Merge failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen flex flex-col items-center p-8 bg-base-200">

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-6 text-primary flex items-center gap-2">
          <FileText className="w-8 h-8" />
          Smart PDF Merger
        </h1>

        {/* UPLOADER */}
        <FileUploader onUpload={handleUpload} />

        {/* FILE GRID */}
        {files.length > 0 && (
          <div className="w-full max-w-6xl mt-8">

            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">

              <h2 className="text-xl font-semibold">
                {files.length} Files Selected
              </h2>

              <div className="flex gap-3">

                <button
                  onClick={handleAZSort}
                  disabled={loading}
                  className="btn btn-outline btn-primary btn-sm"
                >
                  <SortAsc size={16} />
                  Sort A-Z
                </button>

                <button
                  onClick={handleMerge}
                  disabled={loading}
                  className="btn btn-success btn-sm text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Merging...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Merge & Download
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* DRAG GRID */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="grid"
                direction="horizontal"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                  >
                    {files.map((file, index) => (
                      <Draggable
                        key={file.id}
                        draggableId={file.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="group relative aspect-[3/4] bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-primary transition-all overflow-hidden"
                          >

                            {/* PREVIEW */}
                            {file.preview ? (
                              <img
                                src={file.preview}
                                alt="preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-4 text-center">
                                {getFileIcon(file.name)}

                                <span className="text-[10px] mt-3 font-black text-slate-500 uppercase tracking-wider">
                                  {
                                    file.name
                                      .split(".")
                                      .pop()
                                  }
                                </span>
                              </div>
                            )}

                            {/* INDEX */}
                            <div className="absolute top-2 left-2 bg-primary text-white text-xs w-6 h-6 flex items-center justify-center rounded-full shadow-lg z-10 font-bold">
                              {index + 1}
                            </div>

                            {/* OVERLAY */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">

                              {/* DELETE */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  removeFile(file.id);
                                }}
                                className="self-end p-1.5 bg-red-500 rounded-lg hover:bg-red-600 transition shadow-md"
                              >
                                <Trash2 size={16} />
                              </button>

                              {/* FILE INFO */}
                              <div className="bg-black/20 backdrop-blur-sm p-2 rounded">
                                <p className="text-[11px] truncate font-bold">
                                  {file.name}
                                </p>

                                <p className="text-[9px] text-gray-300">
                                  {(
                                    file.size / 1024
                                  ).toFixed(0)}{" "}
                                  KB
                                </p>
                              </div>
                            </div>

                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="mt-6 flex flex-col items-center gap-2 text-primary">
            <Loader2 className="animate-spin w-6 h-6" />

            <p className="text-sm">
              Processing your files...
            </p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}