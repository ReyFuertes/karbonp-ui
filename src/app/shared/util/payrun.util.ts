import { convertBytesToPdf } from "./document.util";

export const processPayrunDownload = (result: any, fileName: string, type: string = 'text/pdf'): void => {
  const windowNavigator = (window.navigator as any);
  if (windowNavigator?.msSaveOrOpenBlob)
    windowNavigator.msSaveOrOpenBlob(new Blob([result], { type: type }), fileName);
  else
    convertBytesToPdf(result?.file?.fileContents, fileName);
}