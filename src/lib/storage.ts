import { createAdminClient } from './supabase/admin'

const CONTRACTS_BUCKET = 'contracts'

/**
 * Upload contract PDF to Supabase Storage
 * @param buffer - PDF buffer
 * @param contractId - Contract ID (used as filename)
 * @returns Storage path
 */
export async function uploadContractPdf(
  buffer: Buffer,
  contractId: string
): Promise<{ path: string; publicUrl: string }> {
  const supabase = createAdminClient()
  const fileName = `${contractId}.pdf`
  const filePath = `contracts/${fileName}`

  const { data, error } = await supabase.storage
    .from(CONTRACTS_BUCKET)
    .upload(filePath, buffer, {
      contentType: 'application/pdf',
      upsert: true, // Overwrite if exists
    })

  if (error) {
    throw new Error(`Failed to upload contract PDF: ${error.message}`)
  }

  // Get public URL (for metadata, but bucket is private)
  const {
    data: { publicUrl },
  } = supabase.storage.from(CONTRACTS_BUCKET).getPublicUrl(filePath)

  return {
    path: data.path,
    publicUrl,
  }
}

/**
 * Generate signed URL for contract download (24h expiry)
 * @param contractId - Contract ID
 * @returns Signed URL
 */
export async function getContractSignedUrl(
  contractId: string
): Promise<string> {
  const supabase = createAdminClient()
  const filePath = `contracts/${contractId}.pdf`

  const { data, error } = await supabase.storage
    .from(CONTRACTS_BUCKET)
    .createSignedUrl(filePath, 60 * 60 * 24) // 24 hours

  if (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`)
  }

  return data.signedUrl
}

/**
 * Delete contract PDF from storage
 * @param contractId - Contract ID
 */
export async function deleteContractPdf(contractId: string): Promise<void> {
  const supabase = createAdminClient()
  const filePath = `contracts/${contractId}.pdf`

  const { error } = await supabase.storage
    .from(CONTRACTS_BUCKET)
    .remove([filePath])

  if (error) {
    throw new Error(`Failed to delete contract PDF: ${error.message}`)
  }
}

/**
 * Check if contract PDF exists in storage
 * @param contractId - Contract ID
 */
export async function contractPdfExists(contractId: string): Promise<boolean> {
  const supabase = createAdminClient()
  const filePath = `contracts/${contractId}.pdf`

  const { data, error } = await supabase.storage
    .from(CONTRACTS_BUCKET)
    .list('contracts', {
      search: `${contractId}.pdf`,
    })

  if (error) {
    return false
  }

  return data && data.length > 0
}

/**
 * Get contract PDF buffer from storage
 * @param contractId - Contract ID
 */
export async function getContractPdfBuffer(
  contractId: string
): Promise<Buffer> {
  const supabase = createAdminClient()
  const filePath = `contracts/${contractId}.pdf`

  const { data, error } = await supabase.storage
    .from(CONTRACTS_BUCKET)
    .download(filePath)

  if (error) {
    throw new Error(`Failed to download contract PDF: ${error.message}`)
  }

  const arrayBuffer = await data.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
