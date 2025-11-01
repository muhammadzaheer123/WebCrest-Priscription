import express from "express";
import multer from "multer";
import { uploadToS3 } from "../services/s3Service";
import { parsePrescriptionText } from "../utils/parsePrescription";
import { matchLensInventory } from "../utils/matchLens";
import { processOCR } from "../services/ocrService";

const router = express.Router();

// multer setup
const upload = multer({ dest: "src/uploads/" });

router.post("/ocr-process", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Step 1: upload to S3 (optional)
    const fileUrl = await uploadToS3(req.file);

    // Step 2: send file to OCR.Space
    const parsedText = await processOCR(fileUrl);

    // Step 3: extract prescription data
    const prescriptionData = parsePrescriptionText(parsedText);

    // Step 4: match against inventory
    const matchedLens = matchLensInventory(prescriptionData);

    // Step 5: (future) Save to Shopify metafields using shopifyService

    res.json({
      success: true,
      parsedText,
      prescriptionData,
      matchedLens,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "OCR processing failed",
      error: error.message,
    });
  }
});

export default router;
