const ZERO_CALCULATION = {
  dps: 0,
  max: 0,
  min: 0,
}

export const TESTDATA = {
  APS_LINE: 'Attacks per Second: 1.5',
  ELEMENTAL_DAMAGE_LINE: 'Elemental Damage: 2-5 (augmented), 5-14 (augmented), 14-76 (augmented)',
  SUFFIX_LINE: '2-5 (augmented)',
  RANGE_LINE: 'Adds 3 to 150 Lightning Damage',
  FULL_ITEMS: {
    THREE_ELEMENTAL: `Item Class: Quarterstaves
        Rarity: Rare
        Corpse Mast
        Crackling Quarterstaff
        --------
        Elemental Damage: 2-5 (augmented), 5-14 (augmented), 14-76 (augmented)
        Critical Hit Chance: 10.00%
        Attacks per Second: 1.40
        --------
        Requirements:
        Level: 16
        Dex: 30
        Int: 14
        --------
        Sockets: S S 
        --------
        Item Level: 18
        --------
        Adds 2 to 5 Fire Damage
        Adds 5 to 14 Cold Damage
        Adds 1 to 22 Lightning Damage
        +3 to Level of all Melee Skills`,
    THREE_ELEMENTAL_WITH_RUNE: `Item Class: Quarterstaves
        Rarity: Rare
        Corpse Mast
        Crackling Quarterstaff
        --------
        Elemental Damage: 2-5 (augmented), 5-14 (augmented), 16-116 (augmented)
        Critical Hit Chance: 10.00%
        Attacks per Second: 1.40
        --------
        Requirements:
        Level: 16
        Dex: 30
        Int: 14
        --------
        Sockets: S S 
        --------
        Item Level: 18
        --------
        Adds 2 to 40 Lightning Damage (rune)
        --------
        Adds 2 to 5 Fire Damage
        Adds 5 to 14 Cold Damage
        Adds 1 to 22 Lightning Damage
        +3 to Level of all Melee Skills`,
    TWO_ELEMENTAL_FIRE_AND_LIGHTNING: `Item Class: Quarterstaves
        Rarity: Rare
        Corpse Mast
        Crackling Quarterstaff
        --------
        Elemental Damage: 2-5 (augmented), 14-76 (augmented)
        Critical Hit Chance: 10.00%
        Attacks per Second: 1.40
        --------
        Requirements:
        Level: 16
        Dex: 30
        Int: 14
        --------
        Sockets: S S 
        --------
        Item Level: 18
        --------
        Adds 2 to 5 Fire Damage
        Adds 1 to 22 Lightning Damage
        +3 to Level of all Melee Skills`,
    TWO_ELEMENTAL_FIRE_AND_COLD: `Item Class: Quarterstaves
        Rarity: Rare
        Corpse Mast
        Crackling Quarterstaff
        --------
        Elemental Damage: 2-5 (augmented), 14-76 (augmented)
        Critical Hit Chance: 10.00%
        Attacks per Second: 1.40
        --------
        Requirements:
        Level: 16
        Dex: 30
        Int: 14
        --------
        Sockets: S S 
        --------
        Item Level: 18
        --------
        Adds 2 to 5 Fire Damage
        Adds 1 to 22 Cold Damage
        +3 to Level of all Melee Skills`,
    TWO_ELEMENTAL_LIGHTNING_AND_COLD: `Item Class: Quarterstaves
        Rarity: Rare
        Corpse Mast
        Crackling Quarterstaff
        --------
        Elemental Damage: 2-5 (augmented), 14-76 (augmented)
        Critical Hit Chance: 10.00%
        Attacks per Second: 1.40
        --------
        Requirements:
        Level: 16
        Dex: 30
        Int: 14
        --------
        Sockets: S S 
        --------
        Item Level: 18
        --------
        Adds 2 to 5 Cold Damage
        Adds 1 to 22 Lightning Damage
        +3 to Level of all Melee Skills`,
    SINGLE_ELEMENT_LIGHTNING: `Item Class: Quarterstaves
        Rarity: Magic
        Crackling Quarterstaff
        --------
        Lightning Damage: 13-54 (augmented)
        Critical Hit Chance: 10.00%
        Attacks per Second: 1.40
        --------
        Requirements:
        Dex: 30
        Int: 14
        --------
        Item Level: 19
        --------
        Unidentified`,
    SINGLE_ELEMENT_FIRE: `Item Class: Quarterstaves
        Rarity: Magic
        Crackling Quarterstaff
        --------
        Fire Damage: 13-54 (augmented)
        Critical Hit Chance: 10.00%
        Attacks per Second: 1.40
        --------
        Requirements:
        Dex: 30
        Int: 14
        --------
        Item Level: 19
        --------
        Unidentified`,
    SINGLE_ELEMENT_COLD: `Item Class: Quarterstaves
        Rarity: Magic
        Crackling Quarterstaff
        --------
        Cold Damage: 13-54 (augmented)
        Critical Hit Chance: 10.00%
        Attacks per Second: 1.40
        --------
        Requirements:
        Dex: 30
        Int: 14
        --------
        Item Level: 19
        --------
        Unidentified`,
    PHYSICAL_AND_ELEMENTS: `Item Class: Quarterstaves
        Rarity: Rare
        Woe Goad
        Expert Barrier Quarterstaff
        --------
        Physical Damage: 125-209 (augmented)
        Elemental Damage: 3-7 (augmented), 3-150 (augmented)
        Critical Hit Chance: 10.00%
        Attacks per Second: 1.40
        --------
        Requirements:
        Level: 79
        Dex: 165
        Int: 64
        --------
        Item Level: 83
        --------
        +12% to Block chance (implicit)
        --------
        115% increased Physical Damage
        Adds 3 to 7 Fire Damage
        Adds 3 to 150 Lightning Damage
        +22% to Critical Damage Bonus
        Leeches 8.13% of Physical Damage as Life
        Causes 43% increased Stun Buildup`,
    // Sanity test the case where the item has an "Adds x to x Lightning Damage" line
    // but no "Elemental Damage" line. Should never happen, but we have safety checks that need tested to safeguard.
    BAD_ITEM: `Item Class: Quarterstaves
        Rarity: Rare
        Corpse Mast
        Crackling Quarterstaff
        --------
        Cold Damage: 2-5 (augmented)
        Critical Hit Chance: 10.00%
        Attacks per Second: 1.40
        --------
        Requirements:
        Level: 16
        Dex: 30
        Int: 14
        --------
        Sockets: S S 
        --------
        Item Level: 18
        --------
        Adds 2 to 5 Cold Damage
        Adds 1 to 22 Lightning Damage
        +3 to Level of all Melee Skills`,
  },
  FORM_VALUES: {
    NO_APS: {
      physicalMax: '14',
      physicalMin: '5',
    },
    ONLY_PHYSICAL: {
      aps: '2.0',
      physicalMax: '14',
      physicalMin: '5',
    },
    PHYSICAL_AND_ELEMENTS: {
      aps: '2.0',
      physicalMax: '14',
      physicalMin: '5',
      fireMax: '14',
      fireMin: '5',
      coldMax: '14',
      coldMin: '5',
      lightningMax: '14',
      lightningMin: '5',
    },
    ONLY_CHAOS: {
      aps: '2.0',
      chaosMax: '14',
      chaosMin: '5',
    },
    CHAOS_AND_PHYSICAL: {
      aps: '2.0',
      chaosMax: '14',
      chaosMin: '5',
      physicalMax: '14',
      physicalMin: '5',
    },
    CHAOS_AND_ELEMENTS: {
      aps: '2.0',
      chaosMax: '14',
      chaosMin: '5',
      fireMax: '14',
      fireMin: '5',
      coldMax: '14',
      coldMin: '5',
      lightningMax: '14',
      lightningMin: '5',
    },
    CHAOS_AND_PHYSICAL_AND_ELEMENTS: {
      aps: '2.0',
      chaosMax: '14',
      chaosMin: '5',
      physicalMax: '14',
      physicalMin: '5',
      fireMax: '14',
      fireMin: '5',
      coldMax: '14',
      coldMin: '5',
      lightningMax: '14',
      lightningMin: '5',
    },
    THREE_ELEMENTAL: {
      aps: '1.40',
      coldMax: '14',
      coldMin: '5',
      fireMax: '5',
      fireMin: '2',
      lightningMax: '76',
      lightningMin: '14',
    },
    TWO_ELEMENTAL_FIRE_AND_LIGHTNING: {
      aps: '1.40',
      fireMax: '5',
      fireMin: '2',
      lightningMax: '76',
      lightningMin: '14',
    },
    TWO_ELEMENTAL_FIRE_AND_COLD: {
      aps: '1.40',
      coldMax: '76',
      coldMin: '14',
      fireMax: '5',
      fireMin: '2',
    },
    TWO_ELEMENTAL_LIGHTNING_AND_COLD: {
      aps: '1.40',
      coldMax: '5',
      coldMin: '2',
      lightningMax: '76',
      lightningMin: '14',
    },
    SINGLE_ELEMENT_FIRE: {
      aps: '1.40',
      fireMax: '54',
      fireMin: '13',
    },
    SINGLE_ELEMENT_COLD: {
      aps: '1.40',
      coldMax: '92',
      coldMin: '5',
    },
    SINGLE_ELEMENT_LIGHTNING: {
      aps: '1.40',
      lightningMax: '25',
      lightningMin: '2',
    },
  },
  CALCULATIONS: {
    ONLY_PHYSICAL: {
      physical: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      fire: ZERO_CALCULATION,
      cold: ZERO_CALCULATION,
      lightning: ZERO_CALCULATION,
      chaos: ZERO_CALCULATION,
      totalDps: 19.6,
      totalElementalDps: 0,
    },
    ONLY_CHAOS: {
      physical: ZERO_CALCULATION,
      fire: ZERO_CALCULATION,
      cold: ZERO_CALCULATION,
      lightning: ZERO_CALCULATION,
      chaos: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      totalDps: 19.6,
      totalElementalDps: 0,
    },
    PHYSICAL_AND_ELEMENTS: {
      physical: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      fire: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      cold: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      lightning: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      chaos: ZERO_CALCULATION,
      totalDps: 98,
      totalElementalDps: 78.4,
    },
    ONLY_ELEMENTS: {
      physical: ZERO_CALCULATION,
      fire: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      cold: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      lightning: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      chaos: ZERO_CALCULATION,
      totalDps: 58.8,
      totalElementalDps: 58.8,
    },
    ALL_TYPES: {
      physical: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      fire: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      cold: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      lightning: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      chaos: {
        dps: 19.6,
        max: 28,
        min: 11,
      },
      totalDps: 98,
      totalElementalDps: 78.4,
    },
  },
}
