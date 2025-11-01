import axios from "axios";
import FormData from "form-data";

export const processOCR = async (fileUrl: string): Promise<string> => {
  const formData = new FormData();
  formData.append("apikey", process.env.OCR_SPACE_API_KEY!);
  formData.append("url", fileUrl);
  formData.append("OCREngine", "2");

  const response = await axios.post("https://api.ocr.space/parse/image", formData, {
    headers: formData.getHeaders(),
  });

  return response.data?.ParsedResults?.[0]?.ParsedText || "";
};
