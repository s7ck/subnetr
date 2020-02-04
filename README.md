# subnetr
Subneter provides a basic deconstruction of CIDR Notation on IPv4 address for your subnetting needs.

## usage
Enter valid CIDR notation such as 192.168.1.1/18 and, if the table doesn't automatically update, click Run.

The table will be populated with the following information:
1. Class
2. Subnet Mask
3. Network ID
4. Broadcast IP
5. Hosts

## special note on hosts count
The number of hosts displayed is the total number of addresses in your range **minus 2** reserved addresses: Network ID (first address), and Broadcast (last address).

Happy subnetting.
