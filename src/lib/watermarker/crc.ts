// Precomputed CRC32 table (polynomial 0xEDB88320)
const crc32Table = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  crc32Table[i] = c >>> 0
}

export function computeCRC32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ bytes[i]) & 0xff]
  }
  return (crc ^ 0xffffffff) >>> 0
}

// Precomputed CRC16-CCITT table (polynomial 0x1021)
const crc16Table = new Uint16Array(256)
for (let i = 0; i < 256; i++) {
  let curr = (i << 8) & 0xffff
  for (let j = 0; j < 8; j++) {
    if ((curr & 0x8000) !== 0) {
      curr = ((curr << 1) ^ 0x1021) & 0xffff
    } else {
      curr = (curr << 1) & 0xffff
    }
  }
  crc16Table[i] = curr
}

export function computeCRC16(bytes: Uint8Array): number {
  let crc = 0xffff
  for (let i = 0; i < bytes.length; i++) {
    const tableIndex = ((crc >>> 8) ^ bytes[i]) & 0xff
    crc = ((crc << 8) ^ crc16Table[tableIndex]) & 0xffff
  }
  return crc
}
