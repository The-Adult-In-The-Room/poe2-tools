import { TESTDATA } from '#/data/testData'
import {
  convertRangeText,
  createCards,
  findElementalDamageValues,
  findItemName,
  findStatValues,
  formatNumber,
  formatRatio,
  formatVolume,
  handleDpsCalculations,
  removeKey,
  removeSuffix,
  setMinMax,
  transformImageUrl,
} from './utils'

describe('removeKey', () => {
  describe('GIVEN a string with a key prefix', () => {
    test('THEN the key is removed', () => {
      expect(removeKey(TESTDATA.APS_LINE)).toBe('1.5')
    })

    test('THEN suffixes are preserved', () => {
      expect(removeKey(TESTDATA.ELEMENTAL_DAMAGE_LINE)).toBe('2-5 (augmented), 5-14 (augmented), 14-76 (augmented)')
    })

    test('THEN whitespace is trimmed', () => {
      expect(removeKey(`${TESTDATA.APS_LINE} `)).toBe('1.5')
    })
  })
})

describe('removeSuffix', () => {
  describe('GIVEN a string with a suffix', () => {
    test('THEN the suffix is removed', () => {
      expect(removeSuffix(TESTDATA.SUFFIX_LINE)).toBe('2-5')
    })
  })
})

describe('convertRangeText', () => {
  describe('GIVEN a range string', () => {
    test('THEN the range is converted to a string', () => {
      expect(convertRangeText(TESTDATA.RANGE_LINE)).toBe('3-150')
    })
  })

  describe('GIVEN a string without a range', () => {
    test('THEN undefined is returned', () => {
      expect(convertRangeText('8 Lightning Damage')).toBe(undefined)
    })
  })

  describe('GIVEN an empty string', () => {
    test('THEN undefined is returned', () => {
      expect(convertRangeText('')).toBe(undefined)
    })
  })
})

describe('findItemName', () => {
  describe('GIVEN a valid text area input', () => {
    test('THEN the item name and type are returned', () => {
      expect(findItemName(TESTDATA.FULL_ITEMS.THREE_ELEMENTAL)).toEqual(['Corpse Mast', 'Crackling Quarterstaff'])
    })
  })

  describe('GIVEN a text area input that is too short', () => {
    test('THEN null is returned', () => {
      expect(findItemName('Item Name\nItem Type')).toBe(null)
    })
  })
})

describe('findElementalDamageValues', () => {
  describe('GIVEN a weapon with all 3 elements', () => {
    test('THEN an array of elemental damage values is returned', () => {
      const lines = TESTDATA.FULL_ITEMS.THREE_ELEMENTAL.split('\n')
      expect(findElementalDamageValues(lines)).toEqual(['2-5', '5-14', '14-76'])
    })
  })

  describe('GIVEN a weapon with 2 elements', () => {
    test('THEN an array of elemental damage values is returned', () => {
      const lines = TESTDATA.FULL_ITEMS.TWO_ELEMENTAL_FIRE_AND_LIGHTNING.split('\n')
      expect(findElementalDamageValues(lines)).toEqual(['2-5', '14-76'])
    })
  })

  describe('GIVEN no elemental damage line', () => {
    test('THEN undefined is returned', () => {
      const lines = TESTDATA.FULL_ITEMS.SINGLE_ELEMENT_LIGHTNING.split('\n')
      expect(findElementalDamageValues(lines)).toBe(undefined)
    })
  })
})

describe('setMinMax', () => {
  describe('GIVEN a stats map and a range value', () => {
    test('THEN the min and max values are set in the stats map', () => {
      const statsMap = new Map<string, string>()
      setMinMax('physical', '12-15', statsMap)
      expect(statsMap).toEqual(
        new Map([
          ['physicalMin', '12'],
          ['physicalMax', '15'],
        ]),
      )
    })
  })
})

