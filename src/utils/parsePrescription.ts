export interface PrescriptionData {
  sphere?: string;
  cylinder?: string;
  axis?: string;
  add?: string;
}

export const parsePrescriptionText = (text: string): PrescriptionData => {
  const sphere = text.match(/sphere[:\s]*([+-]?\d+(\.\d+)?)/i)?.[1];
  const cylinder = text.match(/cylinder[:\s]*([+-]?\d+(\.\d+)?)/i)?.[1];
  const axis = text.match(/axis[:\s]*(\d{1,3})/i)?.[1];
  const add = text.match(/add[:\s]*([+-]?\d+(\.\d+)?)/i)?.[1];

  return { sphere, cylinder, axis, add };
};
