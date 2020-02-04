"use strict";

function findClass(firstOctet) {
  if (firstOctet >= 1 && firstOctet <= 127) {
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


function deriveMask(cidr) {
  var mask = [];

  for(var i = 0;i < 4; i++) {
    var n = Math.min(cidr, 8);
    mask.push(256 - Math.pow(2, 8 - n));
    cidr -= n;
  }

  return mask;
}


function countHosts(cidr) {
  return 2**(32-cidr) - 2;
}


function ipToInt(ipArray) {
    var x = 0;
    var y = 0;

    while (x < 4) {
        y <<= 8;
        y += +ipArray[x++];
    }

    return y >>> 0;
}


function intToIP(ipInt) {
  return [ipInt >>> 24, ipInt >> 16 & 255, ipInt >> 8 & 255, ipInt & 255].join(".");
}


function findFirstIP(mask, ip) {
  return intToIP(ip & mask);
}


function findLastIP(mask, ip) {
  return intToIP(ip | ~mask);
}


function CIDR(cidr) {
  // regex looks for valid IPv4 addresses with a /1 through /32 range notation
  // example: 10.10.1.152/18
  if (/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/([1-9]|[12][0-9]|3[0-2])$/.test(cidr)) {
    var cidrObj = {
      parts: cidr.split("/")
    };

    // set IP and array of integers. Sorry for the ugly one-liner.
    cidrObj.ip = cidrObj.parts[0].split(".").map(function(octet) { return parseInt(octet); });

    // Set IP range as integer
    cidrObj.cidr = parseInt(cidrObj.parts[1]);

    // Determine and set the IP's class
    cidrObj.classN = findClass(cidrObj.ip[0]);

    // Determine the subnet mask by the given range.
    cidrObj.netmask = deriveMask(cidrObj.cidr);

    // Network ID is the first IP in the range.
    cidrObj.netID = findFirstIP(ipToInt(cidrObj.netmask), ipToInt(cidrObj.ip));

    // Broadcast address is the last IP in the range.
    cidrObj.broadcast = findLastIP(ipToInt(cidrObj.netmask), ipToInt(cidrObj.ip));

    // countHosts returns total number of IPs in the range, so we need to remove 2 to account for
    // the Network ID and Broadcast addresses.
    cidrObj.numHosts = countHosts(cidrObj.cidr);

    return cidrObj;
  }
  else {
    return {};
  }
}