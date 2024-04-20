// Defines extensions where EXIF data can be present.
const EXIF_EXTENSIONS = /\.(jpg|jpeg|tiff|tif|png)$/i;

// Remove the EXIF data from a image file.
export const removeExifData = (f: File) => {
  // Check if the filename needs exif data removed.
  if (!EXIF_EXTENSIONS.test(f.name)) {
    return Promise.resolve(f);
  }

  // Strip the EXIF data using canvas.
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const img = new Image();
  img.src = URL.createObjectURL(f);
  return new Promise<File>((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        resolve(new File([blob!], f.name, { type: f.type }));
      });
    };
    img.onerror = (e) => {
      reject(e);
    };
  });
};
