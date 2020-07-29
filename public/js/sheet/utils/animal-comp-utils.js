
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
  switch(charAnimal.age){
    case 'YOUNG': return animal.modStr;
    case 'MATURE': return animal.modStr+1;
    case 'NIMBLE': return animal.modStr+2;
    case 'SAVAGE': return animal.modStr+3;
    default: return -1;
  }
}

function getAnimalModDex(animal, charAnimal){
  let modDex = animal.modDex;
  if(charAnimal.specialization != 'NONE'){
    modDex += 1;
  }
  switch(charAnimal.age){
    case 'YOUNG': return modDex;
    case 'MATURE': return modDex+1;
    case 'NIMBLE': return modDex+3;
    case 'SAVAGE': return modDex+2;
    default: return -1;
  }
}

function getAnimalModCon(animal, charAnimal){
  switch(charAnimal.age){
    case 'YOUNG': return animal.modCon;
    case 'MATURE': return animal.modCon+1;
    case 'NIMBLE': return animal.modCon+2;
    case 'SAVAGE': return animal.modCon+2;
    default: return -1;
  }
}

function getAnimalModInt(animal, charAnimal){
  let modInt = animal.modInt;
  if(charAnimal.specialization != 'NONE'){
    modInt += 2;
  }
  switch(charAnimal.age){
    case 'YOUNG': return modInt;
    case 'MATURE': return modInt;
    case 'NIMBLE': return modInt;
    case 'SAVAGE': return modInt;
    default: return -1;
  }
}

function getAnimalModWis(animal, charAnimal){
  switch(charAnimal.age){
    case 'YOUNG': return animal.modWis;
    case 'MATURE': return animal.modWis+1;
    case 'NIMBLE': return animal.modWis+2;
    case 'SAVAGE': return animal.modWis+2;
    default: return -1;
  }
}

function getAnimalModCha(animal, charAnimal){
  switch(charAnimal.age){
    case 'YOUNG': return animal.modCha;
    case 'MATURE': return animal.modCha;
    case 'NIMBLE': return animal.modCha;
    case 'SAVAGE': return animal.modCha;
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
  switch(charAnimal.age){
    case 'YOUNG': return 1;
    case 'MATURE': return 1;
    case 'NIMBLE': return 2;
    case 'SAVAGE': return 1;
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
  switch(charAnimal.age){
    case 'YOUNG': return 1;
    case 'MATURE': return 1;
    case 'NIMBLE': return 2;
    case 'SAVAGE': return 1;
    default: return -1;
  }
}

function getAnimalAthleticsNumUps(animal, charAnimal){
  switch(charAnimal.age){
    case 'YOUNG': return 1;
    case 'MATURE': return 1;
    case 'NIMBLE': return 1;
    case 'SAVAGE': return 2;
    default: return -1;
  }
}

function getAnimalIntimidationNumUps(animal, charAnimal){
  let cNumUps = animal.skills.includes('intimidation') ? 1 : 0;
  switch(charAnimal.age){
    case 'YOUNG': return 0+cNumUps;
    case 'MATURE': return 1+cNumUps;
    case 'NIMBLE': return 1+cNumUps;
    case 'SAVAGE': return 1+cNumUps;
    default: return -1;
  }
}

function getAnimalStealthNumUps(animal, charAnimal){
  let cNumUps = animal.skills.includes('stealth') ? 1 : 0;
  switch(charAnimal.age){
    case 'YOUNG': return 0+cNumUps;
    case 'MATURE': return 1+cNumUps;
    case 'NIMBLE': return 1+cNumUps;
    case 'SAVAGE': return 1+cNumUps;
    default: return -1;
  }
}

function getAnimalSurvivalNumUps(animal, charAnimal){
  let cNumUps = animal.skills.includes('survival') ? 1 : 0;
  switch(charAnimal.age){
    case 'YOUNG': return 0+cNumUps;
    case 'MATURE': return 1+cNumUps;
    case 'NIMBLE': return 1+cNumUps;
    case 'SAVAGE': return 1+cNumUps;
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

