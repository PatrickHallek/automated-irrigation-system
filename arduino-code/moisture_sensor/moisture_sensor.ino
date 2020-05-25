const int numReadings = 30;

int readings[numReadings];  // the readings from the analog input
int readIndex = 0;          // the index of the current reading
int total = 0;              // the running total
int average = 0;            // the average
int loopIndex = 0;          // to read values of different sensors

int sendingIntervall = 1000;

int inputPin1 = A1;
int inputPin2 = A2;
int inputPin3 = A3;

void setup() {
    Serial.begin(9600);
    for (int thisReading = 0; thisReading < numReadings; thisReading++) {
        readings[thisReading] = 0;
    }
}

void loop() {
    int inputPin = 0;
    if (loopIndex % 3 == 0) {
        inputPin = inputPin1;
        loopIndex++;
    } else if (loopIndex % 3 == 1) {
        inputPin = inputPin2;
        loopIndex++;
    } else {
        inputPin = inputPin3;
        loopIndex = 0;
    }

    int currentReading = analogRead(inputPin);
    if (currentReading > 25 && currentReading < 700)
        calculateAverage(currentReading);
    else {
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
        readIndex = 0;
        delay(sendingIntervall);
    }
    delay(sendingIntervall / numReadings);
}
