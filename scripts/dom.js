"use strict";

$(document).ready(function () {
  function display() {
    var cidr = new CIDR($("#cidr").val());

    if (!$.isEmptyObject(cidr)) {
      $("#message").text("");
      $("#classN").text(cidr.classN);
      $("#mask").text(cidr.netmask.join("."));
      $("#netid").text(cidr.netID);
      $("#broadcast").text(cidr.broadcast);
      $("#hosts").text(Math.abs(cidr.numHosts).toLocaleString());
    }
    else {
      $("#message").text("Enter a valid CIDR.");
      $("#classN").text("-");
      $("#mask").text("-");
      $("#broadcast").text("-");
      $("#netid").text("-");
      $("#hosts").text("-");
    }
  }

  function clearDetails(error) {
    var msg = error ? "Invalid CIDR" : "-";

    $("#classN").text(msg);
    $("#mask").text(msg);
    $("#hosts").text(msg);
    $("#broadcast").text(msg);
    $("#netid").text(msg);
  }

  $("#runButton").click(display);
  $("#cidr").on("input", display);
});