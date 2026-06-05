import { describe, expect, it } from '@rstest/core'
import { cn } from '../lib/utils.ts'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('deduplicates tailwind classes (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('filters falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, 'baz')).toBe('foo baz')
  })
})
