/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getProfHistoryHTML(VARIABLE_NAME){
  VARIABLE_NAME = VARIABLE_NAME.replace(/\s/g, "_").toUpperCase();
  const variableValue = variables_getValue(VARIABLE_NAME);
  const finalRank = variables_getFinalRank(VARIABLE_NAME);

  let tooltipText = 'Proficiency History:';
  if(finalRank == 'U'){
    tooltipText += '\nNone';
    return '<a class="has-text-info has-tooltip-bottom text-center" data-tooltip="'+tooltipText+'">Untrained</a>';
  } else {
    for(const [srcStructKey, rankData] of variableValue.RankHistory){
      tooltipText += '\n'+profToWord(rankData.Rank)+' from '+rankData.SourceName;
    }
    return '<a class="has-text-info has-tooltip-bottom text-center" data-tooltip="'+tooltipText+'">'+profToWord(finalRank)+'</a>';
  }

}
