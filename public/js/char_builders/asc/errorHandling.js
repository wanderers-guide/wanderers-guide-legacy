
const IS_DEBUG = true;

let errorMessages = [];

function displayError(message){
    errorMessages.push(message);
    reloadErrorMessages();
}

function reloadErrorMessages(){
    if(errorMessages.length > 0) {
        let errorHTML = '<p class="subtitle is-marginless has-text-weight-bold">Errors</p>';
        for(let errMsg of errorMessages){
            errorHTML += '<p class="has-text-grey-lighter">'+errMsg+'</p>';
        }
        $('#errorMessage').html(errorHTML);
        $('#errorDisplay').removeClass('is-hidden');
    } else {
        $('#errorMessage').html('');
        $('#errorDisplay').addClass('is-hidden');
    }
}