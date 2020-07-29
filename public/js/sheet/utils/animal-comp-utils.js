
function getAnimalCompanionMaxHealth(charAnimal){

  let animal = g_companionData.AllAnimalCompanions.find(animal => {
      return animal.id == charAnimal.animalCompanionID;
  });
  if(animal == null){
      return -1;
  }

  let maxHP = animal.hitPoints;
  maxHP += (6+getAnimalModCon(animal, charAnimal))*g_character.level;

  return maxHP;

}

////

function getAnimalModStr(animal, charAnimal){
  let modStr = animal.modStr;
  if(charAnimal.specialization == 'BULLY'){ modStr += 1; }
  if(charAnimal.specialization == 'WRECKER'){ modStr += 1; }
  switch(charAnimal.age){
    case 'YOUNG': return modStr;
    case 'MATURE': return modStr+1;
    case 'NIMBLE': return modStr+2;
    case 'SAVAGE': return modStr+3;
    default: return -1;
  }
}

function getAnimalModDex(animal, charAnimal){
  let modDex = animal.modDex;
  if(charAnimal.specialization != 'NONE'){ modDex += 1; }
  if(charAnimal.specialization == 'AMBUSHER'){ modDex += 1; }
  if(charAnimal.specialization == 'DAREDEVIL'){ modDex += 1; }
  switch(charAnimal.age){
    case 'YOUNG': return modDex;
    case 'MATURE': return modDex+1;
    case 'NIMBLE': return modDex+3;
    case 'SAVAGE': return modDex+2;
    default: return -1;
  }
}

function getAnimalModCon(animal, charAnimal){
  let modCon = animal.modCon;
  if(charAnimal.specialization == 'RACER'){ modCon += 1; }
  switch(charAnimal.age){
    case 'YOUNG': return modCon;
    case 'MATURE': return modCon+1;
    case 'NIMBLE': return modCon+2;
    case 'SAVAGE': return modCon+2;
    default: return -1;
  }
}

function getAnimalModInt(animal, charAnimal){
  let modInt = animal.modInt;
  if(charAnimal.specialization != 'NONE'){ modInt += 2; }
  switch(charAnimal.age){
    case 'YOUNG': return modInt;
    case 'MATURE': return modInt;
    case 'NIMBLE': return modInt;
    case 'SAVAGE': return modInt;
    default: return -1;
  }
}

function getAnimalModWis(animal, charAnimal){
  let modWis = animal.modWis;
  if(charAnimal.specialization == 'TRACKER'){ modWis += 1; }
  switch(charAnimal.age){
    case 'YOUNG': return modWis;
    case 'MATURE': return modWis+1;
    case 'NIMBLE': return modWis+2;
    case 'SAVAGE': return modWis+2;
    default: return -1;
  }
}

function getAnimalModCha(animal, charAnimal){
  let modCha = animal.modCha;
  if(charAnimal.specialization == 'BULLY'){ modCha += 3; }
  switch(charAnimal.age){
    case 'YOUNG': return modCha;
    case 'MATURE': return modCha;
    case 'NIMBLE': return modCha;
    case 'SAVAGE': return modCha;
    default: return -1;
  }
}

//

function getAnimalDamageDieNumber(animal, charAnimal){
  if(charAnimal.specialization != 'NONE'){
    return 3;
  }
  switch(charAnimal.age){
    case 'YOUNG': return 1;
    case 'MATURE': return 2;
    case 'NIMBLE': return 2;
    case 'SAVAGE': return 2;
    default: return -1;
  }
}

function getAnimalAdditionalDamage(animal, charAnimal){
  switch(charAnimal.age){
    case 'YOUNG': return 0;
    case 'MATURE': return 0;
    case 'NIMBLE':
      if(charAnimal.specialization != 'NONE'){ return 4; }
      return 2;
    case 'SAVAGE':
      if(charAnimal.specialization != 'NONE'){ return 6; }
      return 3;
    default: return -1;
  }
}

