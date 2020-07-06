
let g_defaultItemPropRuneSlotNum = null;
function processDefaultItemRuneSheetCode(ascCode, invItemID){
    if(ascCode == null) {return false;}
    
    ascCode = ascCode.toUpperCase();
    let ascStatements = ascCode.split(/\n/);

    const runeData = g_runeDataStruct;

    g_defaultItemPropRuneSlotNum = 0;
    let success = true;
    for(const ascStatementRaw of ascStatements) {
        // Test/Check Statement for Expressions //
        let ascStatement = testExpr(ascStatementRaw);
        if(ascStatement === null) {continue;}
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

        if(ascStatement.includes("DEFAULT-WEAPON-RUNE")){
            // DEFAULT-WEAPON-RUNE=+1_Weapon_Potency

            let data = ascStatement.split('=');
            defaultSetWeaponRunes(invItemID, data[1], runeData);

            continue;
        }

        if(ascStatement.includes("DEFAULT-ARMOR-RUNE")){
            // DEFAULT-ARMOR-RUNE=+3_Armor_Potency

            let data = ascStatement.split('=');
            defaultSetArmorRunes(invItemID, data[1], runeData);

            continue;
        }

    }

    return success;

}


function defaultSetWeaponRunes(invItemID, runeCodeName, runeData){
    runeCodeName = runeCodeName.replace(/_/g," ");
    runeCodeName = runeCodeName.replace(/’/g,"'");

    let rune = findWeaponRuneByName(runeCodeName, runeData);
    if(rune != null){
        if(rune.RuneData.isFundamental == 1) {
            socket.emit("requestAddFundamentalRune",
                invItemID,
                rune.RuneData.id);
        } else {
            g_defaultItemPropRuneSlotNum++;
            socket.emit("requestAddPropertyRune",
                invItemID,
                rune.RuneData.id,
                g_defaultItemPropRuneSlotNum);
        }
    } else {
        console.error('Failed to find weapon rune with name: '+runeCodeName);
    }

}

function findWeaponRuneByName(runeCodeName, runeData){
    for(let weapRune of runeData.WeaponArray){
        if(weapRune != null) {
            let weapRuneName = runestoneNameToRuneName(weapRune.Item.name).toUpperCase();
            if(weapRuneName === runeCodeName){
                return weapRune;
            }
        }
    }
    return null;
}



function defaultSetArmorRunes(invItemID, runeCodeName, runeData){
    runeCodeName = runeCodeName.replace(/_/g," ");
    runeCodeName = runeCodeName.replace(/’/g,"'");

    let rune = findArmorRuneByName(runeCodeName, runeData);
    if(rune != null){
        if(rune.RuneData.isFundamental == 1) {
            socket.emit("requestAddFundamentalRune",
                invItemID,
                rune.RuneData.id);
        } else {
            g_defaultItemPropRuneSlotNum++;
            socket.emit("requestAddPropertyRune",
                invItemID,
                rune.RuneData.id,
                g_defaultItemPropRuneSlotNum);
        }
    } else {
        console.error('Failed to find armor rune with name: '+runeCodeName);
    }

}

function findArmorRuneByName(runeCodeName, runeData){
    for(let weapRune of runeData.ArmorArray){
        if(weapRune != null) {
            let weapRuneName = runestoneNameToRuneName(weapRune.Item.name).toUpperCase();
            console.log(weapRuneName+' '+runeCodeName);
            if(weapRuneName === runeCodeName){
                return weapRune;
            }
        }
    }
    return null;
}
