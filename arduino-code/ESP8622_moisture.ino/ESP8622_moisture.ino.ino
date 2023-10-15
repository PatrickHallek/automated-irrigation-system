#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const String sensorName = "Sensor1";
const String ssid = "***";
const String password = "***";
const char* host = "***";
const int port = 3000;

const int numReadings = 10;
const int sendingIntervall = 1000;

int inputPin1 = A0;
int total = 0;              // the running total
int reading = 0;

void setup() {
  Serial.begin(115200);        // Serial connection
  WiFi.begin(ssid, password);  // WiFi connection

}

void loop() {
    if (currentReading > 25 && currentReading < 1000) {
        calculateAverage(currentReading);
    } else {
        delay(10);
    }
    reading = getAverage()
    postData(reading);
    // WAKE_RF_DISABLED to keep the WiFi radio disabled when we wake up
    ESP.deepSleep( sendingIntervall, WAKE_RF_DISABLED );
}

int getAverage() {
    int average = 0;  // the average
    for (int readIndex = 0; readIndex < numReadings; readIndex++) {
      total = total +  analogRead(inputPin1);
      delay(10);
    }
    average = total / numReadings;
  Serial.println(average);
  return average
}

void postData(int data) {
  WiFi.forceSleepWake();
  delay( 1 );
  // Bring up the WiFi connection
  WiFi.mode( WIFI_STA );
  WiFi.begin( WLAN_SSID, WLAN_PASSWD );
  while (WiFi.status() != WL_CONNECTED) {  // Wait for the WiFI connection completion
    delay(500);
    Serial.println("Waiting for connection");
  }
  HTTPClient http;  // Declare object of class HTTPClient
  http.begin("http://" + (String)host + ":" + (String)port + "/measurement/" + (String)sensorName);  // Specify request destination
  http.addHeader("Content-Type", "application/json");  // Specify content-type header
  int httpCode = http.POST("{\"capacity\": \"" + (String)data + "\"}");// Send the request
  String payload = http.getString();    //Get the response payload from server
  Serial.print("Response Code:"); //200 is OK
  Serial.println(httpCode);   //Print HTTP return code
  Serial.print("Returned data from Server:");
  Serial.println(payload);    //Print request response payload
  if(httpCode == 200)
  {
    StaticJsonDocument<64> filter;
    JsonObject filter_irrigated_0 = filter["irrigated"].createNestedObject();
    filter_irrigated_0["signalPin"] = true;
    filter_irrigated_0["irrigationtime"] = true;
    StaticJsonDocument<768> doc;

    DeserializationError error = deserializeJson(doc, payload, DeserializationOption::Filter(filter));

    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    }

    for (JsonObject irrigated_item : doc["irrigated"].as<JsonArray>()) {
      int irrigated_item_signalPin = irrigated_item["signalPin"]; 
      int irrigated_item_irrigationtime = irrigated_item["irrigationtime"]; 

    }
  
    // Decode JSON/Extract values
    Serial.println(F("Response:"));
    Serial.println(F("Pin0:"));
    Serial.println(irrigated_item["signalPin"][0].as<char*>());
    Serial.println(irrigated_item["irrigationtime"][0].as<char*>());
    Serial.println(F("Pin1:"));
    Serial.println(irrigated_item["signalPin"][1].as<char*>());
    Serial.println(irrigated_item["irrigationtime"][1].as<char*>());
    Serial.println(F("Pin2:"));
    Serial.println(irrigated_item["signalPin"][2].as<char*>());
    Serial.println(irrigated_item["irrigationtime"][2].as<char*>());
  }
  else
  {
    Serial.println("Error in response");
  }
  http.end();                                        // Close connection
  WiFi.disconnect( true );
  delay( 1 );
}
