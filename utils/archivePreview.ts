import previews from '~/data/archivePreviews.json'

interface ArchivePreview { src: string; pages: number }
const archivePreviews: Record<string, ArchivePreview> = previews

export const archivePreviewFor = (filePath: string): ArchivePreview | undefined => archivePreviews[filePath]
