# Automated irrigation system

This is an open source application to water plants automatically. Up to now there is almost no free professional software and instructions available to build a DYI irrigation that is scalable, accurate and most importantly, durable. The app is also not only there to look good and for the love of data. Above all, it is a tool to tailor the sensors to the exact needs of the plants. This is where most irrigation systems with direct soil moisture measurement fail because every soil and plant is different and therefore manual calibration and possibly after some time also recalibration is essential.

The app contains the following features:
- Monitor and display time series data at the minute, hour, day, week and month levels
- Setting the water level from which automatic watering should be triggered.
- Setting how long the pump works during an irrigation
- Manual activation of irrigation with a button
- Switching between different sensor profiles

To rebuild the irrigation system you must follow these steps:

## Part list

| Name  | Anmount | Description |
| ------------- | ------------- | ------------- |
| [NodeMCU ESP8266](https://amzn.to/2BOPmJ5)  | 1 - n  | Wifi module for reading capacities and sending them to the backend (Raspi)|
| [Raspberry Pi Zero](https://amzn.to/3h53OwG)  | 1  | Running the whole software and triggering the pump(s) |
| [Raspberry Pi SD Card](https://amzn.to/3h8qbBg)  | 1  | This is the data memory for the raspberry pi  |
| [Relay](https://amzn.to/2XJnWwz)  | 1 - n  | To close or open the pump circuit on signal  from the raspi|
| [Capacitive Soil Moisture Sensors](https://amzn.to/3haEUf2)  | 1-n  | To measure the soil moisture. Capacitive sensors do not dissolve. Never use electrodical humidity sensors, as they wear out very quickly |
| [Pump](https://amzn.to/2UrRtsC)  | 1 - n  | Theoretically any pump can be used, as it is controlled by a separate power supply and the relay |
| [Aquarium tube and irrigation nozzles](https://amzn.to/3cRWPUI)  | -  | Water transfer to the plants and to distribute the water on the earth |

The "n" in the anmount is due to the number of pumps or different plants. For example, in a raised bed it is usually sufficient to have one pump and one sensor. However, if you have different potted plants, they all need to be watered separately and therefor you have to get one pump and sensor for each potted plant.

## Hardware architecture
![Set Username](https://raw.githubusercontent.com/PatrickHallek/automated-irrigation-system/master/docs/images/hardware-architecture.png)

## Software architecture

## Setup the Raspberry Pi 

To set everything up we first have to burn an image to the SD card and connect to the Raspberry pi via an ssh connection. Follow [this video](https://www.youtube.com/watch?v=upY4Fusi4zI&t=714s) to perform these steps.

After everything has worked out, connect to the raspberry pi and take the next steps

### **Installing [Node](https://nodejs.org/en/about/)**

Node.js is an open source server environment with which we developed the backend and thus the logic for automated irrigation. The backend is the heart of the application and connects the sensor data, user interface, database and hardware (relay to the pump).

Execute the following commands on the raspi in oder to install Node:

```bash
wget https://nodejs.org/dist/v11.9.0/node-v11.9.0-linux-armv6l.tar.gz
tar -xvf node-v11.9.0-linux-armv6l.tar.gz
cd node-v11.9.0-linux-armv6l
sudo cp -R * /usr/local/
```

That the installation has worked can be checked with the two commands for version query of Node.js and NPM:

```bash
node -v
npm -v
```

### **Installing [MongoDB](https://www.mongodb.com/de)**
MongoDB is a universal, document-based, distributed noSQL database where we will store our settings and time series data.

Execute the following commands on the raspi in oder to install MongoDB:

```bash
sudo apt update
sudo apt upgrade

sudo apt install mongodb

sudo systemctl enable mongodb
sudo systemctl start mongodb
```

That the installation has worked can be checked with the command below:

```bash
mongo
```

### **Installing the Project**

Download the project from this repository with the following command and go in the project directory: 

```bash
git clone https://github.com/PatrickHallek/automated-irrigation-system
cd automated-irrigation-system
```

After downloading the project you have to create environment files for the frontend and backend with the following commands:

```bash
sudo nano .env
```
If you are in nano edit mode, copy the following text into it and type in you raspi ip. You can find the ip with the command `ifconfig`. It should be something like *192.168.178.44*
```nano
SKIP_PREFLIGHT_CHECK=true
PORT=4200
REACT_APP_BACKEND_URL="http://<YOUR-RASPI-IP>:3000"
```
You can save your input in the Nano editor with `ctr + x`, then type in `yes`, finally exit with `enter`.

We need to do the same for the backend environment:
```bash
sudo nano backend/.env
```
Copy the following line into the editor in order to set the database connection:
```
MONGO_DB="mongodb://localhost/irrigation"
```

## Setup the NodeMCU ESP8266

To flash the NodeMCU microcontroller you have to follow the steps described in [this video](https://www.youtube.com/watch?v=flLMMHCNkQE).

Before you upload the program you have to set your wifi password, wifi name (ssid), the ip of the raspberry pi (host) and the sensor name. The sensor name will be the name that is displayed in the app. So it's best to choose the name of the plant the sensor should be associated with.

If the Arduino IDE is successfully configured for the NodeMCU, you can upload the program you find in this repository under [arduino-code/ESP8266_moisture/ESP8266_moisture.ino](https://github.com/PatrickHallek/automated-irrigation-system/blob/master/arduino-code/ESP8622_moisture.ino/ESP8622_moisture.ino.ino) to the NodeMCU.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
