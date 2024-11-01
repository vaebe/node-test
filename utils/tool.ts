export function formatBytesToGB(bytes: number) {
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

/**
 * 格式化字节大小为人类可读格式
 * @param bytes 字节数
 * @returns 格式化后的字符串，如 "1.25 MB"
 */
export function formatBytesToReadable(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];

  if (bytes === 0) {
    return '0.00 B';
  }

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);

  return value.toFixed(2) + ' ' + units[exponent];
}
