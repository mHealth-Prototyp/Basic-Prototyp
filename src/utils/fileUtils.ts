/**
 * fileUtils.ts
 *
 * Provides helper methods concerning files, e.g. converting binary to Base64.
 */

/**
 * Converts a file to the Base64 format, which is necessary
 * for uploading it to the EPD playground.
 * @param file       - the file to convert
 * @returns          - a Promise that resolves to a String with the file encoded
 *                     in Base64 or rejects if conversion does not work.
 */
export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file) {
      // FileReader function for read the file.
      const reader = new FileReader();

      // Onload of file read the file content
      reader.onload = function () {
        const input = reader.result as string;
        if (input.indexOf(';base64,') > -1) {
          return resolve(input.split(';base64,')[1]);
        } else {
          return resolve(btoa(reader.result as string));
        }
      };

      reader.onerror = function () {
        console.log(reader.error);
      };
      // Convert data to base64
      reader.readAsDataURL(file);
    } else {
      return reject('No file.');
    }
  });
}
