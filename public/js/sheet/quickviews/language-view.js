
function openLanguageQuickview(data) {

    $('#quickViewTitle').html(data.Language.name);
    let qContent = $('#quickViewContent');

    qContent.append('<p><strong>Speakers:</strong> '+data.Language.speakers+'</p>');
    qContent.append('<p><strong>Script:</strong> '+data.Language.script+'</p>');
    qContent.append('<hr class="m-2">');
    qContent.append('<p>'+data.Language.description+'</p>');

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