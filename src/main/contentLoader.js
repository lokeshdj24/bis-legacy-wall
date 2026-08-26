import { app, protocol, net } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { existsSync, readFileSync } from 'fs'
import XLSX from 'xlsx'

const CONTENT_FOLDER = 'legacy_wall'
const EXCEL_FILE = 'legacy-wall-content.xlsx'
const SCHEME = 'legacyimg'

export function getContentRoot() {
  return join(app.getPath('documents'), CONTENT_FOLDER)
}

export function getImagesDir() {
  return join(getContentRoot(), 'images')
}

export function getExcelPath() {
  return join(getContentRoot(), EXCEL_FILE)
}

function sheetToObjects(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName]
  if (!sheet) return []
  return XLSX.utils.sheet_to_json(sheet, { defval: '' })
}

function resolveImageUrl(filename) {
  if (!filename || typeof filename !== 'string') return ''
  const trimmed = filename.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed
  // Custom protocol → Documents/legacy_wall/images/<filename> (dummy host required with standard:true)
  return `${SCHEME}://local/${encodeURIComponent(trimmed)}`
}

/**
 * Reads Cards + Slides from Documents/legacy_wall/legacy-wall-content.xlsx
 * and shapes them for CardList + Gallery.
 */
export function loadLegacyContent() {
  const excelPath = getExcelPath()
  if (!existsSync(excelPath)) {
    return {
      ok: false,
      error: `Content file not found:\n${excelPath}\n\nCreate Documents\\legacy_wall\\legacy-wall-content.xlsx`,
      cards: [],
      contentRoot: getContentRoot()
    }
  }

  const workbook = XLSX.read(readFileSync(excelPath), { type: 'buffer' })
  const cardRows = sheetToObjects(workbook, 'Cards')
  const slideRows = sheetToObjects(workbook, 'Slides')

  const cards = cardRows
    .map((row) => {
      const cardId = Number(row.card_id)
      const slidesForCard = slideRows
        .filter((s) => Number(s.card_id) === cardId)
        .map((s) => ({
          slideId: Number(s.slide_id) || 0,
          year: Number(s.year),
          sortOrder: Number(s.sort_order) || 0,
          eyebrow: String(s.eyebrow || '').trim(),
          title: String(s.title || '').trim(),
          description: String(s.description || '').trim(),
          image: resolveImageUrl(String(s.image || ''))
        }))
        .sort((a, b) => a.year - b.year || a.sortOrder - b.sortOrder)

      const yearMap = new Map()
      for (const slide of slidesForCard) {
        if (!yearMap.has(slide.year)) yearMap.set(slide.year, [])
        yearMap.get(slide.year).push(slide)
      }

      const yearGroups = [...yearMap.entries()]
        .sort(([a], [b]) => a - b)
        .map(([year, slides]) => ({ year, slides }))

      return {
        cardId,
        sortOrder: Number(row.sort_order) || 0,
        title: String(row.title || '').trim(),
        era: String(row.era || '').trim(),
        image: resolveImageUrl(String(row.image || '')),
        yearGroups
      }
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return {
    ok: true,
    error: null,
    cards,
    contentRoot: getContentRoot()
  }
}

/** Register legacyimg:// so renderer can load files from Documents/legacy_wall/images */
export function registerLegacyImageProtocol() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        bypassCSP: true,
        stream: true
      }
    }
  ])
}

export function handleLegacyImageProtocol() {
  protocol.handle(SCHEME, (request) => {
    try {
      const { pathname } = new URL(request.url)
      const filename = decodeURIComponent(pathname.replace(/^\/+/, ''))
      const filePath = join(getImagesDir(), filename)
      if (!filename || !existsSync(filePath)) {
        return new Response('Not found', { status: 404 })
      }
      return net.fetch(pathToFileURL(filePath).href)
    } catch (err) {
      console.error('legacyimg protocol error', err)
      return new Response('Error', { status: 500 })
    }
  })
}
