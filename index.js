const express = require('express');
const app = express();
const os = require('os');

const usedMacAddresses = [];

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    for (const addressInfo of addresses) {
      if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
        return addressInfo.address;
      }
    }
  }
  return 'IP-Adresse nicht gefunden';
}

app.get('/check-license/:mac', (req, res) => {
  const macAddress = req.params.mac;

  if (usedMacAddresses.includes(macAddress)) {
    return res.send('Lizenz ist valid! (:');
  }

  res.send('Lizenz ist nicht verfügbar!');
});

app.get('/add-license/:mac', (req, res) => {
  const macAddress = req.params.mac;

  if (!usedMacAddresses.includes(macAddress)) {
    usedMacAddresses.push(macAddress);
    return res.send('Lizenz erfolgreich hinzugefügt!');
  }

  res.send('Lizenz ist bereits in Verwendung!');
});

app.listen(3000, () => {
  const localIP = getLocalIP();
  console.log(`Server ist gestartet auf http://${localIP}:3000`);

  let previousListLength = 0;

  setInterval(() => {
    if (usedMacAddresses.length !== previousListLength) {
      console.log(usedMacAddresses);
      previousListLength = usedMacAddresses.length;
    }
  }, 5000);
});
