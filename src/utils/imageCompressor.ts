import imageCompression from "browser-image-compression";

/**
 * Compress an image file before upload
 * @param {File} file - The original image file
 * @param {Object} options - Compression options (optional)
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, options = {}) => {
  try {
    // Default options
    const defaultOptions = {
      maxSizeMB: 5, // Target maximum size in MB
      maxWidthOrHeight: 1024, // Resize image proportionally
      useWebWorker: true, // Use a web worker for faster compression
      fileType: file.type, // Keep original file type
    };

    const compressionOptions = { ...defaultOptions, ...options };
    const compressedFile = await imageCompression(file, compressionOptions);

    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(
      `Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
    );

    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    return file; // fallback to original if compression fails
  }
};
