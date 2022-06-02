
let socket = io();

$(function () {

    $(`#campaign-create-btn`).click(() => {
        socket.emit(`requestAddCampaign`);
    });

    socket.on('returnAddCampaign', (campaign) => {
        window.location.reload(true);
    });

});
