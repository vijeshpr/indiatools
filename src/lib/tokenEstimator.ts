export interface TokenEstimateResult {
  charCount: number
  wordCount: number
  estimatedTokens: number
  scriptBreakdown: {
    latin: number
    indic: number
    cjk: number
    other: number
    whitespace: number
  }
}

/**
 * Unicode-aware Token Estimator.
 * 
 * Heuristic calibration based on Byte-Pair Encoding (BPE / tiktoken / SentencePiece):
 * - Standard English/Latin text: ~4 characters per token (or ~0.75 words per token)
 * - Indic scripts (Devanagari, Malayalam, Tamil, Telugu, Kannada, Bengali, Gujarati, Gurmukhi, Oriya):
 *   Due to complex conjuncts and Unicode UTF-8 multi-byte encoding in standard tokenizers,
 *   Indic text typically yields ~1.2 to 2.2 characters per token.
 * - CJK (Chinese, Japanese, Korean): ~1.0 to 1.5 characters per token.
 * - Code & JSON: higher token density due to syntax characters, punctuation, and camelCase/snake_case splits (~3.2 chars/token).
 * - Numbers and special symbols: typically 1 token per 2-3 digits or isolated symbols.
 */
export function estimateTokens(text: string): TokenEstimateResult {
  if (!text || text.length === 0) {
    return {
      charCount: 0,
      wordCount: 0,
      estimatedTokens: 0,
      scriptBreakdown: { latin: 0, indic: 0, cjk: 0, other: 0, whitespace: 0 },
    }
  }

  const charCount = text.length
  // Word count using Unicode word boundary
  const words = text.trim().split(/\s+/).filter(Boolean)
  const wordCount = text.trim() === '' ? 0 : words.length

  let latinChars = 0
  let indicChars = 0
  let cjkChars = 0
  let whitespaceChars = 0
  let punctuationAndSymbols = 0
  let digitChars = 0
  let otherChars = 0

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)

    // Whitespace
    if (code === 32 || code === 9 || code === 10 || code === 13) {
      whitespaceChars++
    }
    // Basic Latin alphabet (A-Z, a-z)
    else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      latinChars++
    }
    // Digits (0-9)
    else if (code >= 48 && code <= 57) {
      digitChars++
    }
    // Indic Unicode Blocks:
    // 0900–097F: Devanagari (Hindi, Marathi, Sanskrit)
    // 0980–09FF: Bengali / Assamese
    // 0A00–0A7F: Gurmukhi (Punjabi)
    // 0A80–0AFF: Gujarati
    // 0B00–0B7F: Oriya
    // 0B80–0BFF: Tamil
    // 0C00–0C7F: Telugu
    // 0C80–0CFF: Kannada
    // 0D00–0D7F: Malayalam
    else if (code >= 0x0900 && code <= 0x0D7F) {
      indicChars++
    }
    // CJK Unified Ideographs & Hangul
    else if ((code >= 0x4E00 && code <= 0x9FFF) || (code >= 0xAC00 && code <= 0xD7AF)) {
      cjkChars++
    }
    // ASCII Punctuation and symbols
    else if ((code >= 33 && code <= 47) || (code >= 58 && code <= 64) || (code >= 91 && code <= 96) || (code >= 123 && code <= 126)) {
      punctuationAndSymbols++
    }
    else {
      otherChars++
    }
  }

  // Detect code/JSON content heuristics (high presence of braces, brackets, quotes, indentation)
  const isLikelyCodeOrJson =
    (text.includes('{') && text.includes('}')) ||
    (text.includes('function') || text.includes('const ') || text.includes('import ')) ||
    punctuationAndSymbols / Math.max(1, charCount) > 0.15

  // Weightings calibrated against real OpenAI cl100k / o200k & Gemini tokenizers
  let estimatedTokens = 0

  // 1. Latin tokens: ~4 chars per token, with slight adjustment for code
  if (isLikelyCodeOrJson) {
    estimatedTokens += latinChars / 3.3
  } else {
    estimatedTokens += latinChars / 4.0
  }

  // 2. Indic tokens: ~1.6 characters per token on average (syllables / aksharas)
  estimatedTokens += indicChars / 1.6

  // 3. CJK tokens: ~1.2 characters per token
  estimatedTokens += cjkChars / 1.2

  // 4. Digits: ~2.5 digits per token
  estimatedTokens += digitChars / 2.5

  // 5. Punctuation / symbols: code symbols often tokenize individually or in pairs (~1.5 per token)
  estimatedTokens += punctuationAndSymbols / 1.5

  // 6. Whitespace: runs of whitespace in BPE are merged into subsequent tokens or compressed
  estimatedTokens += whitespaceChars / 6.0

  // 7. Emojis and other Unicode: typically 2 to 3 tokens per emoji due to multi-byte sequences
  estimatedTokens += otherChars * 1.5

  // Round up to integer, minimum 1 token if non-empty text
  const finalTokens = Math.max(1, Math.ceil(estimatedTokens))

  return {
    charCount,
    wordCount,
    estimatedTokens: finalTokens,
    scriptBreakdown: {
      latin: latinChars,
      indic: indicChars,
      cjk: cjkChars,
      other: otherChars + punctuationAndSymbols + digitChars,
      whitespace: whitespaceChars,
    },
  }
}
