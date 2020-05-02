//=== Util ===
import * as fs from 'fs';

export function fileExists(filePath: string) {
  try {
    let stat = fs.statSync(filePath);
    return stat.isFile();
  } catch (err) {
    return false;
  }
}

export function dirExists(filePath: string) {
  try {
    let stat = fs.statSync(filePath);
    return stat.isDirectory();
  } catch (err) {
    return false;
  }
}

export function stripQuotes(s: string): string {
  return s.substr(1, s.length - 2);
}
