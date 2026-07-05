/**
 * Triggers a browser download for an in-memory {@link Blob}.
 *
 * @remarks
 * Shared helper used by binary-export flows (audit logs, incident reports). It
 * creates a transient object URL, clicks a synthetic anchor, and revokes the URL
 * to avoid leaking it. Kept framework-agnostic so any store can call it after
 * receiving a `Blob` from an endpoint that used `responseType: 'blob'`.
 *
 * @param blob - The binary payload returned by the API.
 * @param filename - Suggested file name (including extension) for the download.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** Maps the platform `format` query value to its downloaded file extension. */
export function exportFormatExtension(format: 'pdf' | 'xls'): string {
  return format === 'pdf' ? 'pdf' : 'xlsx';
}
