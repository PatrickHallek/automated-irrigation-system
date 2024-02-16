#include <Arduino.h>
#if defined(ESP8266)
  /* ESP8266 Dependencies */
  #include <ESP8266WiFi.h>
  #include <ESPAsyncTCP.h>
  #include <ESPAsyncWebServer.h>
  #include <ESP8266HTTPClient.h>
  #include <ESP8266mDNS.h>
#elif defined(ESP32)
  /* ESP32 Dependencies */
  #include <WiFi.h>
  #include <AsyncTCP.h>
  #include <ESPAsyncWebServer.h>
  #include <HTTPClient.h>
  #include <ESPmDNS.h>
  #include "esp_system.h"
  
#endif
#include <Preferences.h>
#include <ESPConnect.h>
#include <ArduinoJson.h>
#include <algorithm>
#include <iostream>

#if !defined(HOST_IP)
  #include <ESPDash.h>            //https://github.com/ayushsharma82/ESP-DASH
#endif

#include <BH1750.h>             //https://github.com/claws/BH1750

#include <OneWire.h>
#include "DHT.h"
#include "configuration.h"

WiFiClient wifiClient;
Preferences prefs;

int irrigated_item_signalPin[MAX_IO_COUNT];
int irrigated_item_irrigationtime[MAX_IO_COUNT];
int sendingIntervall = 300e3; // 300e3 = 5 minutes . This gets overriden by the preferences downloaded from the server.
bool deepsleep = false; //Set false if device is plugged in, true for battery. This gets overriden by the preferences downloaded from the server.
String serverip = HOST_IP;

typedef enum {
    DHTxx_SENSOR_ID,
    BHT1750_SENSOR_ID,
    SOIL_SENSOR_ID,
    SALT_SENSOR_ID,
    VOLTAGE_SENSOR_ID,
} sensor_id_t;

typedef struct {
    uint32_t timestamp;     /**< time is in milliseconds */
    float temperature;      /**< temperature is in degrees centigrade (Celsius) */
    float light;            /**< light in SI lux units */
    float pressure;         /**< pressure in hectopascal (hPa) */
    float humidity;         /**<  humidity in percent */
    float altitude;         /**<  altitude in m */
    float voltage;           /**< voltage in volts (V) */
    uint8_t soli;           //Percentage of soil
    uint8_t salt;           //Percentage of salt
} higrow_sensors_event_t;


AsyncWebServer      server(80); 

BH1750              lightMeter(OB_BH1750_ADDRESS);  //0x23
DHT                 dht(DHT1x_PIN, DHTTYPE);
OneWire             ds;

bool                    has_lightSensor = false;
bool                    has_dhtSensor   = false;
bool                    has_dht11       = false;
bool                    setupserver     = true;
uint64_t                timestamp       = 0;

#if !defined(HOST_IP)
ESPDash             dashboard(&server);
Card *dhtTemperature    = NULL;
Card *dhtHumidity       = NULL;
Card *saltValue         = new Card(&dashboard, GENERIC_CARD, DASH_SALT_VALUE_STRING, "%");
Card *batteryValue      = new Card(&dashboard, GENERIC_CARD, DASH_BATTERY_STRING, "mV");
Card *soilValue         = new Card(&dashboard, GENERIC_CARD, DASH_SOIL_VALUE_STRING, "%");

Card *illumination      = NULL;
Card *dsTemperature     = NULL;
Card *motorButton       = NULL;
#endif

void    deviceProbe(TwoWire &t);
float   getDsTemperature(void);

String getMacAddress() {
  return WiFi.macAddress();
}


void setupWiFi()
{
  ESPConnect.autoConnect("ESPConfig");
  /* 
    Begin connecting to previous WiFi
    or start autoConnect AP if unable to connect
  */
  if(ESPConnect.begin(&server)){
    Serial.println("Connected to WiFi");
    Serial.println("IPAddress: "+WiFi.localIP().toString());
  }else{
    Serial.println("Failed to connect to WiFi");
  }
}

bool get_higrow_sensors_event(sensor_id_t id, higrow_sensors_event_t &val)
{
    switch (id) {
    case DHTxx_SENSOR_ID: {
        val.temperature = dht.readTemperature();
        val.humidity = dht.readHumidity();
        if (isnan(val.temperature)) {
            val.temperature = 0.0;
        }
        if (isnan(val.humidity)) {
            val.humidity = 0.0;
        }
    }
    break;

    case BHT1750_SENSOR_ID: {
        val.light = lightMeter.readLightLevel();
        if (isnan(val.light)) {
            val.light = 0.0;
        }
    }
    break;

    case SOIL_SENSOR_ID: {
        uint16_t soil = analogRead(SOIL_PIN);
        val.soli = map(soil, 0, 4095, 100, 0);
    }
    break;

    case SALT_SENSOR_ID: {
        uint8_t samples = 120;
        uint32_t humi = 0;
        uint16_t array[120];
        for (int i = 0; i < samples; i++) {
            array[i] = analogRead(SALT_PIN);
            delay(2);
        }
        std::sort(array, array + samples);
        for (int i = 1; i < samples - 1; i++) {
            humi += array[i];
        }
        humi /= samples - 2;
        val.salt = humi;
    }
    break;

    case VOLTAGE_SENSOR_ID: {
        int vref = 1100;
        uint16_t volt = analogRead(BAT_ADC);
        val.voltage = ((float)volt / 4095.0) * 6.6 * (vref);
    }
    break;
    default:
        break;
    }
    return true;
}

