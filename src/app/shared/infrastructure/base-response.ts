/**
 * Infrastructure resource contract. Mirrors how an entity is shaped on the wire.
 */
export interface BaseResource {
  id: number;
}

/**
 * Marker contract for response envelopes returned by collection endpoints.
 */
export interface BaseResponse {}
