export interface TocItem {
  id: string
  text: string
  level: number
}

function stripHtmlTags(value: string) {
  return value.replace(/<[^>]*>/g, '')
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function slugifyHeading(text: string) {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') || 'seccion'
  )
}

function createUniqueId(baseId: string, seenIds: Map<string, number>) {
  const count = seenIds.get(baseId) ?? 0
  seenIds.set(baseId, count + 1)
  return count === 0 ? baseId : `${baseId}-${count + 1}`
}

function collectHeadings(content: string) {
  const headingRegex = /<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi
  const headings: Array<{ level: number; attrs: string; innerHtml: string; fullMatch: string }> = []
  let match: RegExpExecArray | null = headingRegex.exec(content)

  while (match) {
    const level = Number(match[1])
    headings.push({
      level,
      attrs: match[2] ?? '',
      innerHtml: match[3] ?? '',
      fullMatch: match[0],
    })
    match = headingRegex.exec(content)
  }

  return headings
}

export function extractHeadingsFromHtml(content: string): TocItem[] {
  const headings = collectHeadings(content)
  const seenIds = new Map<string, number>()

  return headings.map((heading) => {
    const text = decodeEntities(stripHtmlTags(heading.innerHtml)).trim()
    const baseId = slugifyHeading(text)

    return {
      id: createUniqueId(baseId, seenIds),
      text,
      level: heading.level,
    }
  })
}

export function injectHeadingIds(content: string) {
  const headings = collectHeadings(content)

  if (!headings.length) {
    return content
  }

  const seenIds = new Map<string, number>()
  let nextContent = content

  for (const heading of headings) {
    const cleanText = decodeEntities(stripHtmlTags(heading.innerHtml)).trim()
    const baseId = slugifyHeading(cleanText)
    const id = createUniqueId(baseId, seenIds)
    const attrsWithoutId = heading.attrs.replace(/\s+id=(["']).*?\1/i, '')
    const attrs = attrsWithoutId.trim().length > 0 ? ` ${attrsWithoutId.trim()}` : ''
    const replacement = `<h${heading.level}${attrs} id="${id}">${heading.innerHtml}</h${heading.level}>`
    nextContent = nextContent.replace(heading.fullMatch, replacement)
  }

  return nextContent
}

export function formatBlogDate(rawDate: string | null | undefined) {
  if (!rawDate) {
    return ''
  }

  const parsedDate = new Date(rawDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}
