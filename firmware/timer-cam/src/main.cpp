#include "esp_camera.h"
#include "camera_pins.h"
#include "battery.h"
#include "bmm8563.h"

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

#include "env.h"

#define SLEEP_TIME 1 * 60 // X分

const char* bucket = "image";
const char* directory = "device";
const char* table = "device";

bool init_camera(void) {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_SXGA;
  config.jpeg_quality = 10;
  config.fb_count = 2;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return false;
  }

  sensor_t* s = esp_camera_sensor_get();

  s->set_vflip(s, 1); // 反転
  s->set_brightness(s, 2); // 明るさ
  s->set_saturation(s, 0); // 彩度

  return true;
}

void setup() {
  Serial.begin(115200);

  // WiFi接続
  WiFi.begin(SSID, PASSWORD);
  Serial.print("WiFi connecting...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // 初期化
  init_camera();
  bat_init();
  bmm8563_init(); // https://esp32.com/viewtopic.php?t=21030
  WiFiClientSecure client;
  client.setInsecure();

  // 撮影
  camera_fb_t* fb = esp_camera_fb_get();

  if (!fb) {
    Serial.println("Camera capture failed");
    delay(1000);
    ESP.restart();
  }
  Serial.println("Capture completed.");

  HTTPClient http;
  int http_code;

  // 画像をストレージに送信
  if (http.begin(client, String(SUPABASE_URL) + "/storage/v1/object/" + String(bucket) + "/" + String(directory) + "/" + String(UUID) + ".jpg")) {
    http.addHeader("Content-Type", "image/jpeg");
    http.addHeader("apikey", String(SUPABASE_KEY));
    http.addHeader("Authorization", "Bearer " + String(SUPABASE_KEY));
    http.addHeader("Connection", "close");
    http_code = http.sendRequest("PUT", fb->buf, fb->len); // "POST" or "PUT"
    if (http_code > 0) {
      String response = http.getString();
      Serial.print("code: ");
      Serial.println(http_code);
      Serial.print("response: ");
      Serial.println(response);
    }
    else {
      Serial.print("error: ");
      Serial.println(http_code);
    }
    http.end();
  }

  // 画像URLをデータベースに送信
  if (http.begin(client, String(SUPABASE_URL) + "/rest/v1/" + String(table))) {
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", String(SUPABASE_KEY));
    http.addHeader("Authorization", "Bearer " + String(SUPABASE_KEY));
    http.addHeader("Prefer", "resolution=merge-duplicates"); // UPSERT
    String image_url = String(SUPABASE_URL) + "/storage/v1/object/public/" + String(bucket) + "/" + String(directory) + "/" + String(UUID) + ".jpg";
    String payload = "{\"deviceId\":\"" + String(UUID) + "\",\"imageUrl\":\"" + image_url + "\",\"battery\":\"" + String(bat_get_voltage() * 0.001) + "\"}";
    http_code = http.sendRequest("POST", payload);
    if (http_code > 0) {
      String response = http.getString();
      Serial.print("code: ");
      Serial.println(http_code);
      Serial.print("response: ");
      Serial.println(response);
    }
    else {
      Serial.print("error: ");
      Serial.println(http_code);
    }
    http.end();
  }

  esp_camera_fb_return(fb);

  WiFi.disconnect(true);

  bmm8563_setTimerIRQ(SLEEP_TIME);

  esp_sleep_enable_timer_wakeup(SLEEP_TIME * 1000000UL);
  esp_deep_sleep_start();
}

void loop() {
}