describe('findStatValues', () => {
  describe('GIVEN an item with combined elemental damage', () => {
    test('THEN an object of stat values is returned', () => {
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
  })

  describe('GIVEN an item with runes', () => {
    test('THEN runes are considered in the results', () => {
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
  })

  describe('GIVEN an item with only fire and lightning elemental damages', () => {
    test('THEN the element values are correctly identified', () => {
      const lines = TESTDATA.FULL_ITEMS.TWO_ELEMENTAL_FIRE_AND_LIGHTNING.split('\n')
      expect(findStatValues(lines)).toEqual({
        aps: '1.40',
        lightningMax: '76',
        lightningMin: '14',
        fireMax: '5',
        fireMin: '2',
      })
    })
  })

  describe('GIVEN an item with only fire and cold elemental damages', () => {
    test('THEN the element values are correctly identified', () => {
      const lines = TESTDATA.FULL_ITEMS.TWO_ELEMENTAL_FIRE_AND_COLD.split('\n')
      expect(findStatValues(lines)).toEqual({
        aps: '1.40',
        coldMax: '76',
        coldMin: '14',
        fireMax: '5',
        fireMin: '2',
      })
    })
  })

  describe('GIVEN an item with only lightning and cold elemental damages', () => {
    test('THEN the element values are correctly identified', () => {
      const lines = TESTDATA.FULL_ITEMS.TWO_ELEMENTAL_LIGHTNING_AND_COLD.split('\n')
      expect(findStatValues(lines)).toEqual({
        aps: '1.40',
        coldMax: '5',
        coldMin: '2',
        lightningMax: '76',
        lightningMin: '14',
      })
    })
  })

  describe('GIVEN an item with only fire elemental damage', () => {
    test('THEN the element values are correctly identified', () => {
      const lines = TESTDATA.FULL_ITEMS.SINGLE_ELEMENT_FIRE.split('\n')
      expect(findStatValues(lines)).toEqual({
        aps: '1.40',
        fireMax: '54',
        fireMin: '13',
      })
    })
  })

  describe('GIVEN an item with only cold elemental damage', () => {
    test('THEN the element values are correctly identified', () => {
      const lines = TESTDATA.FULL_ITEMS.SINGLE_ELEMENT_COLD.split('\n')
      expect(findStatValues(lines)).toEqual({
        aps: '1.40',
        coldMax: '54',
        coldMin: '13',
      })
    })
  })

  describe('GIVEN an item with only lightning elemental damage', () => {
    test('THEN the element values are correctly identified', () => {
      const lines = TESTDATA.FULL_ITEMS.SINGLE_ELEMENT_LIGHTNING.split('\n')
      expect(findStatValues(lines)).toEqual({
        aps: '1.40',
        lightningMax: '54',
        lightningMin: '13',
      })
    })
  })

  describe('GIVEN an item with a damage type that cannot be converted to a range', () => {
    test('THEN the damage type is safely ignored', () => {
      const lines = TESTDATA.FULL_ITEMS.BAD_ITEM.split('\n')
      expect(findStatValues(lines)).toEqual({
        aps: '1.40',
        coldMax: '5',
        coldMin: '2',
      })
    })
  })
})

describe('handleDpsCalculations', () => {
  describe('GIVEN no aps is provided', () => {
    test('THEN aps defaults to 1', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.NO_APS)).toStrictEqual({
        chaos: { dps: 0, max: 0, min: 0 },
        cold: { dps: 0, max: 0, min: 0 },
        fire: { dps: 0, max: 0, min: 0 },
        lightning: { dps: 0, max: 0, min: 0 },
        physical: { dps: 9.5, max: 14, min: 5 },
        totalDps: 9.5,
        totalElementalDps: 0,
      })
    })
  })

  describe('GIVEN an item with only three types of elemental damage', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.THREE_ELEMENTAL)).toStrictEqual({
        chaos: { dps: 0, max: 0, min: 0 },
        cold: { dps: 13.3, max: 14, min: 5 },
        fire: { dps: 4.9, max: 5, min: 2 },
        lightning: { dps: 63, max: 76, min: 14 },
        physical: { dps: 0, max: 0, min: 0 },
        totalDps: 81.2,
        totalElementalDps: 81.2,
      })
    })
  })

  describe('GIVEN an item with only two types of elemental damage (Fire + Lightning)', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.TWO_ELEMENTAL_FIRE_AND_LIGHTNING)).toStrictEqual({
        chaos: { dps: 0, max: 0, min: 0 },
        cold: { dps: 0, max: 0, min: 0 },
        fire: { dps: 4.9, max: 5, min: 2 },
        lightning: { dps: 63, max: 76, min: 14 },
        physical: { dps: 0, max: 0, min: 0 },
        totalDps: 67.9,
        totalElementalDps: 67.9,
      })
    })
  })

  describe('GIVEN an item with only two types of elemental damage (Fire + Cold)', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.TWO_ELEMENTAL_FIRE_AND_COLD)).toStrictEqual({
        chaos: { dps: 0, max: 0, min: 0 },
        cold: { dps: 63, max: 76, min: 14 },
        fire: { dps: 4.9, max: 5, min: 2 },
        lightning: { dps: 0, max: 0, min: 0 },
        physical: { dps: 0, max: 0, min: 0 },
        totalDps: 67.9,
        totalElementalDps: 67.9,
      })
    })
  })

  describe('GIVEN an item with only two types of elemental damage (Lightning + Cold)', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.TWO_ELEMENTAL_LIGHTNING_AND_COLD)).toStrictEqual({
        chaos: { dps: 0, max: 0, min: 0 },
        cold: { dps: 4.9, max: 5, min: 2 },
        fire: { dps: 0, max: 0, min: 0 },
        lightning: { dps: 63, max: 76, min: 14 },
        physical: { dps: 0, max: 0, min: 0 },
        totalDps: 67.9,
        totalElementalDps: 67.9,
      })
    })
  })

  describe('GIVEN an item with only one type of elemental damage (Fire)', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.SINGLE_ELEMENT_FIRE)).toStrictEqual({
        chaos: { dps: 0, max: 0, min: 0 },
        cold: { dps: 0, max: 0, min: 0 },
        fire: { dps: 46.9, max: 54, min: 13 },
        lightning: { dps: 0, max: 0, min: 0 },
        physical: { dps: 0, max: 0, min: 0 },
        totalDps: 46.9,
        totalElementalDps: 46.9,
      })
    })
  })

  describe('GIVEN an item with only one type of elemental damage (Cold)', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.SINGLE_ELEMENT_COLD)).toStrictEqual({
        chaos: { dps: 0, max: 0, min: 0 },
        cold: { dps: 67.9, max: 92, min: 5 },
        fire: { dps: 0, max: 0, min: 0 },
        lightning: { dps: 0, max: 0, min: 0 },
        physical: { dps: 0, max: 0, min: 0 },
        totalDps: 67.9,
        totalElementalDps: 67.9,
      })
    })
  })

  describe('GIVEN an item with only one type of elemental damage (Lightning)', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.SINGLE_ELEMENT_LIGHTNING)).toStrictEqual({
        chaos: { dps: 0, max: 0, min: 0 },
        cold: { dps: 0, max: 0, min: 0 },
        fire: { dps: 0, max: 0, min: 0 },
        lightning: { dps: 18.9, max: 25, min: 2 },
        physical: { dps: 0, max: 0, min: 0 },
        totalDps: 18.9,
        totalElementalDps: 18.9,
      })
    })
  })

  describe('GIVEN an item with only physical damage', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.ONLY_PHYSICAL)).toStrictEqual({
        chaos: { dps: 0, max: 0, min: 0 },
        cold: { dps: 0, max: 0, min: 0 },
        fire: { dps: 0, max: 0, min: 0 },
        lightning: { dps: 0, max: 0, min: 0 },
        physical: { dps: 19, max: 14, min: 5 },
        totalDps: 19,
        totalElementalDps: 0,
      })
    })
  })

  describe('GIVEN an item with physical and elemental damage', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.PHYSICAL_AND_ELEMENTS)).toStrictEqual({
        chaos: { dps: 0, max: 0, min: 0 },
        cold: { dps: 19, max: 14, min: 5 },
        fire: { dps: 19, max: 14, min: 5 },
        lightning: { dps: 19, max: 14, min: 5 },
        physical: { dps: 19, max: 14, min: 5 },
        totalDps: 76,
        totalElementalDps: 57,
      })
    })
  })

  describe('GIVEN an item with only chaos damage', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.ONLY_CHAOS)).toStrictEqual({
        chaos: { dps: 19, max: 14, min: 5 },
        cold: { dps: 0, max: 0, min: 0 },
        fire: { dps: 0, max: 0, min: 0 },
        lightning: { dps: 0, max: 0, min: 0 },
        physical: { dps: 0, max: 0, min: 0 },
        totalDps: 19,
        totalElementalDps: 0,
      })
    })
  })

  describe('GIVEN an item with chaos and physical damage', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.CHAOS_AND_PHYSICAL)).toStrictEqual({
        chaos: { dps: 19, max: 14, min: 5 },
        cold: { dps: 0, max: 0, min: 0 },
        fire: { dps: 0, max: 0, min: 0 },
        lightning: { dps: 0, max: 0, min: 0 },
        physical: { dps: 19, max: 14, min: 5 },
        totalDps: 38,
        totalElementalDps: 0,
      })
    })
  })

  describe('GIVEN an item with chaos and elemental damage', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.CHAOS_AND_ELEMENTS)).toStrictEqual({
        chaos: { dps: 19, max: 14, min: 5 },
        cold: { dps: 19, max: 14, min: 5 },
        fire: { dps: 19, max: 14, min: 5 },
        lightning: { dps: 19, max: 14, min: 5 },
        physical: { dps: 0, max: 0, min: 0 },
        totalDps: 76,
        totalElementalDps: 57,
      })
    })
  })

  describe('GIVEN an item with chaos, physical, and elemental damage', () => {
    test('THEN the DPS is returned', () => {
      expect(handleDpsCalculations(TESTDATA.FORM_VALUES.CHAOS_AND_PHYSICAL_AND_ELEMENTS)).toStrictEqual({
        chaos: { dps: 19, max: 14, min: 5 },
        cold: { dps: 19, max: 14, min: 5 },
        fire: { dps: 19, max: 14, min: 5 },
        lightning: { dps: 19, max: 14, min: 5 },
        physical: { dps: 19, max: 14, min: 5 },
        totalDps: 95,
        totalElementalDps: 57,
      })
    })
  })
})

