/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getProfHistoryHTML(profMapKey){

  const profDataArray = g_profMap.get(profMapKey);
  const finalProfData = getFinalProf(profDataArray);

  let tooltipText = 'Proficiency History:';
  if(finalProfData == null){
    tooltipText += '\nNone';
    return '<a class="has-text-info has-tooltip-bottom text-center" data-tooltip="'+tooltipText+'">Untrained</a>';
  } else {
    for(const profData of profDataArray){
      if(!isNaN(profData.Prof)) { continue; }
      tooltipText += '\n'+profToWord(profData.Prof)+' from '+profData.SourceName;
    }
    return '<a class="has-text-info has-tooltip-bottom text-center" data-tooltip="'+tooltipText+'">'+getProfNameFromNumUps(finalProfData.NumUps)+'</a>';
  }

}
