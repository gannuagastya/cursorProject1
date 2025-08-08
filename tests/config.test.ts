import { describe, it, expect } from 'vitest'
import nextConfig from '../next.config.mjs'

describe('next.config.mjs', () => {
  it('exports an object', () => {
    expect(typeof nextConfig).toBe('object')
  })
  it('has images.remotePatterns', () => {
    expect(Array.isArray(nextConfig.images?.remotePatterns)).toBe(true)
    expect(nextConfig.images.remotePatterns.length).toBeGreaterThan(0)
  })
})