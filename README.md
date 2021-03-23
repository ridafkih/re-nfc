# ReNFC 
> Rotate near-field communication devices serial numbers in order to re-use them for single-use applications. 
___

This is meant to be used on a Raspberry Pi 3 or 4 with an NFC reader which inputs NFC device serial numbers in hexadecimal format preceded by a `;` and succeeded by a `?`.

ReNFC uses a simple local SQLite3 database to store serial number rotations, and a WebSocket server to communicate wirelessly over a LAN. The Raspberry Pi calculates the new serial number, and sends it to the PC which types the serial number in the correct format.

Not only does ReNFC grant the user the ability to "rewrite" non-rewritable serial numbers up to 16 times, but it also grants wireless capabilities between the NFC reader and the primary PC it is meant to connect to. 

___

### Installation
1. Clone the repository.
	* `git clone https://github.com/ridarf/re-nfc.git`
2. Navigate into directory.
	* `cd re-nfc`
3. Install dependencies, automatically build & install server.
	 **Warning:** Following the next command, you will be asked for administrative permissions in order to proceed with the service installation.
	* `npm install`

After running this set of commands, the program will have automatically installed. It will automatically run on boot. If you wish to see the logs output by the service, simply use the command `journalctl -u nfc.service` and use the PgUp and PgDown keys to navigate.

### Uninstallation
1. Navigate into directory. 
	* `cd re-nfc`
2. Run uninstallation script.
	* `npm run-script uninstall` 

After running this command, the service will be stopped, and then deleted.
___
Port :80 on the Raspberry Pi must not be in use for the installation to work. The service uses port :80 to host the express server hosting the WebSocket server, thus if it is already in use the program by another service, it will abort and a connection will not be made.
