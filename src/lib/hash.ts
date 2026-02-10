import crypto from 'crypto'

/**
 * Generate SHA-256 hash of a buffer
 * Used for PDF integrity verification
 */
export function sha256(data: Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Generate SHA-256 hash of a string
 */
export function sha256String(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf-8').digest('hex')
}

/**
 * Verify SHA-256 hash of a buffer
 */
export function verifyHash(data: Buffer, expectedHash: string): boolean {
  const actualHash = sha256(data)
  return actualHash === expectedHash
}
