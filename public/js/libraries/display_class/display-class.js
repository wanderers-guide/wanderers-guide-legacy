/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

class DisplayClass {
  constructor(containerID, classID, featMap) {
    featMap = new Map([...featMap.entries()].sort(
      function(a, b) {
          if (a[1].Feat.level === b[1].Feat.level) {
              // Name is only important when levels are the same
              return a[1].Feat.name > b[1].Feat.name ? 1 : -1;
          }
          return a[1].Feat.level - b[1].Feat.level;
      })
    );

    let classDisplayContainerID = 'class-container-'+classID;
    $('#'+containerID).parent().append('<div id="'+classDisplayContainerID+'" class="is-hidden"></div>');
    $('#'+containerID).addClass('is-hidden');

    socket.emit('requestGeneralClass', classID);
    socket.off('returnGeneralClass');
    socket.on("returnGeneralClass", function(classStruct){
      $('#'+classDisplayContainerID).load("/templates/display-class.html");
      $.ajax({ type: "GET",
        url: "/templates/display-class.html",   
        success : function(text)
        {

          $('#class-back-btn').click(function() {
            $('#'+classDisplayContainerID).remove();
            $('#'+containerID).removeClass('is-hidden');
          });
          $('.category-tabs li').click(function() {
            $('#'+classDisplayContainerID).remove();
            $('#'+containerID).removeClass('is-hidden');
          });

          $('#class-name').html(classStruct.class.name);
          $('#class-source').html(getContentSourceTextName(classStruct.class.contentSrc));
          $('#class-description').html(classStruct.class.description);
          $('#class-key-ability').html(classStruct.class.keyAbility);
          $('#class-key-ability-desc').html('At 1st level, your class gives you an ability boost to '+classStruct.class.keyAbility+'.');
          $('#class-hit-points').html(classStruct.class.hitPoints+' plus your Constitution modifier');

          $('#class-perception').html(profToWord(classStruct.class.tPerception));
          $('#class-saving-throw-fort').html(profToWord(classStruct.class.tPerception)+' in Fortitude');
          $('#class-saving-throws-reflex').html(profToWord(classStruct.class.tPerception)+' in Reflex');
          $('#class-saving-throws-will').html(profToWord(classStruct.class.tPerception)+' in Will');

          let tWeaponsArray = classStruct.class.tWeapons.split(',,, ');
          for(const tWeapons of tWeaponsArray){
            let sections = tWeapons.split(':::');
            let weapTraining = sections[0];
            let weaponName = sections[1];
            if(weaponName.slice(-1) === 's'){
              // is plural
              $('#class-attacks').append('<p>'+profToWord(weapTraining)+' in all '+weaponName+'</p>');
            } else {
              // is singular
              $('#class-attacks').append('<p>'+profToWord(weapTraining)+' in the '+weaponName+'</p>');
            }
          }

          $('#class-skills').html('Trained in '+classStruct.class.tSkills);
          $('#class-skills-extra').html('Trained in a number of additional skills equal to '+classStruct.class.tSkillsMore+' plus your Intelligence modifier');

          $('#class-class-dc').html(profToWord(classStruct.class.tClassDC));
          
          let tArmorArray = classStruct.class.tArmor.split(',,, ');
          for(const tArmor of tArmorArray){
            let sections = tArmor.split(':::');
            let armTraining = sections[0];
            let armName = sections[1];
            $('#class-defenses').append('<p>'+profToWord(armTraining)+' in all '+armName+'</p>');
          }

          ///

          $('#class-features-level-select').change(function(){
            $('#class-features').html('');
            let level = $(this).val();
            let firstEntry = true;
            for(const classFeature of classStruct.class_features){
              if(classFeature.level != level || classFeature.selectType == 'SELECT_OPTION'){ continue; }
              if(firstEntry) { firstEntry = false; } else { $('#class-features').append('<hr class="m-2">'); }

              $('#class-features').append('<div style="position: relative;"><div class=""><p class="is-size-4 has-text-weight-semibold has-text-centered has-text-grey-light">'+classFeature.name+'</p>'+processText(classFeature.description, false, null)+'</div><span style="position: absolute; top: 0px; right: 5px;" class="is-size-7 has-text-grey is-italic">'+getContentSourceTextName(classFeature.contentSrc)+'</span></div>');

              if(classFeature.selectType == 'SELECTOR'){
                $('#class-features').append('<p class="has-text-centered is-size-5 has-text-weight-semibold">Options</p)');
                for(const subClassFeature of classStruct.class_features){
                  if(subClassFeature.selectType == 'SELECT_OPTION' && (subClassFeature.selectOptionFor == classFeature.id || subClassFeature.indivClassAbilName === classFeature.name)) {

                    let subEntryID = 'class-feature-option-'+subClassFeature.id;
                    $('#class-features').append('<div id="'+subEntryID+'" style="max-width: 300px; margin: auto;" class="border border-dark-lighter has-background-black-ter cursor-clickable p-2"><p class="has-text-centered">'+subClassFeature.name+'</p></div)');

                    $('#'+subEntryID).click(function(){
                      openQuickView('abilityView', {
                        Ability : subClassFeature
                      });
                    });
                    
                    $('#'+subEntryID).mouseenter(function(){
                      $(this).removeClass('has-background-black-ter');
                      $(this).addClass('has-background-grey-darker');
                    });
                    $('#'+subEntryID).mouseleave(function(){
                      $(this).removeClass('has-background-grey-darker');
                      $(this).addClass('has-background-black-ter');
                    });

                  }
                }
              }

            }
          });
          $('#class-features-level-select').trigger('change');

          ///

          let classFeatLevel = 0;
          for(const [featID, featStruct] of featMap.entries()){
            let tag = featStruct.Tags.find(tag => {
              return tag.id === classStruct.class.tagID;
            });
            if(tag != null){
              if(featStruct.Feat.level <= 0) { continue; }
              if(featStruct.Feat.level > classFeatLevel){
                classFeatLevel = featStruct.Feat.level;
                $('#class-feats').append('<div class="border-bottom border-dark-lighter has-background-black-like-more text-center is-bold"><p>Level '+classFeatLevel+'</p></div>');
              }
              let featEntryID = 'class-feat-'+featStruct.Feat.id;
              $('#class-feats').append('<div id="'+featEntryID+'" class="border-bottom border-dark-lighter px-2 py-2 has-background-black-ter cursor-clickable"><span class="pl-4">'+featStruct.Feat.name+convertActionToHTML(featStruct.Feat.actions)+'</span><span class="is-pulled-right is-size-7 has-text-grey is-italic">'+getContentSourceTextName(featStruct.Feat.contentSrc)+'</span></div>');

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
          
          $('#'+classDisplayContainerID).removeClass('is-hidden');
        }
      });
    });
  }
}