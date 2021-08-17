/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getProfHistoryHTML(VARIABLE_NAME){
  VARIABLE_NAME = VARIABLE_NAME.replace(/\s/g, "_").toUpperCase();
  let variableValue = variables_getValue(VARIABLE_NAME);

  let tooltipText = 'Proficiency History:';
  if(variableValue.Rank == 'U'){
    tooltipText += '\nNone';
    return '<a class="has-text-info has-tooltip-bottom text-center" data-tooltip="'+tooltipText+'">Untrained</a>';
  } else {
    for(const [source, rank] of variableValue.RankHistory){
      tooltipText += '\n'+profToWord(rank)+' from '+source;
    }
    return '<a class="has-text-info has-tooltip-bottom text-center" data-tooltip="'+tooltipText+'">'+profToWord(variableValue.Rank)+'</a>';
  }

}