describe('createCards', () => {
  describe('GIVEN an item with only physical damage', () => {
    test('THEN an array of cards is returned', () => {
      const cards = createCards(TESTDATA.CALCULATIONS.ONLY_PHYSICAL)
      expect(cards).toStrictEqual([{ color: 'cyan', label: 'Physical DPS:', testId: 'physicalDps', value: 19.6 }])
    })
  })

  describe('GIVEN an item with physical and elemental damage', () => {
    test('THEN an array of cards is returned', () => {
      const cards = createCards(TESTDATA.CALCULATIONS.PHYSICAL_AND_ELEMENTS)
      expect(cards).toStrictEqual([
        { color: 'cyan', label: 'Physical DPS:', testId: 'physicalDps', value: 19.6 },
        { color: 'cyan', label: 'Elemental DPS:', testId: 'elementalDps', value: 78.4 },
        { color: 'yellow', label: 'Lightning DPS:', testId: 'lightningDps', value: 19.6 },
        { color: 'red', label: 'Fire DPS:', testId: 'fireDps', value: 19.6 },
        { color: 'blue', label: 'Cold DPS:', testId: 'coldDps', value: 19.6 },
      ])
    })
  })

  describe('GIVEN an item with only chaos damage', () => {
    test('THEN an array of cards is returned', () => {
      const cards = createCards(TESTDATA.CALCULATIONS.ONLY_CHAOS)
      expect(cards).toStrictEqual([{ color: 'pink', label: 'Chaos DPS:', testId: 'chaosDps', value: 19.6 }])
    })
  })

  describe('GIVEN an item with only elemental damage', () => {
    test('THEN an array of cards is returned', () => {
      const cards = createCards(TESTDATA.CALCULATIONS.ONLY_ELEMENTS)
      expect(cards).toStrictEqual([
        { color: 'cyan', label: 'Elemental DPS:', testId: 'elementalDps', value: 58.8 },
        { color: 'yellow', label: 'Lightning DPS:', testId: 'lightningDps', value: 19.6 },
        { color: 'red', label: 'Fire DPS:', testId: 'fireDps', value: 19.6 },
        { color: 'blue', label: 'Cold DPS:', testId: 'coldDps', value: 19.6 },
      ])
    })
  })

  describe('GIVEN an item with all damage types', () => {
    test('THEN an array of cards is returned', () => {
      const cards = createCards(TESTDATA.CALCULATIONS.ALL_TYPES)
      expect(cards).toStrictEqual([
        { color: 'cyan', label: 'Physical DPS:', testId: 'physicalDps', value: 19.6 },
        { color: 'cyan', label: 'Elemental DPS:', testId: 'elementalDps', value: 78.4 },
        { color: 'yellow', label: 'Lightning DPS:', testId: 'lightningDps', value: 19.6 },
        { color: 'red', label: 'Fire DPS:', testId: 'fireDps', value: 19.6 },
        { color: 'blue', label: 'Cold DPS:', testId: 'coldDps', value: 19.6 },
        { color: 'pink', label: 'Chaos DPS:', testId: 'chaosDps', value: 19.6 },
      ])
    })
  })
})