#if defined(HOST_IP)
void setuphostserver(){
  if(setupserver){
    setupserver = false;
    deepsleep = false;
    if(!MDNS.begin("irrigationsensor")) {
      Serial.println("Error starting mDNS");
    }
    else{
      Serial.println("Starting mDNS service as irrigationsensor");
      MDNS.addService("irrigationsensor", "tcp", 80);
      }
    server.on("/setserver/", HTTP_POST, [](AsyncWebServerRequest *request){
          serverip = request->client()->remoteIP().toString();
          request->send(200, "text/plain", "Hello, " + serverip);
          Serial.println("Received server configuration from: " + serverip);
      });

    server.begin();
  }
}

String postData(int data) {  
  HTTPClient http;  // Declare object of class HTTPClient
  String host = "http://" + (String)serverip + ":" + (String)HOST_PORT + "/measurement/" + getMacAddress();
  Serial.println(host);
  http.begin(wifiClient, host);  // Specify request destination
  http.addHeader("Content-Type", "application/json");  // Specify content-type header
  String sendpayload = "{\"capacity\": \"" + (String)data + "\"}";
  Serial.println("Payload: " + sendpayload); 
  int httpCode = http.POST(sendpayload);// Send the request
  delay(2000);
  String payload = http.getString();    //Get the response payload from server
  Serial.print("HTTP Response Code: "); //200 is OK
  Serial.println(httpCode);   //Print HTTP return code
  Serial.print("Returned data from Server:");
  Serial.println(payload);    //Print request response payload
  if(httpCode != 200)
  {
    Serial.println("Error in response");
    setuphostserver();
    payload = "";
  }
  else{
    prefs.putString("serverip", serverip);
     server.end();
     MDNS.close();
     setupserver = true;
  }
  http.end();                                        // Close connection
  return payload;
}

void decodeJSON (String payload) {
    StaticJsonDocument<64> filter;
    filter["pendingirrigation"] = true;
    filter["_doc"] = true;
    
    StaticJsonDocument<768> doc;
    DeserializationError error = deserializeJson(doc, payload, DeserializationOption::Filter(filter));
    //DeserializationError error = deserializeJson(doc, payload);
     if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    }
    int index = 0;
    for (JsonObject irrigated_item : doc["pendingirrigation"].as<JsonArray>()) {
      irrigated_item_signalPin[index] = irrigated_item["signalPin"]; 
      irrigated_item_irrigationtime[index] = irrigated_item["irrigationtime"]; 
      index++;
    }
    int deepsleepnbr = doc["_doc"]["Batterypower"]; 
    sendingIntervall = doc["_doc"]["ReadingIntervalInMinutes"]; 
    sendingIntervall = sendingIntervall * 60000;//converting to minutes
    if (deepsleepnbr == 1){deepsleep = true;}
    else{deepsleep = false;}
    Serial.print("Deepsleep: ");
    Serial.println(deepsleepnbr);
    Serial.print("sendingInterval: ");
    Serial.println(sendingIntervall);
    return;
  }

void irrigate () {
  for (int i = 0; i < MAX_IO_COUNT; i++){
    if(irrigated_item_irrigationtime[i] != 0){
      Serial.println("Irrigating port: " + (String) irrigated_item_signalPin[i] + " for " + (String)irrigated_item_irrigationtime[i] + " seconds" );
      pinMode(irrigated_item_signalPin[i], OUTPUT); 
      digitalWrite(irrigated_item_signalPin[i], LOW);   // sets the digital pin on
      delay(irrigated_item_irrigationtime[i] * 1000);   // waits for irrigation
      digitalWrite(irrigated_item_signalPin[i], HIGH);  // sets the digital pin off
      irrigated_item_signalPin[i] = 0;
      irrigated_item_irrigationtime[i] = 0;
    }
    else{
      Serial.println("Skipping port: " + (String) irrigated_item_signalPin[i]);
      }
    }
  return;
}
#endif

bool dhtSensorProbe()
{
    dht.begin();
    delay(2000);// Wait a few seconds between measurements.
    int i = 5;
    while (i--) {
        // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
        float h = dht.readHumidity();
        // Check if any reads failed and exit early (to try again).
        if (isnan(h)) {
            Serial.println("Failed to read from DHT sensor!");
        } else {
            return true;
        }
        delay(500);
    }
    return false;
}


