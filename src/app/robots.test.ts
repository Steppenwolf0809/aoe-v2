import { describe, it, expect } from 'vitest'
import robots from './robots'

describe('robots.txt', () => {
  it('permite /api/cotizar aunque /api/ siga bloqueado', () => {
    const { rules } = robots()
    const regla = Array.isArray(rules) ? rules[0] : rules
    expect(regla.allow).toContain('/api/cotizar')
    expect(regla.disallow).toContain('/api/')
  })
})
