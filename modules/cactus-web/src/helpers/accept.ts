// Stolen from attr-accept https://github.com/okonet/attr-accept
export default function (file: File, acceptedFiles: string | string[]): boolean {
  if (file && acceptedFiles) {
    const acceptedFilesArray = Array.isArray(acceptedFiles)
      ? acceptedFiles
      : acceptedFiles.split(',')
    const fileName = file.name || ''
    const mimeType = file.type || ''
    const baseMimeType = mimeType.replace(/\/.*$/, '')

    return acceptedFilesArray.some((type): boolean => {
      const validType = type.trim()
      if (validType.charAt(0) === '.') {
        return fileName.toLowerCase().endsWith(validType.toLowerCase())
      } else if (validType.endsWith('/*')) {
        // This is something like a image/* mime type
        return baseMimeType === validType.replace(/\/.*$/, '')
      }
      return mimeType === validType
    })
  }
  return true
}
