/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

const CREATURE_MIN_LVL = -1;
const CREATURE_MAX_LVL = 30;

let g_addCreature_creatureMaxDisplay = 0;
const g_addCreature_displayIncrement = 20;

function openCustomCreatureQuickview() {

    $('#quickViewLeftTitle').html('Add Custom');

    $('#quickViewLeftTitleClose').html('<a id="quickViewLeftClose" class="delete"></a>');
    $('#quickViewLeftClose').click(function () {
        $('#quickviewLeftDefault').removeClass('is-active');
    });

    $('#quickviewLeftDefault').addClass('is-active');

    let qContent = $(`#quickViewLeftContent`);
    qContent.html(`
    
        <div class="is-flex" style="justify-content: space-evenly;">

            <div class="field">
                <p class="control">
                    <input id="creature-custom-name-input" class="input" type="text" autocomplete="off" placeholder="Name">
                </p>
            </div>

            <div class="field">
                <p class="control has-icons-left">
                    <input id="creature-custom-level-input" class="input" type="number" autocomplete="off" placeholder="Level" value="1" min="${CREATURE_MIN_LVL}" max="${CREATURE_MAX_LVL}">
                    <span class="icon is-small is-left">
                        <span class="font-bebas-neue">Lvl</span>
                    </span>
                </p>
            </div>

            <div class="field">
                <p class="control has-icons-left">
                    <input id="creature-custom-hp-input" class="input" type="number" autocomplete="off" placeholder="Max HP" value="100" min="1" max="9999">
                    <span class="icon is-small is-left">
                        <span class="font-bebas-neue">HP</span>
                    </span>
                </p>
            </div>
        </div>

        <div class="field is-grouped is-grouped-centered">
            <p class="control">
                <span id="creature-custom-add-btn" class="button is-info is-small is-rounded">
                    Add
                </span>
            </p>
        </div>
    
    `);

    $(`#creature-custom-add-btn`).click(function () {

        let name = $(`#creature-custom-name-input`).val();
        let level = parseInt($(`#creature-custom-level-input`).val());
        let maxHP = parseInt($(`#creature-custom-hp-input`).val());
        if (isNaN(level)) { level = 1; }
        if (isNaN(maxHP)) { maxHP = 100; }

        addCustomMember(allEncounters[currentEncounterIndex], name, level, maxHP);
        reloadEncounterMembers();
        reloadBalanceResults();

        $('#quickviewLeftDefault').removeClass('is-active');
    });

}

function openCreatureSelectQuickview() {

    $('#quickViewLeftTitle').html('Add Creatures');

    $('#quickViewLeftTitleClose').html('<a id="quickViewLeftClose" class="delete"></a>');
    $('#quickViewLeftClose').click(function () {
        $('#quickviewLeftDefault').removeClass('is-active');
    });

    $('#quickviewLeftDefault').addClass('is-active');

    // Set display amount to first increment
    g_addCreature_creatureMaxDisplay = g_addCreature_displayIncrement;

    let qContent = $(`#quickViewLeftContent`);

    qContent.html(`

        <div class="tabs is-centered is-marginless mb-1">
            <ul class="category-tabs">
                <li class="is-active"><a id="creature-add-tab-search">Search</a></li>
                <li><a id="creature-add-tab-advanced">Advanced - Coming Soon</a></li>
            </ul>
        </div>

        <div>
            <div class="field has-addons has-addons-centered mb-1">
                <div class="control has-icons-left is-expanded">
                    <input id="creature-add-search-name-input" class="input is-fullwidth" type="text" autocomplete="off" placeholder="Name">
                    <span class="icon is-left">
                        <i class="fas fa-search" aria-hidden="true"></i>
                    </span>
                </div>
                <p class="control">
                    <span class="select">
                        <select id="creature-add-min-lvl-input">
                            <option value="Min">Min</option>
                            <option value="-1">-1</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                        </select>
                    </span>
                </p>
                <p class="control">
                    <a class="button is-static border-darker"> to </a>
                </p>
                <p class="control">
                    <span class="select">
                        <select id="creature-add-max-lvl-input">
                            <option value="Max">Max</option>
                            <option value="-1">-1</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                        </select>
                    </span>
                </p>
            </div>
            <div class="field">
                <p class="control has-icons-left">
                    <input id="creature-add-search-statblock-input" class="input" type="text" autocomplete="off" placeholder="Search in Statblock">
                    <span class="icon is-left">
                        <i class="fas fa-search" aria-hidden="true"></i>
                    </span>
                </p>
            </div>
        </div>
        <hr class="mt-1 mb-0">

        <div id="creature-add-results-display">
        </div>

    `);

    $(`#creature-add-min-lvl-input`).change(function () {
        let minValue = $(`#creature-add-min-lvl-input option:selected`).val();
        let maxValue = $(`#creature-add-max-lvl-input option:selected`).val();
        if(minValue == 'Min'){ minValue = CREATURE_MIN_LVL; }
        if(maxValue == 'Max'){ maxValue = CREATURE_MAX_LVL; }
        minValue = parseInt(minValue);
        maxValue = parseInt(maxValue);

        if(minValue > maxValue){
            $(`#creature-add-max-lvl-input`).val(minValue);
        }

        generateCreatureResults();
    });
    $(`#creature-add-max-lvl-input`).change(function () {
        let minValue = $(`#creature-add-min-lvl-input option:selected`).val();
        let maxValue = $(`#creature-add-max-lvl-input option:selected`).val();
        if(minValue == 'Min'){ minValue = CREATURE_MIN_LVL; }
        if(maxValue == 'Max'){ maxValue = CREATURE_MAX_LVL; }
        minValue = parseInt(minValue);
        maxValue = parseInt(maxValue);

        if(minValue > maxValue){
            $(`#creature-add-min-lvl-input`).val(maxValue);
        }

        generateCreatureResults();
    });

    $('#creature-add-search-name-input').on('input', function () {
        generateCreatureResults();
    });

    $('#creature-add-search-statblock-input').on('input', function () {
        generateCreatureResults();
    });

}

