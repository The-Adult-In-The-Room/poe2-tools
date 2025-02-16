import { TESTDATA } from 'data/testData'
import {
  convertRangeText,
  findElementalDamageValues,
  findItemName,
  findStatValues,
  handleDpsCalculations,
  removeKey,
  removeSuffix,
  setMinMax,
} from './utils'

describe('removeKey', () => {
  test('should remove {key:} from the string', () => {
    expect(removeKey(TESTDATA.APS_LINE)).toBe('1.5')
  })

  test('should leave suffixes in the string', () => {
    expect(removeKey(TESTDATA.ELEMENTAL_DAMAGE_LINE)).toBe('2-5 (augmented), 5-14 (augmented), 14-76 (augmented)')
  })

  test('should trim whitespace from the string', () => {
    expect(removeKey(TESTDATA.APS_LINE + ' ')).toBe('1.5')
  })
})

describe('removeSuffix', () => {
  test('should remove the suffix from the string', () => {
    expect(removeSuffix(TESTDATA.SUFFIX_LINE)).toBe('2-5')
  })
})

describe('convertRangeText', () => {
  test('should convert a range of values to a string', () => {
    expect(convertRangeText(TESTDATA.RANGE_LINE)).toBe('3-150')
  })

  test('should return undefined if no range is found', () => {
    expect(convertRangeText('8 Lightning Damage')).toBe(undefined)
  })

  test('should handle empty string input', () => {
    expect(convertRangeText('')).toBe(undefined)
  })
})

describe('findItemName', () => {
  test('should return the item name and type from the text area input', () => {
    expect(findItemName(TESTDATA.FULL_ITEMS.THREE_ELEMENTAL)).toEqual(['Corpse Mast', 'Crackling Quarterstaff'])
  })

  test('should return null if the text area input is too short', () => {
    const textAreaValue = 'Item Name\nItem Type'
    expect(findItemName(textAreaValue)).toBe(null)
  })
})

describe('findElementalDamageValues', () => {
  test('should return an array of elemental damage values for a weapon with all 3 elements', () => {
    const lines = TESTDATA.FULL_ITEMS.THREE_ELEMENTAL.split('\n')
    expect(findElementalDamageValues(lines)).toEqual(['2-5', '5-14', '14-76'])
  })

  test('should return an array of elemental damage values for a weapon with 2 elements', () => {
    const lines = TESTDATA.FULL_ITEMS.TWO_ELEMENTAL_FIRE_AND_LIGHTNING.split('\n')
    expect(findElementalDamageValues(lines)).toEqual(['2-5', '14-76'])
  })

  test('should return undefined if no elemental damage line is found', () => {
    const lines = TESTDATA.FULL_ITEMS.SINGLE_ELEMENT_LIGHTNING.split('\n')
    expect(findElementalDamageValues(lines)).toBe(undefined)
  })
})

describe('setMinMax', () => {
  test('should set the min and max values for a given key in the stats map', () => {
    const statsMap = new Map<string, string>()
    setMinMax('physical', '12-15', statsMap)
    expect(statsMap).toEqual(
      new Map([
        ['physicalMin', '12'],
        ['physicalMax', '15'],
      ])
    )
  })
})

describe('findStatValues', () => {
  test('should return an object of stat values an item with combined elemental damage', () => {
    const lines = TESTDATA.FULL_ITEMS.THREE_ELEMENTAL.split('\n')
    expect(findStatValues(lines)).toEqual({
      aps: '1.40',
      coldMax: '14',
      coldMin: '5',
      fireMax: '5',
      fireMin: '2',
      lightningMax: '76',
      lightningMin: '14',
    })
  })

  test('runes are considered in the results', () => {
    const lines = TESTDATA.FULL_ITEMS.THREE_ELEMENTAL_WITH_RUNE.split('\n')
    expect(findStatValues(lines)).toEqual({
      aps: '1.40',
      coldMax: '14',
      coldMin: '5',
      fireMax: '5',
      fireMin: '2',
      lightningMax: '116',
      lightningMin: '16',
    })
  })

  test('should correctly identify the elements values for an item with only fire and lightning elemental damages', () => {
    const lines = TESTDATA.FULL_ITEMS.TWO_ELEMENTAL_FIRE_AND_LIGHTNING.split('\n')
    expect(findStatValues(lines)).toEqual({
      aps: '1.40',
      lightningMax: '76',
      lightningMin: '14',
      fireMax: '5',
      fireMin: '2',
    })
  })

  test('should correctly identify the elements values for an item with only fire and cold elemental damages', () => {
    const lines = TESTDATA.FULL_ITEMS.TWO_ELEMENTAL_FIRE_AND_COLD.split('\n')

    expect(findStatValues(lines)).toEqual({
      aps: '1.40',
      coldMax: '76',
      coldMin: '14',
      fireMax: '5',
      fireMin: '2',
    })
  })

  test('should correctly identify the elements values for an item with only lightning and cold elemental damages', () => {
    const lines = TESTDATA.FULL_ITEMS.TWO_ELEMENTAL_LIGHTNING_AND_COLD.split('\n')
    expect(findStatValues(lines)).toEqual({
      aps: '1.40',
      coldMax: '5',
      coldMin: '2',
      lightningMax: '76',
      lightningMin: '14',
    })
  })

  test('should correctly identify the elements values for an item with only fire elemental damage', () => {
    const lines = TESTDATA.FULL_ITEMS.SINGLE_ELEMENT_FIRE.split('\n')
    expect(findStatValues(lines)).toEqual({
      aps: '1.40',
      fireMax: '54',
      fireMin: '13',
    })
  })

  test('should correctly identify the elements values for an item with only cold elemental damage', () => {
    const lines = TESTDATA.FULL_ITEMS.SINGLE_ELEMENT_COLD.split('\n')
    expect(findStatValues(lines)).toEqual({
      aps: '1.40',
      coldMax: '54',
      coldMin: '13',
    })
  })

  test('should correctly identify the elements values for an item with only lightning elemental damage', () => {
    const lines = TESTDATA.FULL_ITEMS.SINGLE_ELEMENT_LIGHTNING.split('\n')
    expect(findStatValues(lines)).toEqual({
      aps: '1.40',
      lightningMax: '54',
      lightningMin: '13',
    })
  })

  test('should safely ignore a damage type it cant convert to a range', () => {
    const lines = TESTDATA.FULL_ITEMS.BAD_ITEM.split('\n')
    expect(findStatValues(lines)).toEqual({
      aps: '1.40',
      coldMax: '5',
      coldMin: '2',
    })
  })
})

