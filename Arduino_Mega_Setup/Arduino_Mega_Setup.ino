//SET-UP
//make sure correct port is selected (the one arduino is connected to)
//select correct arduino: Tools-> Board -> (select the arduino board being used)

////////////////////////////////////////////////////
//      LCD Display
////////////////////////////////////////////////////

#include <LiquidCrystal.h> //LCD 20x4 display

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);


////////////////////////////////////////////////////
//      KEYPAD  
////////////////////////////////////////////////////

#include <Keypad.h> 

const byte ROWS = 4; //four rows
const byte COLS = 4; //three columns
char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};
byte rowPins[ROWS] = {30,31,32,33};
byte colPins[COLS] = {34,35,36,37};

Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS);

char key;

////////////////////////////////////////////////////
//      Frequency Measurement
////////////////////////////////////////////////////

int sensorValue;


void setup() {
  lcd.begin(20,4);

  sensorValue = analogRead(A5);
}

void loop() {
  key = keypad.getKey();

  sensorValue = analogRead(A5);

  //print the number of seconds since reset
  lcd.setCursor(0, 0);
  lcd.print("Seconds: ");
  lcd.print(millis() / 1000);

  //print the frequency / analog signal
  //the read value might need to be adjustted to be more accurate
  lcd.setCursor(0, 1);
  lcd.print("Sensor value: ");
  lcd.print(sensorValue);

  //print the current key pressed
  if(key){
    lcd.setCursor(0, 2);
    lcd.print("key: ");
    lcd.print(key);
  }
    //lcd.clear();

}



//Embedded Systems Spring 2020 TAMK
//"Software Americans" group: Eric, Oscar, & Jaakko
