/**
 * Data compression utilities to reduce bundle size
 */

export interface CompressedCommand {
  c: string     // command
  d: string     // description
  m?: string    // mode
  e?: string    // example
  df?: string   // difficulty
  f?: string    // frequency
}

export interface ExpandedCommand {
  command: string
  description: string
  mode?: string
  example?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  frequency?: 'common' | 'rare' | 'essential'
}

// Mode mappings
const MODE_MAP: Record<string, string> = {
  'n': 'normal',
  'i': 'insert',
  'v': 'visual',
  'c': 'command',
  'x': 'visual',
  'o': 'operator-pending'
}

const MODE_MAP_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(MODE_MAP).map(([k, v]) => [v, k])
)

// Difficulty mappings
const DIFFICULTY_MAP: Record<string, string> = {
  'b': 'beginner',
  'i': 'intermediate',
  'a': 'advanced'
}

const DIFFICULTY_MAP_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(DIFFICULTY_MAP).map(([k, v]) => [v, k])
)

// Frequency mappings
const FREQUENCY_MAP: Record<string, string> = {
  'e': 'essential',
  'c': 'common',
  'r': 'rare'
}

const FREQUENCY_MAP_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(FREQUENCY_MAP).map(([k, v]) => [v, k])
)

export function compressCommand(cmd: ExpandedCommand): CompressedCommand {
  const compressed: CompressedCommand = {
    c: cmd.command,
    d: cmd.description
  }
  
  if (cmd.mode) compressed.m = MODE_MAP_REVERSE[cmd.mode] || cmd.mode
  if (cmd.example) compressed.e = cmd.example
  if (cmd.difficulty) compressed.df = DIFFICULTY_MAP_REVERSE[cmd.difficulty]
  if (cmd.frequency) compressed.f = FREQUENCY_MAP_REVERSE[cmd.frequency]
  
  return compressed
}

export function expandCommand(cmd: CompressedCommand): ExpandedCommand {
  const expanded: ExpandedCommand = {
    command: cmd.c,
    description: cmd.d
  }
  
  if (cmd.m) expanded.mode = MODE_MAP[cmd.m] || cmd.m
  if (cmd.e) expanded.example = cmd.e
  if (cmd.df) expanded.difficulty = DIFFICULTY_MAP[cmd.df] as 'beginner' | 'intermediate' | 'advanced'
  if (cmd.f) expanded.frequency = FREQUENCY_MAP[cmd.f] as 'common' | 'rare' | 'essential'
  
  return expanded
}

export function compressCommandSet(commands: Record<string, ExpandedCommand[]>): Record<string, CompressedCommand[]> {
  const compressed: Record<string, CompressedCommand[]> = {}
  
  for (const [category, cmdList] of Object.entries(commands)) {
    compressed[category] = cmdList.map(compressCommand)
  }
  
  return compressed
}

export function expandCommandSet(commands: Record<string, CompressedCommand[]>): Record<string, ExpandedCommand[]> {
  const expanded: Record<string, ExpandedCommand[]> = {}
  
  for (const [category, cmdList] of Object.entries(commands)) {
    expanded[category] = cmdList.map(expandCommand)
  }
  
  return expanded
}