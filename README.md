
# ReNFC 
> Rotate near-field communication devices serial numbers in order to re-use them for single-use applications. 
___

<img src="https://i.imgur.com/cq1ZuDr.gif" alt="video demonstration" width="600" />

This is meant to be used on a Raspberry Pi 3 or 4 with an NFC reader which inputs NFC device serial numbers in hexadecimal format preceded by a `;` and succeeded by a `?`.

ReNFC uses a simple local database to store serial number rotations, and a WebSocket server to communicate wirelessly over a LAN. The Raspberry Pi calculates the new serial number, and sends it to the PC which types the serial number in the correct format.

Not only does ReNFC grant the user the ability to "rewrite" non-rewritable serial numbers up to 16 times, but it also grants wireless capabilities between the NFC reader and the primary PC it is meant to connect to. 

___
### ⚠️ Important
It's important to know that traditional NFC serial numbers **cannot** be changed. I did not achieve the impossible, and with these facts in mind note that there are no actual changes being made to the physical NFC device, whether it be a wristband, coin, or card. 

The "changes" are made in a database, serial numbers are split into their separate hexadecimal characters, shifted up by the amount of "rewrites" that were done, and then refactored into the new serial number. 

Ex: `3abc790` would become `4bcd8a1` after one rewrite.

The serial number on the device is never actually changed, so any raw scans will not reflect. They must be run through the program.

It's also important to know that if you delete or lose the original database on the Raspberry Pi, all wristband resets will be lost. You will have to re-reset them if the worst-case occurs.

### Prerequisites & Installation

The Raspberry Pi running the operation must have NodeJS 14.x installed. The following commands will get you set up with doing so.
1. SSH into the Raspberry Pi
	* `ssh username@raspberrypi`
2. Update repository list.
	* `sudo apt-get update`
	* `sudo apt-get upgrade`
3. Enable NodeSource repository for 16.x
	* `curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -`
4. Install NodeJS 16.x from package manager.
	* `sudo apt install nodejs`
5. Ensure NPM is up to date.
	* `npm i -g npm`
6. Install libudev for the `usb-detection` library.
	* `sudo apt-get install libudev-dev`
	
You can run `npm -v` and `node -v` to double check that both are installed, if not begin troubleshooting your node installation. 

7. Clone the repository into a repository the account has access to.
	* `git clone https://github.com/ridarf/re-nfc.git`
8. Navigate into directory.
	* `cd re-nfc`
9. Install dependencies, automatically build & install server.
	 **Warning:** Following the next command, you will be asked for administrative permissions in order to proceed with the service installation.
	* `sudo npm install`

Next, just be patient. After running `npm install` you could find yourself waiting for up to ten minutes, and you will be prompted to enter the root password unless you're in sudo su.

After running this set of commands, the program will have automatically installed. It will automatically run on boot. If you wish to see the logs output by the service, simply use the command `journalctl -u nfc` and use the PgUp and PgDown keys to navigate, or use `npm run logs` for a trailing log.

### Server Management & Usage

1. If you would like to restart the service.
	* `npm run restart`
2. If you would like to stop the service.
	* `npm run stop`
3. If you would like to start the service. However, this service will automatically start after installation, as well as automatically on boot if you've already run `npm install` at least once.
	* `npm run start`

### Windows Installation
Once you have the server up and running, it's time to install and launch the complimentary software.

1. Download the installation MSI.
	* Download [from releases section](https://github.com/ridarf/re-nfc/releases/download/v0.2-alpha/ReNFC.msi)
2. Run the installer.
3. Launch software from start menu. 
4. Profit.

Once the server is online, and the software is launched, test it out! Enjoy being able to "rewrite" NFC device serial numbers!

### Server Uninstallation
1. Navigate into directory. 
	* `cd re-nfc`
2. Run uninstallation script.
	* `npm run-script uninstall` 

After running this command, the service will be stopped, and then deleted.
___
Port :80 on the Raspberry Pi must not be in use for the installation to work. The service uses port :80 to host the express server hosting the WebSocket server, thus if it is already in use the program by another service, it will abort and a connection will not be made.
