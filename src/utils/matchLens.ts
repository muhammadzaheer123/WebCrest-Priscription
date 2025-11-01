import { PrescriptionData } from "./parsePrescription";

interface Lens {
  id: string;
  sphere: string;
  cylinder: string;
  axis: string;
}

const lensInventory: Lens[] = [
  { id: "LENS1", sphere: "-2.00", cylinder: "-0.75", axis: "180" },
  { id: "LENS2", sphere: "-1.50", cylinder: "-0.50", axis: "90" },
  // ... add more
];

export const matchLensInventory = (prescription: PrescriptionData): Lens | null => {
  const matched = lensInventory.find(
    (lens) =>
      lens.sphere === prescription.sphere &&
      lens.cylinder === prescription.cylinder &&
      lens.axis === prescription.axis
  );

  return matched || null;
};
