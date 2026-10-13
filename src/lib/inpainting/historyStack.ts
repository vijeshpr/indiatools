export class MaskHistoryManager {
  private undoStack: ImageData[] = []
  private redoStack: ImageData[] = []
  private maxDepth: number

  constructor(maxDepth: number = 20) {
    this.maxDepth = maxDepth
  }

  push(maskData: ImageData): void {
    // Clone ImageData to prevent mutation
    const clone = new ImageData(
      new Uint8ClampedArray(maskData.data),
      maskData.width,
      maskData.height
    )
    this.undoStack.push(clone)
    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift()
    }
    this.redoStack = [] // clear redo stack on new action
  }

  undo(currentMask: ImageData): ImageData | null {
    if (this.undoStack.length === 0) return null

    // Push current state to redo
    const currentClone = new ImageData(
      new Uint8ClampedArray(currentMask.data),
      currentMask.width,
      currentMask.height
    )
    this.redoStack.push(currentClone)

    const previous = this.undoStack.pop()!
    return previous
  }

  redo(currentMask: ImageData): ImageData | null {
    if (this.redoStack.length === 0) return null

    // Push current to undo
    const currentClone = new ImageData(
      new Uint8ClampedArray(currentMask.data),
      currentMask.width,
      currentMask.height
    )
    this.undoStack.push(currentClone)

    const next = this.redoStack.pop()!
    return next
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0
  }

  get undoCount(): number {
    return this.undoStack.length
  }

  clear(): void {
    this.undoStack = []
    this.redoStack = []
  }
}
