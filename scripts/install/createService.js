const fs = require('fs');

const service = `[Unit]
Description=ReNFC Serial Remapping
After=network.target

[Service]
WorkingDirectory=${__dirname}
ExecStart=node ../../build/index.js
Restart=on-failure
Environment=PORT=80

[Install]
WantedBy=multi-user.target`

fs.writeFileSync('/etc/systemd/system/nfc.service', service, 'utf8');