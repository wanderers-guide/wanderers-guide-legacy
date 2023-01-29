import axios from "axios";
import { defineStore } from "pinia";

interface character {
  id?: number;
  userID?: number;
  buildID?: null | number;
  name?: string;
  level?: number;
  experience?: number;
  currentHealth?: null | number;
  tempHealth?: null | number;
  heroPoints?: null | number;
  ancestryID?: null | number;
  heritageID?: null | number;
  uniHeritageID?: null | number;
  backgroundID?: null | number;
  classID?: null | number;
  classID_2?: null | number;
  inventoryID?: number;
  notes?: any;
  rollHistoryJSON?: any;
  details?: any;
  customCode?: any;
  infoJSON?: null | {
    imageURL?: string;
    pronouns?: any;
    [k: string]: any;
  };
  dataID?: null | number;
  currentStamina?: null | number;
  currentResolve?: null | number;
  builderByLevel?: number;
  optionAutoDetectPreReqs?: number;
  optionAutoHeightenSpells?: number;
  optionPublicCharacter?: number;
  optionCustomCodeBlock?: number;
  optionDiceRoller?: number;
  optionClassArchetypes?: number;
  optionIgnoreBulk?: number;
  variantProfWithoutLevel?: number;
  variantFreeArchetype?: number;
  variantAncestryParagon?: number;
  variantStamina?: number;
  variantAutoBonusProgression?: number;
  variantGradualAbilityBoosts?: number;
  enabledSources?: any;
  enabledHomebrew?: any;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: any;
}

export const useCharacters = defineStore("characters", {
  state: (): {
    characters: character[];
    isLoaded: boolean;
  } => ({
    characters: [],
    isLoaded: false,
  }),
  actions: {
    async load() {
      if (!this.isLoaded) {
        const characterData = await axios.get("/vue-data/characters");
        this.characters = characterData.data?.characters;
        this.isLoaded = true;
      }
    },
  },
});