describe('handleDpsCalculations', () => {
  test('should default to aps of 1 if no aps is provided', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.NO_APS)).toStrictEqual({
      chaos: {
        dps: 0,
        max: 0,
        min: 0,
      },
      cold: {
        dps: 0,
        max: 0,
        min: 0,
      },
      fire: {
        dps: 0,
        max: 0,
        min: 0,
      },
      lightning: {
        dps: 0,
        max: 0,
        min: 0,
      },
      physical: {
        dps: 9.5,
        max: 14,
        min: 5,
      },
      totalDps: 9.5,
      totalElementalDps: 0,
    })
  })

  test('should return the DPS for an item with only three types of elemental damage', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.THREE_ELEMENTAL)).toStrictEqual({
      chaos: {
        dps: 0,
        max: 0,
        min: 0,
      },
      cold: {
        dps: 13.3,
        max: 14,
        min: 5,
      },
      fire: {
        dps: 4.9,
        max: 5,
        min: 2,
      },
      lightning: {
        dps: 63,
        max: 76,
        min: 14,
      },
      physical: {
        dps: 0,
        max: 0,
        min: 0,
      },
      totalDps: 81.2,
      totalElementalDps: 81.2,
    })
  })

  test('should return the DPS for an item with only two types of elemental damage (Fire + Lightning)', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.TWO_ELEMENTAL_FIRE_AND_LIGHTNING)).toStrictEqual({
      chaos: {
        dps: 0,
        max: 0,
        min: 0,
      },
      cold: {
        dps: 0,
        max: 0,
        min: 0,
      },
      fire: {
        dps: 4.9,
        max: 5,
        min: 2,
      },
      lightning: {
        dps: 63,
        max: 76,
        min: 14,
      },
      physical: {
        dps: 0,
        max: 0,
        min: 0,
      },
      totalDps: 67.9,
      totalElementalDps: 67.9,
    })
  })

  test('should return the DPS for an item with only two types of elemental damage (Fire + Cold)', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.TWO_ELEMENTAL_FIRE_AND_COLD)).toStrictEqual({
      chaos: {
        dps: 0,
        max: 0,
        min: 0,
      },
      cold: {
        dps: 63,
        max: 76,
        min: 14,
      },
      fire: {
        dps: 4.9,
        max: 5,
        min: 2,
      },
      lightning: {
        dps: 0,
        max: 0,
        min: 0,
      },
      physical: {
        dps: 0,
        max: 0,
        min: 0,
      },
      totalDps: 67.9,
      totalElementalDps: 67.9,
    })
  })

  test('should return the DPS for an item with only two types of elemental damage (Lightning + Cold)', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.TWO_ELEMENTAL_LIGHTNING_AND_COLD)).toStrictEqual({
      chaos: {
        dps: 0,
        max: 0,
        min: 0,
      },
      cold: {
        dps: 4.9,
        max: 5,
        min: 2,
      },
      fire: {
        dps: 0,
        max: 0,
        min: 0,
      },
      lightning: {
        dps: 63,
        max: 76,
        min: 14,
      },
      physical: {
        dps: 0,
        max: 0,
        min: 0,
      },
      totalDps: 67.9,
      totalElementalDps: 67.9,
    })
  })

  test('should return the DPS for an item with only one type of elemental damage (Fire)', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.SINGLE_ELEMENT_FIRE)).toStrictEqual({
      chaos: {
        dps: 0,
        max: 0,
        min: 0,
      },
      cold: {
        dps: 0,
        max: 0,
        min: 0,
      },
      fire: {
        dps: 46.9,
        max: 54,
        min: 13,
      },
      lightning: {
        dps: 0,
        max: 0,
        min: 0,
      },
      physical: {
        dps: 0,
        max: 0,
        min: 0,
      },
      totalDps: 46.9,
      totalElementalDps: 46.9,
    })
  })

  test('should return the DPS for an item with only one type of elemental damage (Cold)', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.SINGLE_ELEMENT_COLD)).toStrictEqual({
      chaos: {
        dps: 0,
        max: 0,
        min: 0,
      },
      cold: {
        dps: 67.9,
        max: 92,
        min: 5,
      },
      fire: {
        dps: 0,
        max: 0,
        min: 0,
      },
      lightning: {
        dps: 0,
        max: 0,
        min: 0,
      },
      physical: {
        dps: 0,
        max: 0,
        min: 0,
      },
      totalDps: 67.9,
      totalElementalDps: 67.9,
    })
  })
  test('should return the DPS for an item with only one type of elemental damage (Lightning)', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.SINGLE_ELEMENT_LIGHTNING)).toStrictEqual({
      chaos: {
        dps: 0,
        max: 0,
        min: 0,
      },
      cold: {
        dps: 0,
        max: 0,
        min: 0,
      },
      fire: {
        dps: 0,
        max: 0,
        min: 0,
      },
      lightning: {
        dps: 18.9,
        max: 25,
        min: 2,
      },
      physical: {
        dps: 0,
        max: 0,
        min: 0,
      },
      totalDps: 18.9,
      totalElementalDps: 18.9,
    })
  })

  test('should return the DPS for an item with only physical damage', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.ONLY_PHYSICAL)).toStrictEqual({
      chaos: {
        dps: 0,
        max: 0,
        min: 0,
      },
      cold: {
        dps: 0,
        max: 0,
        min: 0,
      },
      fire: {
        dps: 0,
        max: 0,
        min: 0,
      },
      lightning: {
        dps: 0,
        max: 0,
        min: 0,
      },
      physical: {
        dps: 19,
        max: 14,
        min: 5,
      },
      totalDps: 19,
      totalElementalDps: 0,
    })
  })

  test('should return the DPS for an item with physical and elemental damage', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.PHYSICAL_AND_ELEMENTS)).toStrictEqual({
      chaos: {
        dps: 0,
        max: 0,
        min: 0,
      },
      cold: {
        dps: 19,
        max: 14,
        min: 5,
      },
      fire: {
        dps: 19,
        max: 14,
        min: 5,
      },
      lightning: {
        dps: 19,
        max: 14,
        min: 5,
      },
      physical: {
        dps: 19,
        max: 14,
        min: 5,
      },
      totalDps: 76,
      totalElementalDps: 57,
    })
  })

  test('should return the DPS for an item with only chaos damage', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.ONLY_CHAOS)).toStrictEqual({
      chaos: {
        dps: 19,
        max: 14,
        min: 5,
      },
      cold: {
        dps: 0,
        max: 0,
        min: 0,
      },
      fire: {
        dps: 0,
        max: 0,
        min: 0,
      },
      lightning: {
        dps: 0,
        max: 0,
        min: 0,
      },
      physical: {
        dps: 0,
        max: 0,
        min: 0,
      },
      totalDps: 19,
      totalElementalDps: 0,
    })
  })

  test('should return the DPS for an item with chaos and physical damage', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.CHAOS_AND_PHYSICAL)).toStrictEqual({
      chaos: {
        dps: 19,
        max: 14,
        min: 5,
      },
      cold: {
        dps: 0,
        max: 0,
        min: 0,
      },
      fire: {
        dps: 0,
        max: 0,
        min: 0,
      },
      lightning: {
        dps: 0,
        max: 0,
        min: 0,
      },
      physical: {
        dps: 19,
        max: 14,
        min: 5,
      },
      totalDps: 38,
      totalElementalDps: 0,
    })
  })

  test('should return the DPS for an item with chaos and elemental damage', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.CHAOS_AND_ELEMENTS)).toStrictEqual({
      chaos: {
        dps: 19,
        max: 14,
        min: 5,
      },
      cold: {
        dps: 19,
        max: 14,
        min: 5,
      },
      fire: {
        dps: 19,
        max: 14,
        min: 5,
      },
      lightning: {
        dps: 19,
        max: 14,
        min: 5,
      },
      physical: {
        dps: 0,
        max: 0,
        min: 0,
      },
      totalDps: 76,
      totalElementalDps: 57,
    })
  })

  test('should return the DPS for an item with chaos, physical, and elemental damage', () => {
    expect(handleDpsCalculations(TESTDATA.FORM_VALUES.CHAOS_AND_PHYSICAL_AND_ELEMENTS)).toStrictEqual({
      chaos: {
        dps: 19,
        max: 14,
        min: 5,
      },
      cold: {
        dps: 19,
        max: 14,
        min: 5,
      },
      fire: {
        dps: 19,
        max: 14,
        min: 5,
      },
      lightning: {
        dps: 19,
        max: 14,
        min: 5,
      },
      physical: {
        dps: 19,
        max: 14,
        min: 5,
      },
      totalDps: 95,
      totalElementalDps: 57,
    })
  })
})
