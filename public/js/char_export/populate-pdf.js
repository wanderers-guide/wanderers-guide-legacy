const { PDFDocument } = PDFLib;

function exportCharacterToPDF(){

  socket.emit("requestCharacterExportPDFInfo", 
      getCharIDFromURL());

}

socket.on("returnCharacterExportPDFInfo", async function(charInfo){

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

  const totalACField = form.getTextField('Text3');

  const totalSpeedField = form.getTextField('Text18');

  const totalClassDCField = form.getTextField('Text10');

  const totalPerceptionField = form.getTextField('Text17');

  const conditionsField = form.getTextField('CONDITIONS');

  const maxHPField = form.getTextField('Text1');
  const currentHPField = form.getTextField('CURRENT MAX');
  const tempHPField = form.getTextField('TEMPORARY');

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
  currentHPField.setText(charInfo.Character.currentHealth+'');
  tempHPField.setText(charInfo.Character.tempHealth+'');

  heroPointsField.setText(charInfo.Character.heroPoints+'');
  levelField.setText(charInfo.Character.level+'');
  xpField.setText(charInfo.Character.experience+'');

  if(charInfo.Ancestry != null){
    sizeField.setText(charInfo.Ancestry.size.charAt(0));
  }

  totalClassDCField.setText(charInfo.CalculatedStats.totalClassDC+'');
  totalPerceptionField.setText(charInfo.CalculatedStats.totalPerception+'');

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
  
  $('#pdfDownloadBtn').removeClass('is-loading');
});
