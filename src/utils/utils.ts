/**
 * Removes the key from a line of text.
 * Example: 'Attacks per Second: 1.5' -> '1.5'
 */
export const removeKey = (line?: string): string | undefined =>
  line?.split(':')[1].trim()

/**
 * Removes the suffix from a line of text.
 * Example: '12-15 (Augmented)' -> '12-15'
 */
export const removeSuffix = (line?: string): string | undefined =>
  line?.split(' ')[0]

/**
 * Derives the item name and type from the text area input.
 */
export const findItemName = (
  textAreaValue: string
): [string, string] | null => {
  const lines = textAreaValue.split('\n')
  if (lines.length < 4) return null

  return [lines[2], lines[3]]
}
