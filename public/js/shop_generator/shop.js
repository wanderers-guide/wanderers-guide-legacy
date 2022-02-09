/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/


let socket = io();

$(function () {

  startSpinnerLoader();
  socket.emit("requestShopGeneratorDetails");

});

let g_itemMap = null;
let g_allTags = null;
let g_isSupporter = null;

socket.on("returnShopGeneratorDetails", function(itemObj, traits, isSupporter){

  g_itemMap = objToMap(itemObj);
  g_allTags = traits;
  g_isSupporter = isSupporter;

  openPageChoose();

  stopSpinnerLoader();
});



let g_shop_preset = null;
let g_shop = null;

function setShop(presetID){

  g_shop_preset = cloneObj(g_shopPresets.get(parseInt(presetID)));
  g_shop = cloneObj(g_shopPresets.get(parseInt(presetID)));

  g_shop.profiles = objToMap(g_shop.profiles);

  for(let [profileID, profileData] of g_shop.profiles.entries()){
    profileData.traits = objToMap(profileData.traits);
    profileData.categories = objToMap(profileData.categories);
    profileData.weapon_groups = objToMap(profileData.weapon_groups);
    profileData.rarities = objToMap(profileData.rarities);
  }

}

function deleteShop(){

  g_shop_preset = null;
  g_shop = null;

}


function getVanillaizedShop(){

  let newShop = cloneObj(g_shop);
  newShop.profiles = cloneObj(mapToObj(g_shop.profiles));

  for (const profileID in newShop.profiles) {
    let profileData = newShop.profiles[profileID];

    const normalProfileData = g_shop.profiles.get(profileID);
    profileData.traits = mapToObj(normalProfileData.traits);
    profileData.categories = mapToObj(normalProfileData.categories);
    profileData.weapon_groups = mapToObj(normalProfileData.weapon_groups);
    profileData.rarities = mapToObj(normalProfileData.rarities);

  }

  return cloneObj(newShop);

}

function isShopEdited(){
  return JSON.stringify(getVanillaizedShop()) != JSON.stringify(g_shop_preset);
}


function shopInitImport(){

  const fileInput = document.querySelector('#input-import-shop');
  fileInput.onchange = () => {
    if (fileInput.files.length > 0) {

      let file = fileInput.files[0];
      let fileReader = new FileReader();

      // Closure to capture the file information.
      fileReader.onload = (function(capturedFile) {
        return function(e) {
          if(capturedFile.name.endsWith('.guideshop')) {
            try {
              let exportData = JSON.parse(e.target.result);
              
              // Same as setShop() //
              g_shop_preset = cloneObj(exportData);
              g_shop = cloneObj(exportData);
            
              g_shop.profiles = objToMap(g_shop.profiles);
            
              for(let [profileID, profileData] of g_shop.profiles.entries()){
                profileData.traits = objToMap(profileData.traits);
                profileData.categories = objToMap(profileData.categories);
                profileData.weapon_groups = objToMap(profileData.weapon_groups);
                profileData.rarities = objToMap(profileData.rarities);
              }

              openPageGenerate();

            } catch (err) {
              console.error(err);
              console.warn('Failed to import "'+capturedFile.name+'"');
            }
          }
        };
      })(file);
      
      fileReader.readAsText(file);
    }
  };

}

function shopExport(){

  let exportDataJSON = JSON.stringify(getVanillaizedShop());
  let fileName = g_shop.name.replaceAll(/[\\\/:"*?<>|.]+/g, '').replaceAll(' ', '_')+'.guideshop';

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(exportDataJSON));
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);

}