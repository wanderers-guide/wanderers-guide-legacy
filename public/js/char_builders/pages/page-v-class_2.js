/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_class_2 = null;

// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

function loadClassTwoPage(classObject) {

    let classMap = objToMap(classObject);
    classMap = new Map([...classMap.entries()].sort(
        function(a, b) {
            return a[1].Class.name > b[1].Class.name ? 1 : -1;
        })
    );

    console.log('Running Class Two');

    // Populate Class Selector
    let selectClass = $('#selectClass');
    selectClass.append('<option value="chooseDefault" name="chooseDefault">Choose a Class</option>');
    selectClass.append('<optgroup label="──────────"></optgroup>');
    for(const [key, value] of classMap.entries()){
        if(value.Class.id == g_char_classID){
            if(value.Class.isArchived == 0){
                selectClass.append('<option value="'+value.Class.id+'" selected>'+value.Class.name+'</option>');
            } else {
                selectClass.append('<option value="'+value.Class.id+'" selected>'+value.Class.name+' (archived)</option>');
            }
        } else if(value.Class.isArchived == 0){
            selectClass.append('<option value="'+value.Class.id+'">'+value.Class.name+'</option>');
        }
    }


    // Class Selection //
    $('#selectClass').change(function(event, triggerSave) {
        let classID = $("#selectClass option:selected").val();
        if(classID != "chooseDefault"){
            $('.class-content').removeClass("is-hidden");
            $('#selectClassControlShell').removeClass("is-info");

            if(triggerSave == null || triggerSave) {
                $('#selectClassControlShell').addClass("is-loading");

                g_char_classID = classID;
                g_class_2 = classMap.get(classID);
                socket.emit("requestClassChange",
                    getCharIDFromURL(),
                    classID);
                
            } else {
                displayCurrentClass(classMap.get(classID), false);
            }

        } else {
            $('.class-content').addClass("is-hidden");
            $('#selectClassControlShell').addClass("is-info");

            // Delete class, set to null
            g_char_classID = null;
            g_class_2 = null;
            socket.emit("requestClassChange",
                getCharIDFromURL(),
                null);
        }

    });
 
    $('#selectClass').trigger("change", [false]);
    finishLoadingPage();

}
