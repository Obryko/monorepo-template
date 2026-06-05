import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from '@rstest/core'

import { loadExistingEnvFiles } from '../node.ts'

describe('loadExistingEnvFiles', () => {
  let dir: string
  const trackedKeys: string[] = []

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'env-test-'))
  })

  afterEach(() => {
    for (const key of trackedKeys) delete process.env[key]
    trackedKeys.length = 0
    rmSync(dir, { recursive: true, force: true })
  })

  const writeEnv = (name: string, contents: string) => {
    const path = join(dir, name)
    writeFileSync(path, contents)
    return path
  }

  const track = (key: string) => trackedKeys.push(key)

  it('loads variables from an existing env file', () => {
    const key = `ENV_TEST_BASIC_${process.pid}`
    track(key)
    const file = writeEnv('.env', `${key}=hello\n`)

    loadExistingEnvFiles([file])

    expect(process.env[key]).toBe('hello')
  })

  it('skips files that do not exist without throwing', () => {
    expect(() => loadExistingEnvFiles([join(dir, '.env.missing')])).not.toThrow()
  })

  it('respects load order: earlier files win (loadEnvFile does not overwrite)', () => {
    const key = `ENV_TEST_ORDER_${process.pid}`
    track(key)
    const first = writeEnv('.env.local', `${key}=first\n`)
    const second = writeEnv('.env', `${key}=second\n`)

    loadExistingEnvFiles([first, second])

    expect(process.env[key]).toBe('first')
  })

  it('only loads files that exist when mixed with missing ones', () => {
    const key = `ENV_TEST_MIXED_${process.pid}`
    track(key)
    const present = writeEnv('.env', `${key}=present\n`)

    loadExistingEnvFiles([join(dir, '.env.missing'), present])

    expect(process.env[key]).toBe('present')
  })
})
