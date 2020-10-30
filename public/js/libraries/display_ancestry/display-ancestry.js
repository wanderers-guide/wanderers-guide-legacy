/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

class DisplayAncestry {
  constructor(containerID, ancestryID, featMap) {
    featMap = new Map([...featMap.entries()].sort(
      function(a, b) {
          if (a[1].Feat.level === b[1].Feat.level) {
              // Name is only important when levels are the same
              return a[1].Feat.name > b[1].Feat.name ? 1 : -1;
          }
          return a[1].Feat.level - b[1].Feat.level;
      })
    );

    let ancestryDisplayContainerID = 'ancestry-container-'+ancestryID;
    $('#'+containerID).parent().append('<div id="'+ancestryDisplayContainerID+'" class="is-hidden"></div>');
    $('#'+containerID).addClass('is-hidden');
    
    socket.emit('requestGeneralAncestry', ancestryID);
    socket.off('returnGeneralAncestry');
    socket.on("returnGeneralAncestry", function(ancestryStruct){
      $('#'+ancestryDisplayContainerID).load("/templates/display-ancestry.html");
      $.ajax({ type: "GET",
        url: "/templates/display-ancestry.html",   
        success : function(text)
        {

          $('#ancestry-back-btn').click(function() {
            $('#'+ancestryDisplayContainerID).remove();
            $('#'+containerID).removeClass('is-hidden');
          });
          $('.category-tabs li').click(function() {
            $('#'+ancestryDisplayContainerID).remove();
            $('#'+containerID).removeClass('is-hidden');
          });

          $('#ancestry-name').html(ancestryStruct.ancestry.name);
          $('#ancestry-description').html(ancestryStruct.ancestry.description);

          let sourceStr = '';
          let ancestryRarity = convertRarityToHTML(ancestryStruct.ancestry.rarity);
          if(ancestryRarity == ''){
            sourceStr = getContentSourceTextName(ancestryStruct.ancestry.contentSrc);
          } else {
            sourceStr = '<span class="pr-2">'+getContentSourceTextName(ancestryStruct.ancestry.contentSrc)+'</span>';
          }
          $('#ancestry-source').html(sourceStr+ancestryRarity);

          let boostsStr = '';
          for(let boost of ancestryStruct.boosts){
            if(boostsStr != ''){boostsStr += ', ';}
            if(boost == 'Anything'){boost = 'Free';}
            boostsStr += boost;
          }
          if(boostsStr == '') {boostsStr = 'None';}
          $('#ancestry-boosts').html(boostsStr);
          
          let flawsStr = '';
          for(let flaw of ancestryStruct.flaws){
            if(flawsStr != ''){flawsStr += ', ';}
            if(flaw == 'Anything'){flaw = 'Free';}
            flawsStr += flaw;
          }
          if(flawsStr == '') {flawsStr = 'None';}
          $('#ancestry-flaws').html(flawsStr);

          $('#ancestry-hitPoints').html(ancestryStruct.ancestry.hitPoints);
          $('#ancestry-size').html(capitalizeWord(ancestryStruct.ancestry.size));
          $('#ancestry-speed').html(ancestryStruct.ancestry.speed+' ft');

          let langStr = '';
          for(const lang of ancestryStruct.languages) {
            langStr += lang.name+', ';
          }
          langStr = langStr.substring(0, langStr.length - 2);
          $('#ancestry-languages').html(langStr);

          let bonusLangStr = '';
          ancestryStruct.bonus_languages = ancestryStruct.bonus_languages.sort(
            function(a, b) {
              return a.name > b.name ? 1 : -1;
            }
          );
          for(const bonusLang of ancestryStruct.bonus_languages) {
            bonusLangStr += bonusLang.name+', ';
          }
          $('#ancestry-languages-bonus').html('<a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="Additional languages equal to your Intelligence modifier (if it’s positive). Choose from '+bonusLangStr+'and any other languages to which you have access (such as the languages prevalent in your region).">Additional languages...</a>');

          let sensesStr = '';
          if(ancestryStruct.vision_sense != null){
            sensesStr += '<a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+ancestryStruct.vision_sense.description+'">'+ancestryStruct.vision_sense.name+'</a>';
            if(ancestryStruct.additional_sense != null){
              sensesStr += ' and ';
            }
          }
          if(ancestryStruct.additional_sense != null){
            sensesStr += '<a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+ancestryStruct.additional_sense.description+'">'+ancestryStruct.additional_sense.name+'</a>';
          }
          $('#ancestry-senses').html(sensesStr);
          
          let phyFeatsStr = '';
          if(ancestryStruct.physical_feature_one != null){
            phyFeatsStr += '<a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+ancestryStruct.physical_feature_one.description+'">'+ancestryStruct.physical_feature_one.name+'</a>';
            if(ancestryStruct.physical_feature_two != null){
              phyFeatsStr += ' and ';
            }
          }
          if(ancestryStruct.physical_feature_two != null){
            phyFeatsStr += '<a class="has-text-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="'+ancestryStruct.physical_feature_two.description+'">'+ancestryStruct.physical_feature_two.name+'</a>';
          }
          if(phyFeatsStr == ''){phyFeatsStr = 'None';}
          $('#ancestry-phyFeatures').html(phyFeatsStr);
          
          ///

          let firstHeritage = true;
          for(let heritage of ancestryStruct.heritages) {
            if(firstHeritage) {firstHeritage = false;} else {$('#ancestry-heritages').append('<hr class="m-2">');}
            $('#ancestry-heritages').append('<div style="position: relative;"><div class="pb-2"><p><span id="ancestry-name" class="is-size-5 is-bold has-text-grey-light pl-3">'+heritage.name+'</span>'+convertRarityToHTML(heritage.rarity)+'</p>'+processText(heritage.description, false, null)+'</div><span class="is-size-7 has-text-grey is-italic pr-2" style="position: absolute; bottom: 0px; right: 0px;">'+getContentSourceTextName(heritage.contentSrc)+'</span></div>');
          }

          ///

          let ancestryFeatLevel = 0;
          for(const [featID, featStruct] of featMap.entries()){
            let tag = featStruct.Tags.find(tag => {
              return tag.id === ancestryStruct.ancestry.tagID;
            });
            if(tag != null){
              if(featStruct.Feat.level <= 0) { continue; }
              if(featStruct.Feat.level > ancestryFeatLevel){
                ancestryFeatLevel = featStruct.Feat.level;
                $('#ancestry-feats').append('<div class="border-bottom border-dark-lighter has-background-black-like-more text-center is-bold"><p>Level '+ancestryFeatLevel+'</p></div>');
              }
              let featEntryID = 'ancestry-feat-'+featStruct.Feat.id;
              $('#ancestry-feats').append('<div id="'+featEntryID+'" class="border-bottom border-dark-lighter px-2 py-2 has-background-black-ter cursor-clickable"><span class="pl-4">'+featStruct.Feat.name+convertActionToHTML(featStruct.Feat.actions)+'</span><span class="is-pulled-right is-size-7 has-text-grey is-italic">'+getContentSourceTextName(featStruct.Feat.contentSrc)+'</span></div>');

              $('#'+featEntryID).click(function(){
                openQuickView('featView', {
                  Feat : featStruct.Feat,
                  Tags : featStruct.Tags
                });
              });
          
              $('#'+featEntryID).mouseenter(function(){
                $(this).removeClass('has-background-black-ter');
                $(this).addClass('has-background-grey-darker');
              });
              $('#'+featEntryID).mouseleave(function(){
                $(this).removeClass('has-background-grey-darker');
                $(this).addClass('has-background-black-ter');
              });
              
            }
          }
          
          $('#'+ancestryDisplayContainerID).removeClass('is-hidden');
        }
      });
    });
  }
}