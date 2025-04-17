export interface AbilityScore extends BaseDocument {
  shortName: string;
  desc: string;
  skills: Skill[];
  source: Source;
}

declare type ArmorArmorClass = {
  kind: "set";
  base: number;
} | {
  kind: "compute";
  base: number;
  modifier: AbilityScore;
  maxModifier: number | null;
} | {
  kind: "add";
  bonus: number;
};

declare type ArmorCategory = "light" | "medium" | "heavy" | "shield";

export interface ArmorItem extends BaseItem {
  kind: "armor";
  category: ArmorCategory;
  armorClass: ArmorArmorClass;
  strengthRequirement: number | null;
  stealthDisadvantage: boolean;
}

export interface BaseDocument {
  id: string;
  name: string;
}

declare interface BaseItem extends BaseDocument {
  cost: Cost;
  weight: number;
  tags: string[];
  source: Source;
}

declare interface CastingTime {
  amount: number;
  unit: "action" | "bonus action" | "reaction" | "minute" | "hour" | "day" | "week";
  condition?: string;
}

export interface Cost {
  currency: Currency;
  amount: number;
}

export type Currency = "cp" | "sp" | "ep" | "gp" | "pp";

export interface Damage {
  type: DamageType;
  dice: string;
}

declare type DamageProgression = {
  kind: "cantrip";
  damageAtCharacterLevel: {
      [key: number]: string;
  };
} | {
  kind: "levelled";
  damageAtSlotLevel: {
      [key: number]: string;
  };
} | {
  kind: "targets";
  damagePerTarget: string;
  targetsAtSlotLevel: {
      [key: number]: number;
  };
};

export interface DamageType extends BaseDocument {
  desc: string;
}

export interface GearItem extends BaseItem {
  kind: "gear";
  desc: string;
}

export type Item = WeaponItem | ArmorItem | ToolsItem | GearItem | PackItem | StackItem;

export interface MagicSchool extends BaseDocument {
  desc: string;
  source: Source;
}

export interface PackItem extends BaseItem {
  kind: "pack";
  contents: {
      item: Item;
      quantity: number;
  }[];
}

export interface Range {
  distance: number;
  unit: "foot" | "mile";
}

export interface Skill extends BaseDocument {
  desc: string;
  baseAbility: AbilityScore;
  source: Source;
}

export interface Source {
  book: SourceBook;
  page: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SourceBook extends BaseDocument {
}

export interface Spell extends BaseDocument {
  level: number;
  school: MagicSchool;
  desc: string;
  atHigherLevels?: string;
  range: SpellRange;
  components: ("V" | "S" | "M")[];
  materials?: SpellMaterials;
  ritual: boolean;
  durations: SpellDuration[];
  castingTimes: CastingTime[];
  attack?: SpellAttack;
  source: Source;
}

declare type SpellAttack = {
  kind: "ranged" | "melee";
  damage?: {
      damageType?: DamageType;
      damageProgression: DamageProgression;
  };
} | {
  kind: "savingThrow";
  saveType: AbilityScore;
  effectOnSave: "noEffect" | "halfDamage" | "special";
  damage?: {
      damageType?: DamageType;
      damageProgression: DamageProgression;
  };
} | {
  kind: "auto";
  damage?: {
      damageType?: DamageType;
      damageProgression: DamageProgression;
  };
} | {
  kind: "healing";
  healingAtSlotLevel: {
      [key: number]: string;
  };
};

declare type SpellDuration = {
  kind: "instantaneous";
} | {
  kind: "special";
} | (({
  kind: "permanent";
} | {
  kind: "time";
  amount: number;
  unit: "round" | "minute" | "hour" | "day" | "week";
  concentration: boolean;
}) & {
  until?: ("dispelled" | "long rest" | "short rest" | "triggered")[];
});

declare interface SpellMaterials {
  desc: string;
  cost?: Cost;
  consumed: "yes" | "no" | "optional";
}

declare type SpellRange = (Range & {
  kind: "point";
}) | {
  kind: "self";
  shape?: {
      kind: "sphere" | "radius" | "cone" | "line" | "hemisphere" | "cube";
      size: Range;
  };
} | {
  kind: "touch";
} | {
  kind: "special";
} | {
  kind: "sight";
} | {
  kind: "unlimited";
};

export interface StackItem extends BaseItem {
  kind: "stack";
  quantity: number;
  item: Item;
}

export interface ToolsItem extends BaseItem {
  kind: "tools";
  toolsKind: "artisans" | "other";
  ability: AbilityScore;
  uses: ToolsUse[];
  craftables: Item[];
}

declare interface ToolsUse {
  desc: string;
  dc: number;
}

declare type WeaponCategory = "simple" | "martial";

export interface WeaponItem extends BaseItem {
  kind: "weapon";
  category: WeaponCategory;
  range: WeaponRange;
  properties: WeaponProperty[];
  damage: Damage;
  mastery: WeaponMastery;
}

export interface WeaponMastery extends BaseDocument {
  desc: string;
  source: Source;
}

declare type WeaponProperty = {
  kind: "light";
} | {
  kind: "heavy";
} | {
  kind: "finesse";
} | {
  kind: "twoHanded";
  unlessMounted: boolean;
} | {
  kind: "thrown";
  thrownRange: {
      normal: number;
      long: number;
  };
} | {
  kind: "reach";
} | {
  kind: "versatile";
  twoHandedDamage: string;
} | {
  kind: "ammunition";
  ammunition: string;
} | {
  kind: "loading";
} | {
  kind: "special";
};

declare type WeaponRange = {
  kind: "melee";
  normal: number;
} | {
  kind: "ranged";
  normal: number;
  long: number;
};

export { }
