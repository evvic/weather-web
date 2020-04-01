#include <TimerOne.h>
#include <LiquidCrystal.h>



LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
int freq;

#define intpin 21
volatile byte pulse = 0;


void setup() {
  lcd.begin(20, 4);

  pinMode(intpin,INPUT);
  attachInterrupt(digitalPinToInterrupt(intpin), pulse_interrupt, RISING);
  
  
  
}

void loop() {
  
  lcd.setCursor(0, 0);
  lcd.print("Pulse Count: ");

  lcd.print(pulse);
  delay(2000);
}


void pulse_interrupt(){
  pulse++;
}