describe('transformImageUrl', () => {
  describe('GIVEN a valid poe.ninja image path', () => {
    test('THEN it transforms to the web.poecdn.com CDN URL', () => {
      const poeNinjaPath =
        '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lXZWFwb25RdWFsaXR5Iiwic2NhbGUiOjEsInJlYWxtIjoicG9lMiJ9XQ/18715ea7be/CurrencyWeaponQuality.png'
      const result = transformImageUrl(poeNinjaPath)
      expect(result).toBe(`https://web.poecdn.com${poeNinjaPath}`)
    })
  })

  describe('GIVEN an invalid or non-poe.ninja path', () => {
    test('THEN it returns the original path unchanged', () => {
      const invalidPath = 'https://example.com/image.png'
      expect(transformImageUrl(invalidPath)).toBe(invalidPath)
    })

    test('THEN it handles empty strings', () => {
      expect(transformImageUrl('')).toBe('')
    })

    test('THEN it handles paths without the /gen/image/ prefix', () => {
      const path = '/some/other/path.png'
      expect(transformImageUrl(path)).toBe(path)
    })
  })
})

describe('formatNumber', () => {
  describe('GIVEN a value >= 1000000', () => {
    test('THEN it uses M shorthand with one decimal', () => {
      expect(formatNumber(1500000)).toBe('1.5M')
    })

    test('THEN whole millions get .0M padding', () => {
      expect(formatNumber(2000000)).toBe('2.0M')
    })
  })

  describe('GIVEN a value >= 1000', () => {
    test('THEN it uses k shorthand with one decimal', () => {
      expect(formatNumber(1500)).toBe('1.5k')
    })

    test('THEN whole thousands get .0k padding', () => {
      expect(formatNumber(2000)).toBe('2.0k')
    })
  })

  describe('GIVEN a value >= 10', () => {
    test('THEN whole numbers get .0 padding', () => {
      expect(formatNumber(150)).toBe('150.0')
    })

    test('THEN fractional values keep decimals', () => {
      expect(formatNumber(20.5)).toBe('20.5')
    })
  })

  describe('GIVEN a value < 10', () => {
    test('THEN whole numbers get .0 padding', () => {
      expect(formatNumber(5)).toBe('5.0')
    })

    test('THEN fractional values keep decimals', () => {
      expect(formatNumber(2.1)).toBe('2.1')
    })

    test('THEN small fractional inverse values keep precision', () => {
      expect(formatNumber(370.37)).toBe('370.37')
    })
  })
})

