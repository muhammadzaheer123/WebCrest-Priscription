import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

/**
 * Initialize AWS S3 client using environment variables.
 */
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Uploads a file to AWS S3 or mocks upload in local development mode.
 * 
 * @param file Express Multer file object
 * @returns Promise<string> - The uploaded file URL (real or mock)
 */
export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
  const isLocal = process.env.NODE_ENV !== "production"; // local = mock mode

  // If local dev mode: skip AWS and just return mock URL
  if (isLocal) {
    console.log("🧩 Mock upload mode active (no AWS connection).");
    const mockUrl = `http://localhost:5000/uploads/${file.filename}`;
    return Promise.resolve(mockUrl);
  }

  // --- Real S3 Upload ---
  const fileContent = fs.readFileSync(file.path);
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: `prescriptions/${Date.now()}-${path.basename(file.originalname)}`,
    Body: fileContent,
    ContentType: file.mimetype,
  };

  try {
    const uploadResult = await s3.upload(params).promise();

    // Optionally delete local file after upload
    fs.unlinkSync(file.path);

    console.log("✅ File uploaded to S3:", uploadResult.Location);
    return uploadResult.Location;
  } catch (error) {
    console.error("❌ S3 Upload Error:", error);
    throw new Error("Failed to upload file to S3");
  }
};

// export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
//   const fileContent = fs.readFileSync(file.path);
//   const params = {
//     Bucket: process.env.AWS_S3_BUCKET!,
//     Key: `prescriptions/${Date.now()}-${path.basename(file.originalname)}`,
//     Body: fileContent,
//     ContentType: file.mimetype,
//   };

//   const uploadResult = await s3.upload(params).promise();

//   // Optionally delete local file
//   fs.unlinkSync(file.path);

//   return uploadResult.Location; // public URL
// };
