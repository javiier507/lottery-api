import { describe, expect, it } from 'vitest';

import { getMaxAge } from '../src/utils/cache';

describe('max age', () => {
  it('when is earlier than 20:00 utc', () => {
    const result = getMaxAge(new Date('2024-12-15T19:42:23.031Z'))
    expect(result.limitDate.getUTCHours()).toBe(20)
    expect(result.limitDate.getUTCMinutes()).toBe(30)
    expect(result.seconds).toBe(2880) //  48 minutes
  })

  it('when is between 20:00 utc and 20:30 utc', () => {
    const result = getMaxAge(new Date('2024-12-15T20:20:23.031Z'))
    expect(result.limitDate.getUTCHours()).toBe(20)
    expect(result.limitDate.getUTCMinutes()).toBe(30)
    expect(result.seconds).toBe(600)  //  10 minutos
  })

  it('when is between 20:30 utc and 21:00 utc', () => {
    const result = getMaxAge(new Date('2024-12-15T20:32:23.031Z'))
    expect(result.limitDate.getUTCHours()).toBe(20)
    expect(result.limitDate.getUTCMinutes()).toBe(34)
    expect(result.seconds).toBe(120)  //  2 minutos
  })

  it('when is later than 20:00 utc', () => {
    const result = getMaxAge(new Date('2024-12-15T21:02:23.031Z'))
    expect(result.limitDate.getUTCDate()).toBe(16)
    expect(result.limitDate.getUTCHours()).toBe(20)
    expect(result.limitDate.getUTCMinutes()).toBe(30)
    expect(result.seconds).toBe(84480)  //  23 horas
  })
})
