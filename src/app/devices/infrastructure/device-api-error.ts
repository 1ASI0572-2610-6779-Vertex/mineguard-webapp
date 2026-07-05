/**
 * Normalized error surfaced by {@link SensorsApiEndpoint}.
 *
 * @remarks
 * The shared `handleError` helper collapses every failure into a plain
 * `Error(message)`, discarding the HTTP status. Device registration needs the
 * status to drive distinct UX (400 / 404 / 409 / 401 / 403), so this endpoint
 * rethrows a typed error that keeps both the `status` and the backend `message`
 * (the API returns conflicts in the `message` field of the error body).
 */
export interface DeviceApiError {
  status: number;
  /** Backend-provided message (`error.message`), when present. */
  message: string;
}

/** Type guard used by the store to distinguish device API errors. */
export function isDeviceApiError(value: unknown): value is DeviceApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as DeviceApiError).status === 'number'
  );
}
