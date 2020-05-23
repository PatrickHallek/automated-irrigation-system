const int numReadings = 20;

int readings[numReadings];      // the readings from the analog input
int readIndex = 0;              // the index of the current reading
int total = 0;                  // the running total
int average = 0;                // the average

int sendingIntervall = 1000;

int inputPin = A1;

void setup() {
  Serial.begin(9600);
  for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    readings[thisReading] = 0;
  }
}

void loop() {
  int currentReading = analogRead(inputPin);
  if (currentReading > 25 && currentReading < 700) {
    total = total - readings[readIndex];
    readings[readIndex] = currentReading;
    total = total + readings[readIndex];
    readIndex = readIndex + 1;
    average = total / numReadings;
    if (readIndex >= numReadings) {
      Serial.println(average);
      readIndex = 0;
      delay(sendingIntervall);
    }
    delay(sendingIntervall / numReadings);
  } else {
    delay(10);
  }
}
