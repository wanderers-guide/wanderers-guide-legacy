
module.exports = class AbilityUtils {

    static calculateSkillBonus(charLevel, skillProfType, itemBonus, abilScore) {
        let profValue;
        if(skillProfType == 'UNTRAINED') {
            profValue = 0;
        } else if(skillProfType == 'TRAINED') {
            profValue = 2+charLevel;
        } else if(skillProfType == 'EXPERT') {
            profValue = 4+charLevel;
        } else if(skillProfType == 'MASTER') {
            profValue = 6+charLevel;
        } else if(skillProfType == 'LEGENDARY') {
            profValue = 8+charLevel;
        }
        return this.signNumber(profValue+itemBonus+this.getMod(abilScore));
    }

    static getProfSign(skillProfType) {
        let profSign;
        if(skillProfType == 'UNTRAINED') {
            profSign = '(U)';
        } else if(skillProfType == 'TRAINED') {
            profSign = '(T)';
        } else if(skillProfType == 'EXPERT') {
            profSign = '(E)';
        } else if(skillProfType == 'MASTER') {
            profSign = '(M)';
        } else if(skillProfType == 'LEGENDARY') {
            profSign = '(L)';
        }
        return profSign;
    }

    static getSkillsList(charLevel, charSkills, charAbilities) {
        return [
            this.getProfSign(charSkills.athleticsProfType)+' Athletics '+this.calculateSkillBonus(charLevel, charSkills.athleticsProfType, charSkills.athleticsItemBonus, charAbilities.STR),
            //
            this.getProfSign(charSkills.acrobaticsProfType)+' Acrobatics '+this.calculateSkillBonus(charLevel, charSkills.acrobaticsProfType, charSkills.acrobaticsItemBonus, charAbilities.DEX),
            this.getProfSign(charSkills.stealthProfType)+' Stealth '+this.calculateSkillBonus(charLevel, charSkills.stealthProfType, charSkills.stealthItemBonus, charAbilities.DEX),
            this.getProfSign(charSkills.thieveryProfType)+' Thievery '+this.calculateSkillBonus(charLevel, charSkills.thieveryProfType, charSkills.thieveryItemBonus, charAbilities.DEX),
            //
            this.getProfSign(charSkills.arcanaProfType)+' Arcana '+this.calculateSkillBonus(charLevel, charSkills.arcanaProfType, charSkills.arcanaItemBonus, charAbilities.INT),
            this.getProfSign(charSkills.craftingProfType)+' Crafting '+this.calculateSkillBonus(charLevel, charSkills.craftingProfType, charSkills.craftingItemBonus, charAbilities.INT),
            this.getProfSign(charSkills.lore_oneProfType)+' Lore ('+charSkills.lore_oneTopic+') '+this.calculateSkillBonus(charLevel, charSkills.lore_oneProfType, charSkills.lore_oneItemBonus, charAbilities.INT),
            this.getProfSign(charSkills.lore_twoProfType)+' Lore ('+charSkills.lore_twoTopic+') '+this.calculateSkillBonus(charLevel, charSkills.lore_twoProfType, charSkills.lore_twoItemBonus, charAbilities.INT),
            this.getProfSign(charSkills.occultismProfType)+' Occultism '+this.calculateSkillBonus(charLevel, charSkills.occultismProfType, charSkills.occultismItemBonus, charAbilities.INT),
            this.getProfSign(charSkills.societyProfType)+' Society '+this.calculateSkillBonus(charLevel, charSkills.societyProfType, charSkills.societyItemBonus, charAbilities.INT),
            //
            this.getProfSign(charSkills.medicineProfType)+' Medicine '+this.calculateSkillBonus(charLevel, charSkills.medicineProfType, charSkills.medicineItemBonus, charAbilities.WIS),
            this.getProfSign(charSkills.natureProfType)+' Nature '+this.calculateSkillBonus(charLevel, charSkills.natureProfType, charSkills.natureItemBonus, charAbilities.WIS),
            this.getProfSign(charSkills.religionProfType)+' Religion '+this.calculateSkillBonus(charLevel, charSkills.religionProfType, charSkills.religionItemBonus, charAbilities.WIS),
            this.getProfSign(charSkills.survivalProfType)+' Survival '+this.calculateSkillBonus(charLevel, charSkills.survivalProfType, charSkills.survivalItemBonus, charAbilities.WIS),
            //
            this.getProfSign(charSkills.deceptionProfType)+' Deception '+this.calculateSkillBonus(charLevel, charSkills.deceptionProfType, charSkills.deceptionItemBonus, charAbilities.CHA),
            this.getProfSign(charSkills.diplomacyProfType)+' Diplomacy '+this.calculateSkillBonus(charLevel, charSkills.diplomacyProfType, charSkills.diplomacyItemBonus, charAbilities.CHA),
            this.getProfSign(charSkills.intimidationProfType)+' Intimidation '+this.calculateSkillBonus(charLevel, charSkills.intimidationProfType, charSkills.intimidationItemBonus, charAbilities.CHA),
            this.getProfSign(charSkills.performanceProfType)+' Performance '+this.calculateSkillBonus(charLevel, charSkills.performanceProfType, charSkills.performanceItemBonus, charAbilities.CHA)
        ];
    }
};