#pragma once

/*
    The default is hotspot mode, the note will be connected to the configured WiFi
*/
// #define SOFTAP_MODE
// #define WIFI_STA
// #define AUTO_WATER
#define HOST_IP               "10.0.0.4"
#define HOST_PORT             3000
#define MAX_IO_COUNT          12
// Wireless access point ssid password
//#define WIFI_SSID               "rafs hideout"
//#define WIFI_PASSWD             "Rogers123"


/*
* if you need to change it,
* please open this note and change to the frequency you need to test
* Option: 433E6,470E6,868E6,915E6
* */

#define LoRa_frequency      868E6


// Uncomment the type of sensor in use:
#define DHTTYPE           DHT11     // DHT 11
// #define DHTTYPE           DHT22     // DHT 22 (AM2302)
//#define DHTTYPE           DHT21     // DHT 21 (AM2301)



#define I2C_SDA                 (25)
#define I2C_SCL                 (26)
#define I2C1_SDA                (21)
#define I2C1_SCL                (22)
#define DS18B20_PIN             (21)

#define DHT1x_PIN               (16)
#define BAT_ADC                 (33)
#define SALT_PIN                (34)
#define SOIL_PIN                (32)
#define BOOT_PIN                (0)
#define POWER_CTRL              (4)
#define USER_BUTTON             (35)
#define DS18B20_PIN             (21)                  //18b20 data pin

#define MOTOR_PIN               (19)
#define RGB_PIN                 (18)

#define RADIO_RESET_PIN         (23)
#define RADIO_DI0_PIN           (14)
#define RADIO_DI1_PIN           (13)
#define RADIO_DI2_PIN           (15)
#define RADIO_CS_PIN            (18)
#define RADIO_MISO_PIN          (19)
#define RADIO_MOSI_PIN          (27)
#define RADIO_SCLK_PIN          (5)


#define OB_BH1750_ADDRESS       (0x23)
#define OB_BME280_ADDRESS       (0x77)
#define OB_SHT3X_ADDRESS        (0x44)

#ifdef _USE_CN_
#define DASH_BME280_TEMPERATURE_STRING  "BME 温度"
#define DASH_BME280_PRESSURE_STRING     "BME 压力"
#define DASH_BME280_ALTITUDE_STRING     "BME 高度"
#define DASH_BME280_HUMIDITY_STRING     "BME 湿度"
#define DASH_DHT_TEMPERATURE_STRING     "DHT1x 温度"
#define DASH_DHT_HUMIDITY_STRING        "DHT1x 湿度"
#define DASH_BH1750_LUX_STRING          "BH1750 亮度"
#define DASH_SOIL_VALUE_STRING          "土壤湿度百分比"
#define DASH_SALT_VALUE_STRING          "盐分百分比"
#define DASH_BATTERY_STRING             "电池电压"
#define DASH_DS18B20_STRING             "18B20 温度"
#define DASH_SHT3X_TEMPERATURE_STRING   "SHT3X 温度"
#define DASH_SHT3X_HUMIDITY_STRING      "SHT3X 湿度"
#define DASH_MOTOR_CTRL_STRING          "水泵"
#else
#define DASH_BME280_TEMPERATURE_STRING  "BME Temperature"
#define DASH_BME280_PRESSURE_STRING     "BME Pressure"
#define DASH_BME280_ALTITUDE_STRING     "BME Altitude"
#define DASH_BME280_HUMIDITY_STRING     "BME Humidity"
#define DASH_DHT_TEMPERATURE_STRING     "DHT1x Temperature"
#define DASH_DHT_HUMIDITY_STRING        "DHT1x Humidity"
#define DASH_BH1750_LUX_STRING          "BH1750"
#define DASH_SOIL_VALUE_STRING          "Soil Value"
#define DASH_SALT_VALUE_STRING          "Salt Value"
#define DASH_BATTERY_STRING             "Battery"
#define DASH_DS18B20_STRING             "18B20 Temperature"
#define DASH_SHT3X_TEMPERATURE_STRING   "SHT3X Temperature"
#define DASH_SHT3X_HUMIDITY_STRING      "SHT3X Humidity"
#define DASH_MOTOR_CTRL_STRING          "Water pump"

#endif  /*_USE_EN_*/
