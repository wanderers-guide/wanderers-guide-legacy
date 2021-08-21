/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

$(function () {

  startDiceLoader();
  socket.emit("requestPlannerCore");

});

socket.on("returnPlannerCore", function(plannerCoreStruct) {
  stopDiceLoader();

  console.log(plannerCoreStruct);



});