//

function hasAnimalAdvancedManeuver(animal, charAnimal){
  switch(charAnimal.age){
    case 'YOUNG': return false;
    case 'MATURE': return false;
    case 'NIMBLE': return true;
    case 'SAVAGE': return true;
    default: return false;
  }
}

function hasAnimalMagicalAttacks(animal, charAnimal){
  switch(charAnimal.age){
    case 'YOUNG': return false;
    case 'MATURE': return false;
    case 'NIMBLE': return true;
    case 'SAVAGE': return true;
    default: return false;
  }
}

//

function getAnimalSpecializationText(charAnimal){
  if(charAnimal.specialization == 'NONE'){
    return null;
  } else if(charAnimal.specialization == 'AMBUSHER'){
    return 'In your companion’s natural environment, it can use a (action: Sneak) action even if it’s currently observed. It gains a +2 circumstance bonus to initiative rolls using Stealth.';
  } else if(charAnimal.specialization == 'BULLY'){
    return null;
  } else if(charAnimal.specialization == 'DAREDEVIL'){
    return 'Your companion gains the deny advantage ability, so it isn’t flat-footed to hidden, undetected, or flanking creatures unless such a creature’s level is greater than yours.';
  } else if(charAnimal.specialization == 'RACER'){
    return 'Your companion gains a +10-foot status bonus to its Speed, swim Speed, or fly Speed (your choice).';
  } else if(charAnimal.specialization == 'TRACKER'){
    return 'Your companion can move at full Speed while following tracks.';
  } else if(charAnimal.specialization == 'WRECKER'){
    return 'Your companion’s unarmed attacks ignore half an object’s Hardness.';
  }
}

//

function getAnimalUnarmedAttacksNumUps(animal, charAnimal){
  if(charAnimal.specialization != 'NONE'){
    return 2;
  }
  switch(charAnimal.age){
    case 'YOUNG': return 1;
    case 'MATURE': return 1;
    case 'NIMBLE': return 1;
    case 'SAVAGE': return 1;
    default: return -1;
  }
}

function getAnimalUnarmoredDefenseNumUps(animal, charAnimal){
  let cNumUps = 0;
  if(charAnimal.specialization == 'AMBUSHER'){ cNumUps += 1; }
  if(charAnimal.specialization == 'DAREDEVIL'){ cNumUps += 1; }
  switch(charAnimal.age){
    case 'YOUNG': return cNumUps+1;
    case 'MATURE': return cNumUps+1;
    case 'NIMBLE': return cNumUps+2;
    case 'SAVAGE': return cNumUps+1;
    default: return -1;
  }
}

//

function getAnimalSize(animal, charAnimal){
  let matureSize = function(size){
    if(size == 'TINY'){
      return 'SMALL';
    } else if(size == 'SMALL'){
      return 'MEDIUM';
    } else if(size == 'MEDIUM' || size == 'MED-LARGE'){
      return 'LARGE';
    }
    return size;
  };
  switch(charAnimal.age){
    case 'YOUNG': return animal.size;
    case 'MATURE': return matureSize(animal.size);
    case 'NIMBLE': return matureSize(animal.size);
    case 'SAVAGE': return matureSize(matureSize(animal.size));
    default: return null;
  }
}

//

function getAnimalSkillNumUps(animal, charAnimal, skillName){
  switch(skillName){
    case 'intimidation': return getAnimalIntimidationNumUps(animal, charAnimal);
    case 'stealth': return getAnimalStealthNumUps(animal, charAnimal);
    case 'survival': return getAnimalSurvivalNumUps(animal, charAnimal);
    case 'acrobatics': return getAnimalAcrobaticsNumUps(animal, charAnimal);
    case 'athletics': return getAnimalAthleticsNumUps(animal, charAnimal);
    default: return 1;
  }
}

