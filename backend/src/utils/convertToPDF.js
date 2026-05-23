import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";

const LIBREOFFICE_PATH = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`; // adjust if on Linux/Mac

export async function convertToPDF(inputPath) {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(inputPath);
    const cmd = `${LIBREOFFICE_PATH} --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

    console.log("⚙️ Converting with LibreOffice:", cmd);

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ LibreOffice Error:", stderr || err.message);
        return reject(err);
      }

      const pdfPath = path.join(
        outputDir,
        path.basename(inputPath, path.extname(inputPath)) + ".pdf"
      );

      setTimeout(() => {
        if (fs.existsSync(pdfPath)) {
          resolve(pdfPath);
        } else {
          reject(new Error(`Converted PDF not found at ${pdfPath}`));
        }
      }, 700);
    });
  });
}
