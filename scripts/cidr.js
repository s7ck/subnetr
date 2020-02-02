"use strict";

function ipToBinary(ip) {
  var output = [];
  var segment = "";

  ip = ip.split(".").map(function(x) { return parseInt(x) ;});

  if (ip.length === 4) {
    for (var i = 0; i < 4; i++) {
      segment = ip[i].toString(2);

      while (segment.length < 8) {
        segment = "0" + segment;
      }

      output.push(segment);
    }
  }

  return output;
}

function findClass(firstOctet) {
  if (firstOctet >= 1 && firstOctet <= 126) {
    return "A";
  }
  else if (firstOctet >= 128 && firstOctet <= 191) {
    return "B";
  }
  else if (firstOctet >= 192 && firstOctet <= 223) {
    return "C";
  }
  else if (firstOctet >= 224 && firstOctet <= 249) {
    return "D";
  }
  else if (firstOctet >= 240 && firstOctet <= 255) {
    return "E";
  }
  else {
    return "Bad IP";
  }
}

function findNetMask(range) {
  if (range <= 8) {
    return [255, 0, 0, 0];
  }
  else if (range <= 16) {
    return [255, 255, 0, 0];
  }
  else if (range <= 24) {
    return [255, 255, 255, 0];
  }
  else if (range <= 32) {
    return [255, 255, 255, 0];
  }
  else {
    return null;
  }
}

// Mask
function countHosts(range) {
  return -1 << (32 - range);
}

function intToString(mask) {
  return [mask >>> 24, mask >> 16 & 255, mask >> 8 & 255, mask & 255].join('.');
}

function findFirstIP(mask, ip) {
  var result = [];

  for (var i = 0; i < mask.length; i++) {
    if (mask[i] === 255) {
      result.push(ip[i]);
    }
    else {
      result.push(0);
    }
  }

  return result;
}

function CIDR(cidr) {
  // regex looks for valid IPv4 addresses with a /1 through /32 range notation
  // example: 10.10.1.152/18
  if (/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/([1-9]|[12][0-9]|3[0-2])$/.test(cidr)) {
    var cidrObj = {
      parts: cidr.split("/")
    };

    // set IP and array of integers. Sorry for the one-liner.
    cidrObj.ip = cidrObj.parts[0].split(".").map(function(octet) { return parseInt(octet); });

    // Set IP range as integer
    cidrObj.range = parseInt(cidrObj.parts[1]);

    // Determine and set the IP's class
    cidrObj.classN = findClass(cidrObj.ip[0]);

    // Determine the subnet mask by the given range.
    cidrObj.netmask = intToString(countHosts(cidrObj.range));

    cidrObj.netID = findFirstIP(cidrObj.netmask, cidrObj.ip); // First IP

    // --> TODO: Add first usable IP
    // --> TODO: Add last usable IP

    cidrObj.broadcast = "{broadcast}"; // Last IP

    // countHosts returns total number of IPs in the range, so we need to remove 2 to account for
    // the Network ID and Broadcast addresses.
    cidrObj.numHosts = countHosts(cidrObj.range) - 2;

    return cidrObj;
  }
  else {
    return {};
  }
}