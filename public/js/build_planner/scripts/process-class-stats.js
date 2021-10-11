
/*

  outputStruct: {
    keyAbility: {
      displayID,
      codeID,
    },
    hitPoints: {
      displayID,
      codeID,
    },

    perception: {
      displayID,
      codeID,
    },
    skills: {
      displayID,
      codeID,
    },
    savingThrows: {
      displayID,
      codeID,
    },
    classDC: {
      displayID,
      codeID,
    },
    attacks: {
      displayID,
      codeID,
    },
    defenses: {
      displayID,
      codeID,
    },
  }

*/

const PROCESS_CLASS_STATS_TYPE = {
  DISPLAY: 'DISPLAY',
  RUN_CODE: 'RUN_CODE',
  BOTH: 'BOTH',
};

function processClassStats(classData, outputStruct, processType){
  const isBoth = (processType == PROCESS_CLASS_STATS_TYPE.BOTH);

  let statInitCount = 0;
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Key Ability ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  if(processType == PROCESS_CLASS_STATS_TYPE.RUN_CODE || isBoth){
    $('#'+outputStruct.keyAbility.codeID).html(``);
  }
  
  if(classData.keyAbility == 'OTHER'){

    if(processType == PROCESS_CLASS_STATS_TYPE.DISPLAY || isBoth){
      $('#'+outputStruct.keyAbility.displayID).html(`
        <p class="is-size-5">
          Other
        </p>
      `);
    }

  } else if(classData.keyAbility.includes(' or ')) {

    let keyAbilityOptionArray = classData.keyAbility.split(' or ');

    if(processType == PROCESS_CLASS_STATS_TYPE.RUN_CODE || isBoth){

      processCode(
        `SET-KEY-ABILITY=${shortenAbilityType(keyAbilityOptionArray[0])},${shortenAbilityType(keyAbilityOptionArray[1])}`,
        {
          sourceType: 'class',
          sourceLevel: 1,
          sourceCode: 'keyAbility',
          sourceCodeSNum: 'a'
        },
        outputStruct.keyAbility.codeID,
        {source: 'Class', sourceName: 'Initial Class'});

    } else {

      $('#'+outputStruct.keyAbility.displayID).html(`
        <p class="is-size-5">
          ${classData.keyAbility}
        </p>
      `);

    }

  } else {
    
    if(processType == PROCESS_CLASS_STATS_TYPE.DISPLAY || isBoth){
      $('#'+outputStruct.keyAbility.displayID).html(`
        <p class="is-size-5">
          ${classData.keyAbility}
        </p>
      `);
    }

    if(processType == PROCESS_CLASS_STATS_TYPE.RUN_CODE || isBoth){
      processCode(
        `SET-KEY-ABILITY=${shortenAbilityType(classData.keyAbility)}`,
        {
          sourceType: 'class',
          sourceLevel: 1,
          sourceCode: 'keyAbility',
          sourceCodeSNum: 'a'
        },
        outputStruct.keyAbility.codeID,
        {source: 'Class', sourceName: 'Initial Class'});
    }

  }


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Hit Points ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  if(processType == PROCESS_CLASS_STATS_TYPE.DISPLAY || isBoth){
    $('#'+outputStruct.hitPoints.displayID).html(`
      <p class="is-inline is-size-5">
        ${classData.hitPoints}
      </p>
    `);
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Perception ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  if(processType == PROCESS_CLASS_STATS_TYPE.DISPLAY || isBoth){
    $('#'+outputStruct.perception.displayID).html(`
      <ul>
        <li>
          ${profToWord(classData.tPerception)}
        </li>
      </ul>
    `);
  }

  if(processType == PROCESS_CLASS_STATS_TYPE.RUN_CODE || isBoth){
    processCode(
      `GIVE-PROF-IN=${VARIABLE.PERCEPTION}:${classData.tPerception}`,
      {
        sourceType: 'class',
        sourceLevel: 1,
        sourceCode: 'inits-'+statInitCount,
        sourceCodeSNum: 'a',
      },
      outputStruct.perception.codeID,
      {source: 'Class', sourceName: 'Initial Class'});
    statInitCount++;
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Skills ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
  
  if(processType == PROCESS_CLASS_STATS_TYPE.RUN_CODE || isBoth){
    $('#'+outputStruct.skills.codeID).html(``);
  }
  
  let profSkillsInner = '';

  let tSkillsArray;
  if(classData.tSkills != null){
      tSkillsArray = classData.tSkills.split(', ');
  } else {
      tSkillsArray = [];
  }
  for(const tSkill of tSkillsArray){

      if(tSkill.includes(' or ')){
    
        let tSkillsOptionArray = tSkill.split(' or ');

        if(processType == PROCESS_CLASS_STATS_TYPE.RUN_CODE || isBoth){

          processCode(
            `GIVE-SKILL=T[${tSkillsOptionArray[0]},${tSkillsOptionArray[1]}]`,
            {
              sourceType: 'class',
              sourceLevel: 1,
              sourceCode: 'inits-'+statInitCount,
              sourceCodeSNum: 'a',
            },
            outputStruct.skills.codeID,
            {source: 'Class', sourceName: 'Initial Class'});
          statInitCount++;

        } else {

          profSkillsInner += '<li>Trained in '+tSkill+'</li>';

        }

      } else {

        if(processType == PROCESS_CLASS_STATS_TYPE.DISPLAY || isBoth){
          profSkillsInner += '<li>Trained in '+tSkill+'</li>';
        }

        if(processType == PROCESS_CLASS_STATS_TYPE.RUN_CODE || isBoth){
          processCode(
            `GIVE-PROF-IN=${tSkill.replace(/ /g,'_')}:T`,
            {
              sourceType: 'class',
              sourceLevel: 1,
              sourceCode: 'inits-'+statInitCount,
              sourceCodeSNum: 'a',
            },
            outputStruct.skills.codeID,
            {source: 'Class', sourceName: 'Initial Class'});
          statInitCount++;
        }

      }

  }

  if(processType == PROCESS_CLASS_STATS_TYPE.DISPLAY || isBoth){
    profSkillsInner += `
      <li>
        Trained in <a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="You will get to select training in an additional number of skills equal to ${classData.tSkillsMore} plus your Intelligence modifer in the Finalize step">${classData.tSkillsMore}*</a> more skills
      </li>
    `;
    $('#'+outputStruct.skills.displayID).html(`<ul>${profSkillsInner}</ul>`);
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Saving Throws ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  if(processType == PROCESS_CLASS_STATS_TYPE.DISPLAY || isBoth){
    $('#'+outputStruct.savingThrows.displayID).html(`
      <ul>
        <li>${profToWord(classData.tFortitude)} in Fortitude</li>
        <li>${profToWord(classData.tReflex)} in Reflex</li>
        <li>${profToWord(classData.tWill)} in Will</li>
      </ul>
    `);
  }

  if(processType == PROCESS_CLASS_STATS_TYPE.RUN_CODE || isBoth){
    processCode(
        `GIVE-PROF-IN=${VARIABLE.SAVE_FORT}:${classData.tFortitude}`,
        {
          sourceType: 'class',
          sourceLevel: 1,
          sourceCode: 'inits-'+statInitCount,
          sourceCodeSNum: 'a',
        },
        outputStruct.savingThrows.codeID,
        {source: 'Class', sourceName: 'Initial Class'});
    statInitCount++;

    processCode(
        `GIVE-PROF-IN=${VARIABLE.SAVE_REFLEX}:${classData.tReflex}`,
        {
          sourceType: 'class',
          sourceLevel: 1,
          sourceCode: 'inits-'+statInitCount,
          sourceCodeSNum: 'a',
        },
        outputStruct.savingThrows.codeID,
        {source: 'Class', sourceName: 'Initial Class'});
    statInitCount++;

    processCode(
        `GIVE-PROF-IN=${VARIABLE.SAVE_WILL}:${classData.tWill}`,
        {
          sourceType: 'class',
          sourceLevel: 1,
          sourceCode: 'inits-'+statInitCount,
          sourceCodeSNum: 'a',
        },
        outputStruct.savingThrows.codeID,
        {source: 'Class', sourceName: 'Initial Class'});
    statInitCount++;
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Attacks ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  let profAttacksInner = '';

  let tWeaponsArray = [];
  if(classData.tWeapons != null) { tWeaponsArray = classData.tWeapons.split(',,, '); }
  for(const tWeapons of tWeaponsArray){
      
      let sections = tWeapons.split(':::');
      let weapTraining = sections[0];
      let weaponName = sections[1];

      let weapID;
      let profConvertData = g_profConversionMap.get(weaponName.replace(/\s+/g,'').toUpperCase());
      if(profConvertData != null){
          weapID = profConvertData.Name;
      } else {
          weapID = weaponName.replace(/\s+/g,'_').toUpperCase();
      }

      if(weaponName.slice(-1) === 's'){
          // is plural
          profAttacksInner += `<li>${profToWord(weapTraining)+" in all "+weaponName}</li>`;
      } else {
          // is singular
          profAttacksInner += `<li>${profToWord(weapTraining)+" in the "+weaponName}</li>`;
      }

      if(processType == PROCESS_CLASS_STATS_TYPE.RUN_CODE || isBoth){
        processCode(
          `GIVE-PROF-IN=${weapID}:${weapTraining}`,
          {
            sourceType: 'class',
            sourceLevel: 1,
            sourceCode: 'inits-'+statInitCount,
            sourceCodeSNum: 'a',
          },
          outputStruct.attacks.codeID,
          {source: 'Class', sourceName: 'Initial Class'});
        statInitCount++;
      }

  }
  if(classData.weaponsExtra != null) {
    let weapLines = classData.weaponsExtra.split('\n');
    for(const weapLine of weapLines){
      profAttacksInner += `<li>${weapLine}</li>`;
    }
  }

  if(processType == PROCESS_CLASS_STATS_TYPE.DISPLAY || isBoth){
    $('#'+outputStruct.attacks.displayID).html(`<ul>${profAttacksInner}</ul>`);
  }


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Defenses ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
  
  let profDefensesInner = '';

  let tArmorArray = [];
  if(classData.tArmor != null) { tArmorArray = classData.tArmor.split(',,, '); }
  for(const tArmor of tArmorArray){

      let sections = tArmor.split(':::');
      let armorTraining = sections[0];
      let armorName = sections[1];

      let armorID;
      let profConvertData = g_profConversionMap.get(armorName.replace(/\s+/g,'').toUpperCase());
      if(profConvertData != null){
          armorID = profConvertData.Name;
      } else {
          armorID = armorName.replace(/\s+/g,'_').toUpperCase();
      }

      profAttacksInner += `<li>${profToWord(armorTraining)+" in all "+armorName}</li>`;

      if(processType == PROCESS_CLASS_STATS_TYPE.RUN_CODE || isBoth){
        processCode(
          `GIVE-PROF-IN=${armorID}:${armorTraining}`,
          {
            sourceType: 'class',
            sourceLevel: 1,
            sourceCode: 'inits-'+statInitCount,
            sourceCodeSNum: 'a',
          },
          outputStruct.defenses.codeID,
          {source: 'Class', sourceName: 'Initial Class'});
        statInitCount++;
      }

  }

  if(processType == PROCESS_CLASS_STATS_TYPE.DISPLAY || isBoth){
    $('#'+outputStruct.defenses.displayID).html(`<ul>${profDefensesInner}</ul>`);
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Class DC ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  if(processType == PROCESS_CLASS_STATS_TYPE.DISPLAY || isBoth){
    $('#'+outputStruct.classDC.displayID).html(`
      <ul>
        <li>
          ${profToWord(classData.tClassDC)}
        </li>
      </ul>
    `);
  }

  if(processType == PROCESS_CLASS_STATS_TYPE.RUN_CODE || isBoth){
    processCode(
      `GIVE-PROF-IN=${VARIABLE.CLASS_DC}:${classData.tClassDC}`,
      {
        sourceType: 'class',
        sourceLevel: 1,
        sourceCode: 'inits-'+statInitCount,
        sourceCodeSNum: 'a',
      },
      outputStruct.classDC.codeID,
      {source: 'Class', sourceName: 'Initial Class'});
    statInitCount++;
  }

}
