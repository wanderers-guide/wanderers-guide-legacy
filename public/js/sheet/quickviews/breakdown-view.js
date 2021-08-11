/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

/*
  data
    title
    breakdownTitle
    breakdownTotal
    breakdownStartStr
    breakdownMap - Key = Source, Value = value
    conditionalMap - Key = Condition, Value = value
    isBonus
*/
function openBreakdownQuickview(data) {
    addBackFunctionality(data);

    $('#quickViewTitle').html(data.title);

    let qContent = $('#quickViewContent');
    
    if(data.breakdownMap != null){
      qContent.append('<p class="has-text-centered"><strong>'+data.breakdownTitle+' Breakdown</strong></p>');

      if(gOption_hasDiceRoller) { refreshStatRollButtons(); }
      let rollerClass = (data.isBonus) ? 'stat-roll-btn' : 'damage-roll-btn';

      let breakdownTotal = data.breakdownTotal;
      if(data.breakdownTotalWeapMod != null){
        breakdownTotal += data.breakdownTotalWeapMod;
      }

      let breakDownInnerHTML = '<p class="has-text-centered"><span class="'+rollerClass+'">'+breakdownTotal+'</span> = ';
      if(data.breakdownStartStr != '') { breakDownInnerHTML += data.breakdownStartStr + ' + '; }
      for(const [source, amount] of data.breakdownMap.entries()){
        if(amount != 0){
          breakDownInnerHTML += '<a class="has-text-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+source+'">'+amount+'</a>';
          breakDownInnerHTML += ' + ';
        }
      }

      if(data.modifications != null){
        for(const onHitDmgMod of data.modifications.on_hit_damage){
          
          let modification = onHitDmgMod.mod;
          if(modification.startsWith('-')){
            modification = modification.slice(1);
            breakDownInnerHTML = breakDownInnerHTML.slice(0, -3);// Trim off that last ' + '
            breakDownInnerHTML += ' - ';
          }

          let source = '';
          if(onHitDmgMod.info == 'InvItem'){
            source = 'From Item';
          } else if(onHitDmgMod.info == 'PropertyRune'){
            source = 'From Propery Rune';
          }

          breakDownInnerHTML += `
              <a class="has-text-link has-tooltip-bottom" data-tooltip="${source}">${modification}</a>`;
          breakDownInnerHTML += ' + ';

        }
      }

      breakDownInnerHTML = breakDownInnerHTML.slice(0, -3);// Trim off that last ' + '
      breakDownInnerHTML += '</p>';
      qContent.append(breakDownInnerHTML);
    }

    if(data.modifications != null && data.modifications.on_hit_other.length > 0){

      qContent.append('<hr class="m-2">');

      for(const onHitOtherMod of data.modifications.on_hit_other){

        let source = '';
        if(onHitOtherMod.info == 'InvItem'){
          source = 'From Item';
        } else if(onHitOtherMod.info == 'PropertyRune'){
          source = 'From Propery Rune';
        }

        qContent.append(`<p class="has-text-centered"><a class="is-underlined-link has-tooltip-bottom" data-tooltip="${source}">${onHitOtherMod.mod}</a></p>`);

      }

    }

    if(data.conditionalMap != null && data.conditionalMap.size != 0){

        qContent.append('<hr class="m-2">');

        qContent.append('<p class="has-text-centered"><strong>Conditionals</strong></p>');
        
        for(const [condition, value] of data.conditionalMap.entries()){
          let conditional = condition;
          if(gOption_hasDiceRoller){
            conditional = processDiceNotation(conditional);
            refreshDiceNotationButtons();
          }
          if(value == null){
            qContent.append('<p class="has-text-centered">'+conditional+'</p>');
          } else {
            qContent.append('<p class="has-text-centered">'+signNumber(value)+' '+conditional+'</p>');
          }
        }

    }

}