import { ChangeEvent, useRef, useState } from "react";

import { useEditor } from "../../../../context/LexicalContext";
import ImageIcon from "../../../../icons/toolbar/image.svg";
import Button from "../../../controls/Button";
import PreviewImageModal from "./PreviewImageModal";
import "./styles.scss";

export const MAX_WIDTH = 500;
export const MAX_HEIGHT = 400;

export const ImageButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { editor } = useEditor();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<{
    url: string;
    width: number;
    height: number;
    alt: string;
  } | null>(null);

  const convertToWebP = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {

        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            } else {
              reject(new Error("Canvas to Blob conversion failed"));
            }
          },
          "image/webp",
          0.8
        );
      };

      img.onerror = () => reject(new Error("Image loading failed"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      // Проверяем тип файла
      if (!file.type.match("image.*")) {
        throw new Error("Please select an image file");
      }

      // Проверяем поддержку WebP
      const isWebPSupported =
        document
          .createElement("canvas")
          .toDataURL("image/webp")
          .indexOf("data:image/webp") === 0;

      let imageUrl: string;

      // Получаем оригинальные размеры изображения
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          resolve();
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      if (isWebPSupported) {
        // Конвертируем в WebP
        imageUrl = await convertToWebP(file);
      } else {
        // Fallback - используем оригинальное изображение
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      setImagePreview({
        url: imageUrl,
        width: img.width,
        height: img.height,
        alt: "",
      });
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing image: " + (error as Error).message);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleInsertImage = () => {

    editor.triggerHandleImageInsert(
      imagePreview?.url || '',
      `${imagePreview?.width}px`,
      `${imagePreview?.height}px`,
      imagePreview?.alt || "Контент"
    );
   setImagePreview(null);
  };

  const handleUpdate = (newWidth: number, newHeight: number, alt: string) => {
    setImagePreview((prev) =>
      prev
        ? {
            ...prev,
            width: newWidth,
            height: newHeight,
            alt: alt,
          }
        : null
    );
  };
  return (
    <>
      <Button
        Icon={ImageIcon}
        className="image__button"
        theme="text"
        isPartSelect
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        title={isLoading ? "Processing image..." : "Insert image"}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: "none" }}
      />
      <PreviewImageModal
        onInsert={handleInsertImage}
        isOpen={Boolean(imagePreview)}
        onClose={() => {
          setImagePreview(null);
        }}
        onUpdate={handleUpdate}
        imagePreview={imagePreview}
      />
    </>
  );
};
