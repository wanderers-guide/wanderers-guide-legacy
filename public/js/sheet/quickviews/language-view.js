/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openLanguageQuickview(data) {
    addBackFunctionality(data);

    $('#quickViewTitle').html(data.Language.name);
    let qContent = $('#quickViewContent');

    qContent.append('<p class="negative-indent"><strong>Speakers:</strong> '+data.Language.speakers+'</p>');
    qContent.append('<p class="negative-indent"><strong>Script:</strong> '+data.Language.script+'</p>');
    qContent.append('<hr class="m-2">');
    qContent.append(processText(data.Language.description, true, true, 'MEDIUM'));

    let scriptClass = '';
    if(data.Language.script == 'Common'){
        scriptClass = 'font-common';
    } else if(data.Language.script == 'Iokharic'){
        scriptClass = 'font-iokharic';
    } else if(data.Language.script == 'Dethek'){
        scriptClass = 'font-dethek';
    } else if(data.Language.script == 'Rellanic'){
        scriptClass = 'font-rellanic';
    } else if(data.Language.script == 'Barazhad'){
        scriptClass = 'font-barazhad';
    } else if(data.Language.script == 'Enochian'){
        scriptClass = 'font-enochian';
    } else if(data.Language.script == 'Aklo'){
        scriptClass = 'font-aklo';
    } else if(data.Language.script == 'Gnomish'){
        scriptClass = 'font-gnomish';
    } else if(data.Language.script == 'Necril'){
        scriptClass = 'font-necril';
    } else if(data.Language.script == 'Druidic'){
        scriptClass = 'font-druidic';
    }

    if(scriptClass != ''){
        qContent.append('<hr class="m-2">');
        qContent.append('<input id="scriptDisplayArea" class="input is-medium" spellcheck="false" type="text" placeholder="Script Display Area">');
        $('#scriptDisplayArea').addClass(scriptClass);

    }

}