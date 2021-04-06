/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

const { PDFDocument } = PDFLib;

function getMod(abilScore) {
  let mod = Math.floor((abilScore-10)/2);
  return mod;
}

function getNumZeroIfNull(number) {
  return (number != null) ? number : 0;
}

function old_initCharacterExportToPDF(){

  $('#btn-export-to-pdf').click(function() {
    socket.emit("requestCharExportPDFInfo", activeModalCharID);
  });

}

socket.on("returnCharExportPDFInfo", function(charInfo){

  try {
    charExportGeneratePDF(charInfo);
  } catch (err) {
    console.error('Failed to generate character PDF:');
    console.error(err);
  }

});

async function charExportGeneratePDF(charInfo) {

  console.log(charInfo);

  const formUrl = '/pdf/character_sheet.pdf';
  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();

  const nameField = form.getTextField('Character Name');
  const playerNameField = form.getTextField('Player Name');
  const xpField = form.getTextField('Experience Points XP');
  const ancestryHeritageField = form.getTextField('Ancestry and Heritage');
  const backgroundField = form.getTextField('Background');
  const classField = form.getTextField('Class');
  const sizeField = form.getTextField('Size');
  const alignmentField = form.getTextField('Alignment');
  const traitsField = form.getTextField('Traits');
  const deityField = form.getTextField('Deity');
  const levelField = form.getTextField('Level');
  const heroPointsField = form.getTextField('Text2');

  const strModField = form.getTextField('Text4');
  const dexModField = form.getTextField('Text5');
  const conModField = form.getTextField('Text6');
  const intModField = form.getTextField('Text7');
  const wisModField = form.getTextField('Text8');
  const chaModField = form.getTextField('Text9');

  const strScoreField = form.getTextField('STRENGTH');
  const dexScoreField = form.getTextField('DEXTERITY');
  const conScoreField = form.getTextField('CONSTITUTION');
  const intScoreField = form.getTextField('INTELLIGENCE');
  const wisScoreField = form.getTextField('WISDOM');
  const chaScoreField = form.getTextField('CHARISMA');

  

  const totalSpeedField = form.getTextField('Text18');

  const totalClassDCField = form.getTextField('Text10');

  // //
  const totalACField = form.getTextField('Text3');
  const acDexModField = form.getTextField('Text12');
  const acCapField = form.getTextField('Text13');
  const acProfBonusField = form.getTextField('PROF');
  const acProfTrainedField = form.getTextField('Check Box4');
  const acProfExpertField = form.getTextField('Check Box5');
  const acProfMasterField = form.getTextField('Check Box6');
  const acProfLegendaryField = form.getTextField('Check Box7');
  const acItemBonusField = form.getTextField('ITEM');

  const unarmoredProfTrainedField = form.getTextField('Check Box28');
  const unarmoredProfExpertField = form.getTextField('Check Box29');
  const unarmoredProfMasterField = form.getTextField('Check Box30');
  const unarmoredProfLegendaryField = form.getTextField('Check Box31');

  const lightArmorProfTrainedField = form.getTextField('Check Box32');
  const lightArmorProfExpertField = form.getTextField('Check Box33');
  const lightArmorProfMasterField = form.getTextField('Check Box34');
  const lightArmorProfLegendaryField = form.getTextField('Check Box35');

  const mediumArmorProfTrainedField = form.getTextField('Check Box36');
  const mediumArmorProfExpertField = form.getTextField('Check Box37');
  const mediumArmorProfMasterField = form.getTextField('Check Box38');
  const mediumArmorProfLegendaryField = form.getTextField('Check Box39');

  const heavyArmorProfTrainedField = form.getTextField('Check Box40');
  const heavyArmorProfExpertField = form.getTextField('Check Box41');
  const heavyArmorProfMasterField = form.getTextField('Check Box42');
  const heavyArmorProfLegendaryField = form.getTextField('Check Box43');
  
  const shieldACBonusField = form.getTextField('Text16');
  const shieldHardnessField = form.getTextField('HARDNESS');
  const shieldHealthAndBTField = form.getTextField('BT');
  const shieldCurrentHPField = form.getTextField('CURRENT HP');

  // //
  const totalFortField = form.getTextField('Text11');
  const fortConModField = form.getTextField('CON');
  const fortProfBonusField = form.getTextField('PROF_2');
  const fortItemBonusField = form.getTextField('ITEM_2');
  
  // Field names: https://www.pdfescape.com

  // //
  const maxHPField = form.getTextField('Text1');
  const currentHPField = form.getTextField('CURRENT MAX');
  const tempHPField = form.getTextField('TEMPORARY');

  const dyingField = form.getTextField('DYING');
  const woundedField = form.getTextField('WOUNDED');

  const resistancesField = form.getTextField('RESISTANCES AND IMMUNITIES');

  const conditionsField = form.getTextField('CONDITIONS');


  const totalPerceptionField = form.getTextField('Text17');
  const perceptionWisModField = form.getTextField('WIS_2');
  const perceptionProfBonusField = form.getTextField('PROF_5');
  const perceptionProfTrainedField = form.getTextField('Check Box24');
  const perceptionProfExpertField = form.getTextField('Check Box25');
  const perceptionProfMasterField = form.getTextField('Check Box26');
  const perceptionProfLegendaryField = form.getTextField('Check Box27');
  const perceptionItemBonusField = form.getTextField('ITEM_5');
  
  const sensesField = form.getTextField('SENSES');







  console.log(charInfo);

  ////

  nameField.setText(charInfo.Character.name);

  let heritageAndAncestryName = '';
  if(charInfo.Heritage == null){
      heritageAndAncestryName = charInfo.Ancestry.name;
  } else {
      if(charInfo.Heritage.tagID != null){
          heritageAndAncestryName = charInfo.Heritage.name+' '+charInfo.Ancestry.name;
      } else {
          heritageAndAncestryName = charInfo.Heritage.name;
      }
  }
  ancestryHeritageField.setText(heritageAndAncestryName);

  if(charInfo.Class != null){
    classField.setText(charInfo.Class.name);
  }

  if(charInfo.Background != null){
    backgroundField.setText(charInfo.Background.name);
  }

  //

  totalACField.setText(charInfo.CalculatedStats.totalAC+'');
  totalSpeedField.setText(charInfo.CalculatedStats.totalSpeed+'');

  maxHPField.setText(charInfo.CalculatedStats.maxHP+'');
  currentHPField.setText(getNumZeroIfNull(charInfo.Character.currentHealth)+'');
  tempHPField.setText(getNumZeroIfNull(charInfo.Character.tempHealth)+'');

  heroPointsField.setText(charInfo.Character.heroPoints+'');
  levelField.setText(charInfo.Character.level+'');
  xpField.setText(getNumZeroIfNull(charInfo.Character.experience)+'');

  if(charInfo.Ancestry != null){
    sizeField.setText(charInfo.Ancestry.size.charAt(0));
  }

  totalClassDCField.setText(charInfo.CalculatedStats.totalClassDC+'');
  totalPerceptionField.setText(signNumber(charInfo.CalculatedStats.totalPerception));

  let totalAbilityScores = JSON.parse(charInfo.CalculatedStats.totalAbilityScores);
  for(let abilityScore of totalAbilityScores){
    switch(abilityScore.Name){
      case 'Strength':
        strScoreField.setText(abilityScore.Score+'');
        strModField.setText(signNumber(getMod(abilityScore.Score))+'');
        break;
      case 'Dexterity':
        dexScoreField.setText(abilityScore.Score+'');
        dexModField.setText(signNumber(getMod(abilityScore.Score))+'');
        break;
      case 'Constitution':
        conScoreField.setText(abilityScore.Score+'');
        conModField.setText(signNumber(getMod(abilityScore.Score))+'');
        break;
      case 'Intelligence':
        intScoreField.setText(abilityScore.Score+'');
        intModField.setText(signNumber(getMod(abilityScore.Score))+'');
        break;
      case 'Wisdom':
        wisScoreField.setText(abilityScore.Score+'');
        wisModField.setText(signNumber(getMod(abilityScore.Score))+'');
        break;
      case 'Charisma':
        chaScoreField.setText(abilityScore.Score+'');
        chaModField.setText(signNumber(getMod(abilityScore.Score))+'');
        break;
      default: break;
    }
  }

  let charConditionsString = '';
  let charConditionsMap = objToMap(charInfo.ConditionsObject);
  for(const [conditionID, conditionData] of charConditionsMap.entries()){
    charConditionsString += conditionData.Condition.name;
    if(conditionData.Value != null){
      charConditionsString += ' '+conditionData.Value;
    }
    charConditionsString += ', ';
  }
  charConditionsString = charConditionsString.slice(0, -2);// Trim off that last ', '
  conditionsField.setText(charConditionsString);

  let charTraitString = '';
  for(let charTag of charInfo.CharTags){
    charTraitString += charTag.value+', ';
  }
  charTraitString = charTraitString.slice(0, -2);// Trim off that last ', '
  traitsField.setText(charTraitString);



  const pdfBytes = await pdfDoc.save();

  // Trigger the browser to download the PDF document
  download(pdfBytes, charInfo.Character.name+" - Character Sheet.pdf", "application/pdf");
  
  $('.modal-card-close').trigger('click');

}
