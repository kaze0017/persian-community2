import { Timestamp, FieldValue } from 'firebase/firestore';
export function normalizeDate(value?: string | Timestamp | FieldValue): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return undefined; // FieldValue or others cannot be serialized here
}