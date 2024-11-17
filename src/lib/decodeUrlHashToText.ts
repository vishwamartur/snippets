import { gunzipSync, strFromU8 } from "fflate";
import { base64ToBytes } from "./base64ToBytes";

export function decodeUrlHashToText(url: string): string | null {
  // Extract the base64 part from the URL
  const base64Data = url.split("#data:application/gzip;base64,")?.[1];
  if (!base64Data) {
    return null;
  }

  // Decode base64, decompress, and convert to string
  const compressedData = base64ToBytes(base64Data);
  const decompressedData = gunzipSync(compressedData);
  return strFromU8(decompressedData);
}