describe('formatRatio', () => {
  describe('GIVEN a value >= 1', () => {
    test('THEN it returns N : 1 format', () => {
      expect(formatRatio(150)).toEqual({ left: '150.0', right: '1.0' })
    })

    test('THEN fractional values keep decimals', () => {
      expect(formatRatio(2.1)).toEqual({ left: '2.1', right: '1.0' })
    })
  })

  describe('GIVEN a value < 1', () => {
    test('THEN it returns inverted 1 : N format', () => {
      expect(formatRatio(0.05)).toEqual({ left: '1.0', right: '20.0' })
    })

    test('THEN inverse values use shorthand when large', () => {
      expect(formatRatio(0.0005)).toEqual({ left: '1.0', right: '2.0k' })
    })
  })
})

describe('formatVolume', () => {
  describe('GIVEN a volume >= 1000000', () => {
    test('THEN whole millions show without decimals', () => {
      expect(formatVolume(2000000)).toBe('2M')
    })

    test('THEN fractional millions show one decimal', () => {
      expect(formatVolume(1500000)).toBe('1.5M')
    })
  })

  describe('GIVEN a volume >= 1000', () => {
    test('THEN whole thousands show without decimals', () => {
      expect(formatVolume(1000)).toBe('1k')
    })

    test('THEN fractional thousands show one decimal', () => {
      expect(formatVolume(1500)).toBe('1.5k')
    })
  })

  describe('GIVEN a volume < 1000', () => {
    test('THEN it is rounded to a whole number', () => {
      expect(formatVolume(42)).toBe('42')
    })
  })
})
