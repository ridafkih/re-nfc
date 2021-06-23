import * as fs from "fs";

const service = `[Unit]
Description=ReNFC Serial Remapping
After=network.target

[Service]
WorkingDirectory=${process.cwd()}
ExecStart=npm run-script run
Restart=on-failure
Environment=PORT=80

[Install]
WantedBy=multi-user.target`

fs.writeFileSync('/etc/systemd/system/nfc.service', service, 'utf8');