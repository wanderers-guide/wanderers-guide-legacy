/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

class DisplayArchetype {
  constructor(containerID, archetypeID, featMap) {
    featMap = new Map([...featMap.entries()].sort(
      function(a, b) {
          if (a[1].Feat.level === b[1].Feat.level) {
              // Name is only important when levels are the same
              return a[1].Feat.name > b[1].Feat.name ? 1 : -1;
          }
          return a[1].Feat.level - b[1].Feat.level;
      })
    );

    let archetypeDisplayContainerID = 'archetype-container-'+archetypeID;
    $('#'+containerID).parent().append('<div id="'+archetypeDisplayContainerID+'" class="is-hidden"></div>');
    $('#'+containerID).addClass('is-hidden');

    socket.emit('requestGeneralArchetype', archetypeID);
    socket.off('returnGeneralArchetype');
    socket.on("returnGeneralArchetype", function(archetypeStruct){
      $('#'+archetypeDisplayContainerID).load("/templates/display-archetype.html");
      $.ajax({ type: "GET",
        url: "/templates/display-archetype.html",
        success : function(text)
        {

          $('#archetype-back-btn').click(function() {
            $('#'+archetypeDisplayContainerID).remove();
            $('#'+containerID).removeClass('is-hidden');
          });
          $('.category-tabs li').click(function() {
            $('#'+archetypeDisplayContainerID).remove();
            $('#'+containerID).removeClass('is-hidden');
          });

          $('#archetype-name').html(archetypeStruct.archetype.name);
          $('#archetype-description').html(processText(archetypeStruct.archetype.description, false, null));

          let dedFeatStruct = featMap.get(archetypeStruct.archetype.dedicationFeatID+'');

          let sourceStr = '';
          let archetypeRarity = convertRarityToHTML(dedFeatStruct.Feat.rarity);
          if(archetypeRarity == ''){
            sourceStr = getContentSourceTextName(archetypeStruct.archetype.contentSrc);
          } else {
            sourceStr = '<span class="pr-2">'+getContentSourceTextName(archetypeStruct.archetype.contentSrc)+'</span>';
          }
          $('#archetype-source').html(sourceStr+archetypeRarity);

          ///
          
          $('#archetype-ded-feat-name').html(dedFeatStruct.Feat.name);
          $('#archetype-ded-feat-level').html('Lvl '+dedFeatStruct.Feat.level);

          $('#archetype-ded-feat-container').click(function(){
            openQuickView('featView', {
              Feat : dedFeatStruct.Feat,
              Tags : dedFeatStruct.Tags
            });
          });
      
          $('#archetype-ded-feat-container').mouseenter(function(){
            $(this).removeClass('has-background-black-ter');
            $(this).addClass('has-background-grey-darker');
          });
          $('#archetype-ded-feat-container').mouseleave(function(){
            $(this).removeClass('has-background-grey-darker');
            $(this).addClass('has-background-black-ter');
          });

          ///

          let archetypeFeatLevel = 0;
          for(const [featID, featStruct] of featMap.entries()){
            let tag = featStruct.Tags.find(tag => {
              return tag.id === archetypeStruct.archetype.tagID;
            });
            if(tag != null){
              if(featStruct.Feat.level <= 0) { continue; }
              if(featStruct.Feat.level > archetypeFeatLevel){
                archetypeFeatLevel = featStruct.Feat.level;
                $('#archetype-feats').append('<div class="border-bottom border-dark-lighter has-background-black-like-more text-center is-bold"><p>Level '+archetypeFeatLevel+'</p></div>');
              }
              let featEntryID = 'archetype-feat-'+featStruct.Feat.id;
              $('#archetype-feats').append('<div id="'+featEntryID+'" class="border-bottom border-dark-lighter px-2 py-2 has-background-black-ter cursor-clickable"><span class="pl-4">'+featStruct.Feat.name+convertActionToHTML(featStruct.Feat.actions)+'</span><span class="is-pulled-right is-size-7 has-text-grey is-italic">'+getContentSourceTextName(featStruct.Feat.contentSrc)+'</span></div>');

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
          
          $('#'+archetypeDisplayContainerID).removeClass('is-hidden');
        }
      });
    });
  }
}