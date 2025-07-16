import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function applyUserTheme(userId: string) {
  if (typeof window === "undefined") {
    // Make sure this runs only on client side (because it manipulates `document`)
    return;
  }

  try {
    const themeDoc = await getDoc(doc(db, "themes", userId));

    if (themeDoc.exists()) {
      const theme = themeDoc.data();

      for (const [key, value] of Object.entries(theme)) {
        if (typeof value === "string") {
          document.documentElement.style.setProperty(`--${key}`, value);
        }
      }
    }
  } catch (error) {
    console.error("Error applying user theme:", error);
  }
}
