#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const String sensorName = "***";
const String ssid = "***";
const String password = "***";
const char* host = "***";
const int port = 3000;

const int numReadings = 30;
const int sendingIntervall = 1000;

int inputPin1 = A0;

int readings[numReadings];  // the readings from the analog input
int readIndex = 0;          // the index of the current reading
int total = 0;              // the running total
int average = 0;            // the average

void setup() {
  Serial.begin(115200);        // Serial connection
  WiFi.begin(ssid, password);  // WiFi connection

  while (WiFi.status() != WL_CONNECTED) {  // Wait for the WiFI connection completion
    delay(500);
    Serial.println("Waiting for connection");
  }

  for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    readings[thisReading] = 0;
  }
}

void loop() {
    int currentReading = analogRead(inputPin1);
    if (currentReading > 25 && currentReading < 1000) {
        calculateAverage(currentReading);
    } else {
        delay(10);
    }
}

void calculateAverage(int currentReading) {
    total = total - readings[readIndex];
    readings[readIndex] = currentReading;
    total = total + readings[readIndex];
    readIndex++;
    average = total / numReadings;
    if (readIndex >= numReadings) {
        Serial.println(average);
        postData(average);
        readIndex = 0;
        delay(sendingIntervall);
    }
    delay(sendingIntervall / numReadings);
}

void postData(int data) {
  if (WiFi.status() == WL_CONNECTED) {  // Check WiFi connection status

    HTTPClient http;  // Declare object of class HTTPClient

    http.begin("http://" + (String)host + ":" + (String)port + "/measurement/" + (String)sensorName);  // Specify request destination
    http.addHeader("Content-Type", "application/json");  // Specify content-type header
    http.POST("{\"capacity\": \"" + (String)data + "\"}");// Send the request
    http.end();                                        // Close connection
  } else {
    Serial.println("Error in WiFi connection");
  }
}