void setup()
{
    Serial.begin(115200);
    Serial.println("Starting Setup...");
    prefs.begin("irrigation-app");
    //serverip = prefs.getString("serverip", HOST_IP); 
    /* *
    * Warning:
    *   Higrow sensor power control pin, use external port and onboard sensor, IO4 must be set high
    */

    pinMode(POWER_CTRL, OUTPUT);
    digitalWrite(POWER_CTRL, HIGH);
    delay(100);

    Wire.begin(I2C_SDA, I2C_SCL);


    Serial.println("-------------Devices probe-------------");
    deviceProbe(Wire);


    //Check DHT11 temperature and humidity sensor
    if (!dhtSensorProbe()) {
        has_dht11 = false;
        Serial.println("Warning: Failed to find DHT11 temperature and humidity sensor!");
    } else {
        has_dht11 = true;
        Serial.println("DHT11 temperature and humidity sensor init succeeded, using DHT11");
        #if !defined(HOST_IP)
          dhtHumidity     = new Card(&dashboard, HUMIDITY_CARD, DASH_DHT_HUMIDITY_STRING, "%");
          dhtTemperature  = new Card(&dashboard, TEMPERATURE_CARD, DASH_DHT_TEMPERATURE_STRING, "°C");
        #endif
    }
   

    //Check DHT11 or DHT20 temperature and humidity sensor
    if (has_lightSensor) {
        if (!lightMeter.begin()) {
            has_lightSensor = false;
            Serial.println("Warning: Failed to find BH1750 light sensor!");
        } else {
            Serial.println("BH1750 light sensor init succeeded, using BH1750");
            #if !defined(HOST_IP)
              illumination = new Card(&dashboard, GENERIC_CARD, DASH_BH1750_LUX_STRING, "lx");
            #endif
        }
    }

        // IO19 is initialized as motor drive pin
        pinMode(MOTOR_PIN, OUTPUT);
        digitalWrite(MOTOR_PIN, LOW);
        #if !defined(HOST_IP)
          motorButton = new Card(&dashboard, BUTTON_CARD, DASH_MOTOR_CTRL_STRING);
          motorButton->attachCallback([&](bool value) {
            Serial.println("motorButton Triggered: " + String((value) ? "true" : "false"));
            digitalWrite(MOTOR_PIN, value);
            motorButton->update(value);
            dashboard.sendUpdates();
        });
        #endif
    setupWiFi();
}


void loop()
{
    Serial.println("Starting Loop...");
    if(!setupserver){MDNS.update();}
    if (millis() - timestamp > 1000) {
        timestamp = millis();

        higrow_sensors_event_t val = {0};
        get_higrow_sensors_event(SOIL_SENSOR_ID, val);
        get_higrow_sensors_event(SALT_SENSOR_ID, val);
        get_higrow_sensors_event(VOLTAGE_SENSOR_ID, val);
        if (has_dht11) {
            get_higrow_sensors_event(DHTxx_SENSOR_ID, val);
        }
        if (has_lightSensor) {
            get_higrow_sensors_event(BHT1750_SENSOR_ID, val);
        }
        
        #if !defined(HOST_IP)
        soilValue->update(val.soli);`
        saltValue->update(val.salt);
        batteryValue->update(val.voltage);
        if (has_dht11) {
            dhtTemperature->update(val.temperature);
            dhtHumidity->update(val.humidity);
        }
        if (has_lightSensor) {
            illumination->update(val.light);
        }
        dashboard.sendUpdates();
        #endif
        
    #if defined(HOST_IP)
    String response = postData(val.soli);
    if (deepsleep) {
      WiFi.disconnect( true );
      delay( 1 );
      }
    Serial.println("Decoding the server response...");  
    decodeJSON(response);
    Serial.println("Starting irrigation...");
    irrigate();
     if (deepsleep) {
      Serial.println("Going for a deep sleep...");
      #if defined(ESP8266)
          ESP.deepSleep(1000 * sendingIntervall);
      #endif
      #if defined(ESP32)
          esp_sleep_enable_timer_wakeup(1000 * sendingIntervall);
          delay(1000);
          esp_deep_sleep_start();
      #endif
    }
    else
      {
        Serial.println("Waiting to get a new measurement...");
        delay(sendingIntervall / 10);
      }
    }
    #endif
}



void deviceProbe(TwoWire &t)
{

    uint8_t err, addr;
    int nDevices = 0;
    for (addr = 1; addr < 127; addr++) {
        t.beginTransmission(addr);
        err = t.endTransmission();
        if (err == 0) {

            switch (addr) {
            case OB_BH1750_ADDRESS:
                has_lightSensor = true;
                Serial.println("BH1750 light sensor found!");
                break;
            default:
                Serial.print("I2C device found at address 0x");
                if (addr < 16)
                    Serial.print("0");
                Serial.print(addr, HEX);
                Serial.println(" !");
                break;
            }
            nDevices++;
        } else if (err == 4) {
            Serial.print("Unknow error at address 0x");
            if (addr < 16)
                Serial.print("0");
            Serial.println(addr, HEX);
        }
    }
}
