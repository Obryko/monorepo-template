import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'

export function loadExistingEnvFiles(files: string[]): void {
  for (const file of files) {
    if (existsSync(file)) {
      loadEnvFile(file)
    }
  }
}