function getAnimalAcrobaticsNumUps(animal, charAnimal){
  if(charAnimal.specialization == 'DAREDEVIL'){ return 3; }
  switch(charAnimal.age){
    case 'YOUNG': return 1;
    case 'MATURE': return 1;
    case 'NIMBLE': return 2;
    case 'SAVAGE': return 1;
    default: return -1;
  }
}

function getAnimalAthleticsNumUps(animal, charAnimal){
  let cNumUps = 0;
  if(charAnimal.specialization == 'WRECKER'){ return 3; }
  if(charAnimal.specialization == 'BULLY'){ cNumUps += 1; }
  switch(charAnimal.age){
    case 'YOUNG': return cNumUps+1;
    case 'MATURE': return cNumUps+1;
    case 'NIMBLE': return cNumUps+1;
    case 'SAVAGE': return cNumUps+2;
    default: return -1;
  }
}

function getAnimalIntimidationNumUps(animal, charAnimal){
  let cNumUps = animal.skills.includes('intimidation') ? 1 : 0;
  if(charAnimal.specialization == 'BULLY'){ cNumUps += 1; }
  switch(charAnimal.age){
    case 'YOUNG': return cNumUps+0;
    case 'MATURE': return cNumUps+1;
    case 'NIMBLE': return cNumUps+1;
    case 'SAVAGE': return cNumUps+1;
    default: return -1;
  }
}

function getAnimalStealthNumUps(animal, charAnimal){
  let cNumUps = animal.skills.includes('stealth') ? 1 : 0;
  if(charAnimal.specialization == 'AMBUSHER'){ cNumUps += 1; }
  switch(charAnimal.age){
    case 'YOUNG': return cNumUps+0;
    case 'MATURE': return cNumUps+1;
    case 'NIMBLE': return cNumUps+1;
    case 'SAVAGE': return cNumUps+1;
    default: return -1;
  }
}

function getAnimalSurvivalNumUps(animal, charAnimal){
  let cNumUps = animal.skills.includes('survival') ? 1 : 0;
  if(charAnimal.specialization == 'TRACKER'){ cNumUps += 1; }
  switch(charAnimal.age){
    case 'YOUNG': return cNumUps+0;
    case 'MATURE': return cNumUps+1;
    case 'NIMBLE': return cNumUps+1;
    case 'SAVAGE': return cNumUps+1;
    default: return -1;
  }
}

//

function getAnimalPerceptionNumUps(animal, charAnimal){
  if(charAnimal.specialization != 'NONE'){
    return 3;
  }
  switch(charAnimal.age){
    case 'YOUNG': return 1;
    case 'MATURE': return 2;
    case 'NIMBLE': return 2;
    case 'SAVAGE': return 2;
    default: return -1;
  }
}

//

function getAnimalFortitudeNumUps(animal, charAnimal){
  if(charAnimal.specialization == 'RACER'){ return 4; }
  if(charAnimal.specialization != 'NONE'){ return 3; }
  switch(charAnimal.age){
    case 'YOUNG': return 1;
    case 'MATURE': return 2;
    case 'NIMBLE': return 2;
    case 'SAVAGE': return 2;
    default: return -1;
  }
}

function getAnimalReflexNumUps(animal, charAnimal){
  if(charAnimal.specialization != 'NONE'){
    return 3;
  }
  switch(charAnimal.age){
    case 'YOUNG': return 1;
    case 'MATURE': return 2;
    case 'NIMBLE': return 2;
    case 'SAVAGE': return 2;
    default: return -1;
  }
}

function getAnimalWillNumUps(animal, charAnimal){
  if(charAnimal.specialization != 'NONE'){
    return 3;
  }
  switch(charAnimal.age){
    case 'YOUNG': return 1;
    case 'MATURE': return 2;
    case 'NIMBLE': return 2;
    case 'SAVAGE': return 2;
    default: return -1;
  }
}

