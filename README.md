# Automated irrigation system

This is an open source application to water plants automatically. Up to now there is almost no free professional software and instructions available to build a DYI irrigation that is scalable, accurate and most importantly, durable. The app is also not only there to look good and for the love of data. Above all, it is a tool to tailor the sensors to the exact needs of the plants. This is where most irrigation systems with direct soil moisture measurement fail because every soil and plant is different and therefore manual calibration and possibly after some time also recalibration is essential.

The app contains the following features:
- Monitor and display time series data at the minute, hour, day, week and month levels
- Setting the water level from which automatic watering should be triggered.
- Setting how long the pump works during an irrigation
- Manual activation of irrigation with a button
- Switching between different sensor profiles
- Switching between dark and light theme

| App dark themed  | App light themed |
| ------------- | ------------- |
| ![App dark themed](https://github.com/PatrickHallek/automated-irrigation-system/blob/master/docs/images/app-dark.png) | ![App light themed](https://github.com/PatrickHallek/automated-irrigation-system/blob/master/docs/images/app-light.png)|

# Table of contents

1. [ Part list ](#part-list)
2. [ Hardware Architecture ](#hardware-architecture)
3. [ Software Architecture ](#software-architecture)
4. [ Setup NodeMCU ESP8266 ](#nodemcu)
5. [ Setup the Raspberry Pi with Docker (recommended) ](#raspi-docker)
6. [ Setup the Raspberry Pi manually ](#raspi-manually)
7. [ Usage ](#usage)
8. [ Contributing ](#contributing)
9. [ License ](#license)

<a name="part-list"></a>
## Part list

| Name  | Anmount | Description |
| ------------- | ------------- | ------------- |
| [NodeMCU ESP8266](https://amzn.to/3dh7IPR)  | 1 - n  | Wifi module for reading capacities and sending them to the backend (Raspi)|
| [Raspberry Pi Zero](https://amzn.to/2NeY05X)  | 1  | Running the whole software and triggering the pump(s) |
| [Raspberry Pi SD Card](https://amzn.to/3hLghpt)  | 1  | This is the data memory for the raspberry pi  |
| [Relay](https://amzn.to/2YgcvNt)  | 1 - n  | To close or open the pump circuit on signal  from the raspi|
| [Capacitive Soil Moisture Sensors](https://amzn.to/3dh9PTU)  | 1-n  | To measure the soil moisture. Capacitive sensors do not dissolve. Never use electrodical humidity sensors, as they wear out very quickly |
| [Pump](https://amzn.to/3hIhRZf)  | 1 - n  | Theoretically any pump can be used, as it is controlled by a separate power supply and the relay |
| [Aquarium tube and irrigation nozzles](https://amzn.to/3153W9I)  | -  | Water transfer to the plants and to distribute the water on the earth |

The "n" in the anmount is due to the number of pumps or different plants. For example, in a raised bed it is usually sufficient to have one pump and one sensor. However, if you have different potted plants, they all need to be watered separately and therefor you have to get one pump and sensor for each potted plant.

<a name="hardware-architecture"></a>
## Hardware architecture
![Hardware Architecture](https://github.com/PatrickHallek/automated-irrigation-system/blob/master/docs/images/hardware-architecture.png)

The architecture was chosen so that pump logic and recording of measurement data is separate. This makes it possible to control up to 26 pumps with the Raspberry Pi (amount of default available GPIO pins). It is also not possible to read the analog signals of the capacitive sensor with the Raspberry itself, because the Raspberry can only process digital signals. Surely it is possible to read the sensors with an MCP3008 and the serial interface, but this requires more pins and the setup is not as clean as it used to be. The pumps are also separately connected to a power supply, whose circuit is controlled by the relay. So it is also possible to use 12V or higher pumps.

<a name="software-architecture"></a>
## Software architecture
![Software Architecture](https://github.com/PatrickHallek/automated-irrigation-system/blob/master/docs/images/software-architecture.png)

For the software architecture the [MERN Stack](https://www.educative.io/edpresso/what-is-mern-stack) was used. The software consists of a [Node.js](https://nodejs.org/de/about/) backend with [Express.js](https://expressjs.com/de/), a [Mongo database](https://www.mongodb.com/) and a [React](https://reactjs.org/) frontend. A C++ script runs on the NodeMCU ESP8266, which sends data to the [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) interface of the backend. The data is processed in the backend, where it is decided whether to irrigate or not. In addition, the data is then stored in the MongoDB. With the frontend, this data can also be requested from the backend via REST.

<a name="nodemcu"></a>
## Setup the NodeMCU ESP8266

To flash the NodeMCU microcontroller you have to follow the steps described in [this video](https://www.youtube.com/watch?v=flLMMHCNkQE).

Before you upload the program you have to set your wifi password, wifi name (ssid), the ip of the raspberry pi (host) and the sensor name. The sensor name will be the name that is displayed in the app. So it's best to choose the name of the plant the sensor should be associated with.

If the Arduino IDE is successfully configured for the NodeMCU, you can upload the program you find in this repository under [arduino-code/ESP8266_moisture/ESP8266_moisture.ino](https://github.com/PatrickHallek/automated-irrigation-system/blob/master/arduino-code/ESP8622_moisture.ino/ESP8622_moisture.ino.ino) to the NodeMCU.


<a name="raspi-docker"></a>
## Setup the Raspberry Pi with [Docker](https://www.docker.com/) (recommended)

To avoid having to install the required programs manually, you can also run the application with Docker in containers. To do this, carry out the following steps:

```bash
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker pi
sudo apt-get install -y libffi-dev libssl-dev
sudo apt-get install -y python3 python3-pip
sudo apt-get remove python-configparser
sudo pip3 install docker-compose
```

Now you have to pass the ip address of your pi into the `REACT_APP_BACKEND_URL=http://<YOUR-RASPI-IP>:3000` environment variable in the docker-compose file:

```bash
sudo nano docker-compose
```

You can find the ip with the command `ifconfig`. It should be something like *192.168.178.44*. You can save your input in the Nano editor with `ctr + x`, then type in `yes`, finally exit with `enter`.

Now everything should be ready and you can start the application with the following command:

```bash
sudo docker-compose up
```

**Attention**: If you have a Raspberry Pi with a processor other than *ARMv7*, you need to adjust the image for the mongodb in the docker-compose file. Since this is only suitable for *ARMv6*.

<a name="raspi-manually"></a>
## Setup the Raspberry Pi manually

To set everything up we first have to burn an image to the SD card and connect to the Raspberry pi via an ssh connection. Follow [this video](https://www.youtube.com/watch?v=upY4Fusi4zI&t=714s) to perform these steps.

After everything has worked out, connect to the raspberry pi and take the next steps

<a name="node"></a>
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

<a name="mongodb"></a>
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

<a name="project-installation"></a>
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
If you are in nano edit mode, copy the following text into it and type in your raspi ip. You can find the ip with the command `ifconfig`. It should be something like *192.168.178.44*
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

<a name="usage"></a>
## Usage
The frontend can be accessed at the following URL if you are in your home wifi network:
http://<RASPI_IP>:5000

In order to get the Raspberry Pi IP-address, execute `ifconfig` on the Raspi.
If everything worked out fine, you should see the measurements in the `Last Minute` view in the statistics and the default preferences (which do not equal to 0).

<a name="contributing"></a>
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

<a name="licence"></a>
## License
[MIT](https://choosealicense.com/licenses/mit/)
