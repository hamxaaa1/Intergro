import multer from "multer";
import fs from "fs-extra";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { convertToPDF } from "../utils/convertToPDF.js";

const upload = multer({ dest: "uploads/" });

export const uploadMiddleware = upload.array("files", 10);

export const mergeFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const pdfPaths = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      let pdfPath;

      if (ext === ".pdf") pdfPath = file.path;
      else pdfPath = await convertToPDF(file.path);

      pdfPaths.push(pdfPath);
    }

    const mergedPdf = await PDFDocument.create();
    for (const pdfPath of pdfPaths) {
      const pdfBytes = await fs.readFile(pdfPath);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const mergedFilePath = path.join("uploads", `merged-${Date.now()}.pdf`);
    await fs.writeFile(mergedFilePath, mergedBytes);

    console.log("✅ Merged PDF Created:", mergedFilePath);

    res.download(mergedFilePath, "merged.pdf", async (err) => {
      if (err) console.error("❌ Download Error:", err.message);
      for (const pdf of pdfPaths) await fs.remove(pdf);
      for (const file of req.files) await fs.remove(file.path);
      await fs.remove(mergedFilePath);
      console.log("🧹 Cleaned temporary files.");
    });
  } catch (err) {
    console.error("❌ Merge Error:", err);
    res.status(500).json({
      error: "Failed to merge files",
      detail: err.message,
    });
  }
};