function generateCreatureResults(resetMaxDisplay=true){
    $(`#creature-add-results-display`).html(``);

    if(resetMaxDisplay){
        // Set display amount to first increment
        g_addCreature_creatureMaxDisplay = g_addCreature_displayIncrement;
    }

    let statWords = [];
    if($(`#creature-add-search-statblock-input`).val().trim() != ``){
        statWords = $(`#creature-add-search-statblock-input`).val().replace(/\W/g, ' ').split(' ');
        if (statWords.length == 1 && statWords[0].length < 3) { 
            statWords = [];
        }
    }

    let nameWords = [];
    if($(`#creature-add-search-name-input`).val().trim() != ``){
        nameWords = $(`#creature-add-search-name-input`).val().split(' ');
    }

    let minLvl = $(`#creature-add-min-lvl-input option:selected`).val();
    let maxLvl = $(`#creature-add-max-lvl-input option:selected`).val();
    if(minLvl == 'Min'){ minLvl = CREATURE_MIN_LVL; }
    if(maxLvl == 'Max'){ maxLvl = CREATURE_MAX_LVL; }
    minLvl = parseInt(minLvl);
    maxLvl = parseInt(maxLvl);

    let containsWords = function (stringD, words) {
        for (let word of words) {
            if (!stringD.includes(word.toLowerCase())) {
                return false;
            }
        }
        return true;
    };

    if(statWords.length > 0 || nameWords.length > 0 || minLvl != CREATURE_MIN_LVL || maxLvl != CREATURE_MAX_LVL){
        let creatureCount = 0;
        let didntLoadAll = false;
        for (const [creatureID, data] of g_creaturesMap.entries()) {

            let extractedData = g_extractedCreaturesMap.get(creatureID);
    
            let toDisplay = true;
            if(!containsWords(extractedData, statWords)){
                toDisplay = false;
            }
            if(!containsWords(data.name.toLowerCase(), nameWords)){
                toDisplay = false;
            }
            if(data.level > maxLvl) { toDisplay = false; }
            if(data.level < minLvl) { toDisplay = false; }
    
            if (toDisplay) {
                creatureCount++;
    
                let creatureAddViewBtn = `creature-add-view-btn-${creatureID}`;
                let creatureAddEliteWeak = `creature-add-eliteweak-input-${creatureID}`;
                let creatureAddBtn = `creature-add-btn-${creatureID}`;
    
                $(`#creature-add-results-display`).append(`
                        <div class="my-2 is-flex" style="justify-content: space-between;">
                            <div>
                                <p class=""><span class="is-size-7 has-txt-noted">${data.level >= 0 && data.level <= 9 ? `&nbsp;` : ``}${data.level} - </span>${data.name}</p>
                            </div>
    
                            <div class="is-flex">
                                <button id="${creatureAddViewBtn}" class="button is-info is-very-small is-outlined is-rounded mr-3" style="margin-top: 0.15rem;">
                                    <span class="">
                                        View
                                    </span>
                                </button>
    
                                <div class="field has-addons">
                                    <div class="control">
                                        <div class="select is-small">
                                            <select id="${creatureAddEliteWeak}">
                                                <option value="elite">Elite</option>
                                                <option value="normal" selected>Normal</option>
                                                <option value="weak">Weak</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="control">
                                        <button id="${creatureAddBtn}" class="button is-info is-small is-rounded">Add</button>
                                    </div>
                                </div>
                            </div>
    
                        </div>
                        <hr class="my-0">
                    `);
    
                $(`#${creatureAddViewBtn}`).click(function () {
                    let eliteWeak = $(`#${creatureAddEliteWeak}`).val();
                    openQuickView('creatureView', {
                        data: data,
                        conditions: [],
                        eliteWeak: eliteWeak,
                    }, true);
                });
    
                $(`#${creatureAddBtn}`).click(function () {
    
                    let eliteWeak = $(`#${creatureAddEliteWeak}`).val();
                    addMember(allEncounters[currentEncounterIndex], creatureID, eliteWeak);
                    reloadEncounterMembers();
                    reloadBalanceResults();
    
                    //$('#quickviewLeftDefault').removeClass('is-active');
                });

                if(creatureCount >= g_addCreature_creatureMaxDisplay){ didntLoadAll = true; break; }
            }
    
        }

        if(didntLoadAll){
            $(`#creature-add-results-display`).append(`
                <button id="creature-add-results-load-more" class="button is-small is-info is-outlined is-fullwidth">Load More</button>
            `);
            $('#creature-add-results-load-more').click(function(){
                g_addCreature_creatureMaxDisplay += g_addCreature_displayIncrement;
                generateCreatureResults(false);
            });
        }

        if ($(`#creature-add-results-display`).html() == ``) {
            $(`#creature-add-results-display`).html(`
                <p class="has-text-centered is-italic is-unselectable has-txt-noted py-1">No creatures found.</p>
            `);
        }

    } else {

        $(`#creature-add-results-display`).html(``);

    }


}
