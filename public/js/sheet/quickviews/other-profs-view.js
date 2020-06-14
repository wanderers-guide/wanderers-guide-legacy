
function openOtherProfsQuickview(data) {

    $('#quickViewTitle').html(data.Name);
    $('#quickViewTitleRight').html('<button id="customizeProfBtn" class="button is-very-small is-success is-outlined is-rounded is-pulled-right mr-1">Customize</button>');
    $('#customizeProfBtn').click(function(){
        openQuickView('customizeProfView', {
            ProfData : data.ProfData,
            _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
        });
    });

    let qContent = $('#quickViewContent');

    let profName = getProfNameFromNumUps(data.ProfData.NumUps);
    if(data.ProfData.OriginalData.UserOverride != null && data.ProfData.OriginalData.UserOverride){
        qContent.append('<p><strong>Proficiency:</strong> '+profName+' <span class="is-inline pl-1 is-size-7 is-italic"> ( Override )</span></p>');
    } else {
        qContent.append('<p><strong>Proficiency:</strong> '+profName+'</p>');
    }

}