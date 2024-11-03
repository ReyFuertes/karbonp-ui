import { Observable } from 'rxjs';

export function convertBlobToBase64(blob: Blob): Observable<any> {
  const fileReader = new FileReader();
  const observable = new Observable(observer => {
    fileReader.onloadend = () => {
      const bytes = new Uint8Array(fileReader.result as ArrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
      }
      observer.next(binary);
      observer.complete();
    };
  });
  if (blob)
    fileReader.readAsArrayBuffer(blob);
  return observable;
}

export function convertBase64ToBlob(base64Data: string, contentType: string) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}