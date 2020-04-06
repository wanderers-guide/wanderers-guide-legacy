
function displayFeat(locationID, feat){

    $('#'+locationID).html('');
    
    let featInnerHTML = '<br>';
  
    featInnerHTML += '<div class="card"><div class="card-header level is-shadowless is-marginless"><div class="level-left is-size-4">';
  
    featInnerHTML += '<span>'+feat.Feat.name+'</span>';
  
    switch(feat.Feat.actions) {
      case 'FREE_ACTION': featInnerHTML += '<span class="px-2 pf-icon">[free-action]</span>'; break;
      case 'REACTION': featInnerHTML += '<span class="px-2 pf-icon">[reaction]</span>'; break;
      case 'ACTION': featInnerHTML += '<span class="px-2 pf-icon">[one-action]</span>'; break;
      case 'TWO_ACTIONS': featInnerHTML += '<span class="px-2 pf-icon">[two-actions]</span>'; break;
      case 'THREE_ACTIONS': featInnerHTML += '<span class="px-2 pf-icon">[three-actions]</span>'; break;
      default: break;
    }
  
    if(feat.Feat.level > 0){
      featInnerHTML += '</div><div class="level-right is-size-4">Lvl '+feat.Feat.level+'</div></div>';
    } else {
      featInnerHTML += '</div><div class="level-right is-size-4"></div></div>';
    }
  
    featInnerHTML += '<div class="card-content has-text-left pt-1"><div class="buttons is-marginless">';
    switch(feat.Feat.rarity) {
      case 'UNCOMMON': featInnerHTML += '<button class="button is-marginless mr-2 is-small is-primary">Uncommon</button>';
        break;
      case 'RARE': featInnerHTML += '<button class="button is-marginless mr-2 is-small is-success">Rare</button>';
        break;
      case 'UNIQUE': featInnerHTML += '<button class="button is-marginless mr-2 is-small is-danger">Unique</button>';
        break;
      default: break;
    }
    for(const tag of feat.Tags){
      featInnerHTML += '<button class="button is-marginless mr-2 is-small is-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+tag.description+'">'+tag.name+'</button>';
    }
  
    featInnerHTML += '</div>';
  
    let foundReq = false;
    if(feat.Feat.prerequisites != null){
      foundReq = true;
      featInnerHTML += '<div><span><strong>Prerequisites: </strong></span><span>'+feat.Feat.prerequisites+'</span></div>';
    }
    if(feat.Feat.frequency != null){
      foundReq = true;
      featInnerHTML += '<div><span><strong>Frequency: </strong></span><span>'+feat.Feat.frequency+'</span></div>';
    }
    if(feat.Feat.trigger != null){
      foundReq = true;
      featInnerHTML += '<div><span><strong>Trigger: </strong></span><span>'+feat.Feat.trigger+'</span></div>';
    }
    if(feat.Feat.requirements != null){
      foundReq = true;
      featInnerHTML += '<div><span><strong>Requirements: </strong></span><span>'+feat.Feat.requirements+'</span></div>';
    }
  
    if(foundReq){
      featInnerHTML += '<hr class="m-1">';
    }
  
    featInnerHTML += '<div>'+processText(feat.Feat.description)+'</div>';
  
    if(feat.Feat.special != null){
      featInnerHTML += '<div><span><strong>Special: </strong></span><span>'+feat.Feat.special+'</span></div>';
    }
  
    featInnerHTML += '<div id="'+locationID+'Code"></div>';
  
    featInnerHTML += '</div></div>';
  
    $('#'+locationID).html(featInnerHTML);
  
  }