/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function doesntHaveItemHealth(invItem){
  return (invItem.hitPoints == 0);
}

function getBulkFromNumber(bulkNumber){
  switch(bulkNumber) {
    case 0: return '-';
    case 0.1: return 'L';
    case 0.01: return 'L / 10';
    default: return ''+bulkNumber;
  }
}

function getHandsToString(hands){
  switch(hands) {
    case "NONE":
        return "-";
    case "ONE":
        return "1";
    case "ONE_PLUS":
      return "1+";
    case "TWO":
      return "2";
    default:
        return hands;
  }
}


/* Coins */
function getCoinToString(price) {

  if(price == 0){return "-";}

  let priceObj = {Value: price};
  let cStr = ""; let sStr = ""; let gStr = ""; let pStr = "";

  if(price == 10){
    sStr = processSilver(priceObj);
  } else if(price == 100){
    gStr = processGold(priceObj);
  } else if(price == 1000){
    pStr = processPlatinum(priceObj);
  } else {
    if(price < 100) { // 99 or less
      cStr = processCopper(priceObj);
    } else if(100 <= price && price < 1000) { // 100 thru 999
      sStr = processSilver(priceObj);
      cStr = processCopper(priceObj);
    } else if(1000 <= price && price < 999999) { // 1000 thru 999,999
      gStr = processGold(priceObj);
      sStr = processSilver(priceObj);
      cStr = processCopper(priceObj);
    } else { // 1,000,000 or greater
      pStr = processPlatinum(priceObj);
      gStr = processGold(priceObj);
      sStr = processSilver(priceObj);
      cStr = processCopper(priceObj);
    }
  }

  let cStr_sStr_ouput = reduceCoinStr(cStr, sStr);
  cStr = cStr_sStr_ouput.current; sStr = cStr_sStr_ouput.upper;

  let sStr_gStr_ouput = reduceCoinStr(sStr, gStr);
  sStr = sStr_gStr_ouput.current; gStr = sStr_gStr_ouput.upper;

  /*let gStr_pStr_ouput = reduceCoinStr(gStr, pStr); // Don't convert down to platinum //
  gStr = gStr_pStr_ouput.current; pStr = gStr_pStr_ouput.upper;*/

  // Add on currency type
  if(pStr!='') {pStr += ' pp';}
  if(gStr!='') {gStr += ' gp';}
  if(sStr!='') {sStr += ' sp';}
  if(cStr!='') {cStr += ' cp';}

  let str = numberWithCommas(pStr);
  if(str != "" && gStr != ""){str += ", ";}
  str += numberWithCommas(gStr);
  if(str != "" && sStr != ""){str += ", ";}
  str += sStr;
  if(str != "" && cStr != ""){str += ", ";}
  str += cStr;

  return str;

}

function processCopper(priceObj) {
  if(priceObj.Value == 0){return '';}
  let copperCount = Math.floor(priceObj.Value / 1);
  priceObj.Value -= copperCount;
  return copperCount+'';
}

function processSilver(priceObj) {
  if(priceObj.Value == 0){return '';}
  let silverCount = Math.floor(priceObj.Value / 10);
  priceObj.Value -= silverCount*10;
  return silverCount+'';
}

function processGold(priceObj) {
  if(priceObj.Value == 0){return '';}
  let goldCount = Math.floor(priceObj.Value / 100);
  priceObj.Value -= goldCount*100;
  return goldCount+'';
}

function processPlatinum(priceObj) {
  if(priceObj.Value == 0){return '';}
  let platinumCount = Math.floor(priceObj.Value / 1000);
  priceObj.Value -= platinumCount*1000;
  return platinumCount+'';
}

function reduceCoinStr(currentCoinStr, upperCoinStr){
  let currentCoin = parseInt(currentCoinStr); if(isNaN(currentCoin)){ currentCoin = 0; }
  let upperCoin = parseInt(upperCoinStr); if(isNaN(upperCoin)){ upperCoin = 0; }
  if(currentCoin !== 0 && currentCoin % 10 === 0){
    upperCoinStr = (upperCoin+(currentCoin/10))+'';
    currentCoinStr = '';
  }
  return { current: currentCoinStr, upper: upperCoinStr };
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* Worn Armor Bulk Adjustment */
function getWornArmorBulkAdjustment(invItem, currentBulk){
  if(g_equippedArmorInvItemID != null && g_equippedArmorInvItemID == invItem.id){
    return currentBulk;
  } else {
    let item = g_itemMap.get(invItem.itemID+"");
    if(item != null && item.ArmorData != null){
      if(currentBulk == 0.1){
        return 1;
      } else if (currentBulk >= 1){
        return currentBulk + 1;
      }
    }
    return currentBulk;
  }
}

/* Size Conversions */
function getConvertedBulkForSize(size, bulk){
  switch(size) {
    case "TINY":
      if(bulk == 0) {
        bulk = 0;
      } else if(bulk <= 0.1){
        bulk = 0;
      } else {
        bulk = bulk/2;
        if(bulk < 1){
          bulk = 0.1;
        }
      }
      return bulk;
    case "SMALL":
      return bulk;
    case "MEDIUM":
      return bulk;
    case "LARGE":
      if(bulk == 0) {
        bulk = 0.1;
      } else if(bulk <= 0.1){
        bulk = 1;
      } else {
        bulk = bulk*2;
      }
      return bulk;
    case "HUGE":
      if(bulk == 0) {
        bulk = 1;
      } else if(bulk <= 0.1){
        bulk = 2;
      } else {
        bulk = bulk*4;
      }
      return bulk;
    case "GARGANTUAN":
      if(bulk == 0) {
        bulk = 2;
      } else if(bulk <= 0.1){
        bulk = 4;
      } else {
        bulk = bulk*8;
      }
      return bulk;
    default:
      return bulk;
  }
}

function getConvertedPriceForSize(size, price){
  switch(size) {
    case "TINY":
      return price;
    case "SMALL":
      return price;
    case "MEDIUM":
      return price;
    case "LARGE":
      return price*2;
    case "HUGE":
      return price*4;
    case "GARGANTUAN":
      return price*8;
    default:
      return price;
  }
}

////////

function getItemTraitsArray(item, invItem){
  let tagArray;
  try {
    tagArray = [];
    let tagIDArray = JSON.parse(invItem.itemTags);
    for(let tag of g_allTags){
      if(tagIDArray.includes(tag.id+"")){
        tagArray.push({ Tag: tag });
      }
    }
  } catch (err) {
    tagArray = item.TagArray;
    tagArray = tagArray.sort(
      function(a, b) {
        return a.Tag.name > b.Tag.name ? 1 : -1;
      }
    );
  }
  return tagArray;
}