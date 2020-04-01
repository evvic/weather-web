#include <LiquidCrystal.h> //LCD 20x4 display

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

void setup() {
  lcd.begin(20,4);
}

void loop() {
  lcd.setCursor(0, 0);

  //print the number of seconds since reset
  lcd.print("Seconds: ");
  lcd.print(millis() / 1000);
}
