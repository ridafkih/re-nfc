const service = `[Unit]
Description=ReNFC Serial Remapping
After=network.target

[Service]
WorkingDirectory=${process.cwd()}
ExecStart=node build/index.js
Restart=on-failure
Environment=PORT=80

[Install]
WantedBy=multi-user.target`

require('fs').writeFileSync('/etc/systemd/system/nfc.service', service, 'utf8');