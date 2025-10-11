// src/app/admin/events/hooks/useImageText.ts
import { useEffect, useState } from "react";

export function useImageText(image?: File) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!image) {
      setText("");
      return;
    }
    const process = async () => {
      const formData = new FormData();
      formData.append("image", image);
      const res = await fetch("/api/process-image", { method: "POST", body: formData });
      if (res.ok) {
        const { text } = await res.json();
        setText(text || "");
      } else {
        setText("");
      }
    };
    process();
  }, [image]);

  return text;
}
