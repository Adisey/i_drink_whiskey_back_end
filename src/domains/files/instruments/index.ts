import * as sharp from 'sharp';

export const fileNameOnly = (fileName: string): string => {
  const arr = fileName.split('.');
  arr.length = arr.length - 1;
  return arr.join('.');
};

export const asyncWebpConvert = async (file: string): Promise<string> => {
  const output = fileNameOnly(file) + '.webp';
  try {
    await sharp(file).webp().toFile(output);
    return output;
  } catch (e) {
    console.warn(e);
    return '';
  }
};

type IFileType = 'image';

export const checkMimeType = (mimetype: string, type: IFileType): boolean => {
  return mimetype.includes(`${type}/`);
};
