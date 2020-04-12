
//
//    Alyk  jatko course 2020       30.3.2020 KN
//    Voltage and freq mode 
//    Ethernet (1) module with W5100   / RED module



#include <LiquidCrystal.h>                            // include LCD library

#include <Ethernet2.h>                              // include Ethernet libarty W5500 library
//#include <Ethernet.h>                                 // incluide Ethernet library W5100

#include <PubSubClient.h>                             // include MQTT library      
#include <TimerOne.h>                                 // include timer library




//                   RS  E   D4  D5  D6  D7
     LiquidCrystal lcd(12, 11, 5, 4, 3, 2);            // LCD pin wiring settings for MEGA
//   LiquidCrystal lcd(8,  7,  6,  5,  4,  3);            // LCD pin wiring settings fro NANO

                                                      
EthernetClient ethClient;                               // Ethernet object var  

 
/////////////////////////////////////////////////////////////////////////////////////////////  
///                               MAC nro                                                  //
///     
                    //      Not relevat with Ethershield  
static uint8_t mymac[6] = { 0x44,0x76,0x58,0x10,0x00,0x73 };
                                                                                          ///

/////////////////////////////////////////////////////////////////////////////////////////////
//
//  MQTT settings
//
////////////////////////////////////////////////////////////////////////////////////////////
 
 unsigned int Port = 10884;                          //  MQTT port number

 byte server[] = { 193,167,167,59 };                 // TAMK IP

 
 char* deviceId     = "Merica";                   // * set your device id (will be the MQTT client username) 
 char* clientId     = "Uhhmerica";                       // * set a random string (max 23 chars, will be the MQTT client id) 
 char* deviceSecret = "tamk1";                        // * set your device secret (will be the MQTT client password) 

                                                      // MQTT Server settings  

  
void callback(char* topic, byte* payload, unsigned int length); // subscription callback for received MQTTT messages   

PubSubClient client(server, Port, callback, ethClient);   // mqtt client 


//////////////// MQTT topic names  ///////////////////////////

 #define inTopic    "ICT1_in_2020"                    // * MQTT channel where data are received 
 #define outTopic   "ICT4_out_2020"                   // * MQTT channel where data is send 


                                 

////////////////////////////////////////////////////////////////////////////////////////////////////////
///
///                               SETUP section
///
///////////////////////////////////////////////////////////////////////////////////////////////////////


void setup() {
  // put your setup code here, to run once:

    Serial.begin(9600);                                 // Serial monitor baudrate  = 9600

 
    lcd.begin(20,4);                                    // Display size defination 20 char  4 row
   
    lcd.setCursor(0,0);                                 // set curosor to left upper corner
    //         01234567890123456789
    lcd.print("30.3.2020 Alyk jatk ");                  // print to lCD 

    Serial.println("Start 12.4.2020");                   // print to serial monitor



    delay(500);

    
      fetch_IP();                                         // initialize Ethernet connection
                                                          // get IP number from DHCP
    
      Connect_MQTT_server();                              // connect to MQTT server    

  
}

///////////////////////////////////////////////////////////////////////////////////////////////////
///
///                           LOOP section
///
///////////////////////////////////////////////////////////////////////////////////////////////////

void loop()     //  main code here 
{
int inx=69;
  
while(true) 
  {  

    lcd.setCursor(0,3);                                 // set curosor to left upper corner
    
    //         01234567890123456789
    lcd.print("                    ");
    
    lcd.print("Send message:  ");                       // print to lCD 
    lcd.print(inx);                                      // print value of inx to LCD 

   
    send_MQTT_message(inx);
    
    inx++;

    delay(1500);
  }

}

//////////////////////////////////////////////////////////////////////////////////////////////
///
///    LOOP END
///
/////////////////////////////////////////////////////////////////////////////////////////////




//


//////////////////////////////////////////////////
//////
//////    Ethernet
//////
/////////////////////////////////////////////////
////////////////////////////////////////////////////////
///////////
///////////    Ethernet routines
///////////
///////////////////////////////////////////////////////

///////////////////////////////////////////
//////// GET IP number from DHCP server
//////////////////////////////////////////


void fetch_IP(void)
{
  byte rev=1;



  lcd.setCursor(0,0);

  //         01234567890123456789  
  lcd.print("     Waiting IP     ");

  rev=Ethernet.begin( mymac);                  // get IP number
     
  Serial.print( F("\nW5500 Revision ") );
    
  if ( rev == 0){
                   
                      Serial.println( F( "Failed to access Ethernet controller" ) );
                   
                                                // 0123456789012345689 
                    lcd.setCursor(0,0); lcd.print(" Ethernet failed   ");
                 }    
                 
              
     Serial.println( F( "Setting up DHCP" ));
     Serial.print("Connected with IP: "); 
     Serial.println(Ethernet.localIP()); 


  lcd.setCursor(0,0);
  //         012345678901234567890
  lcd.print("                     ");
  
  lcd.setCursor(0,0);
  lcd.print("myIP=");
  lcd.print(Ethernet.localIP());
  delay(1500);

}

/////////////////////////////////////////////////////////////////////////////////
//////////////// MQTT Routines
///////////////////////////////////////////////////////////////////////////////

                                                             
void send_MQTT_message(int num)                     // Send MQTT message
{

    char bufa[50];

    sprintf(bufa,"American_MQTT: wind_speed =%d KPH", num);               // create message with header and data

    Serial.println( bufa );                              //  Print message to serial monitor

     
   if (client.connected()) 
     
  { 
        Serial.print("client.connected()");
        client.publish(outTopic,bufa);                        // send message to MQTT server        
  }
  else
  {                                                           //   Re connect if connection is lost
    delay(500);

           lcd.setCursor(0,1);
                  //  012345678901234567890
           lcd.print("   RE Connecting    ");                // Re Connection 
         
              Serial.println(" RE Connecting" );

      client.connect(clientId, deviceId, deviceSecret);
        
      delay(1000);                                            // wait for reconnecting
  }
  
}




                                                   
 
 void Connect_MQTT_server()                         //  MQTT server connection  
 { 
                                     
            Serial.println(" Connecting to MQTT" );

            Serial.print(server[0]); Serial.print(".");     // Print MQTT server IP number to Serial monitor
            Serial.print(server[1]); Serial.print(".");
            Serial.print(server[2]); Serial.print(".");
            Serial.println(server[3]); 
         

            lcd.setCursor(0,1);
            //         012345678901234567890
            lcd.print("                     ");
            
            lcd.setCursor(0,1);
            lcd.print("MQTT=");
            lcd.print(server[0]);lcd.print(".");              // Print MQTT server IP number to LCD
            lcd.print(server[1]);lcd.print(".");
            lcd.print(server[2]);lcd.print(".");
            lcd.print(server[3]);
            
            delay(500);


   if (!client.connected())                                   // check if allready connected  
     { 
                                                              // connection to MQTT server 
      if (client.connect(clientId, deviceId, deviceSecret)) 
        { 
           lcd.setCursor(0,1);
           lcd.print("Conn");                                 // Connection is OK
         
            Serial.println(" Connected OK " );
                                           
            client.subscribe(inTopic);                        // subscript to in topic        
        } 
     else
        {
           lcd.setCursor(0,1);
           //         01234567890123456789
           lcd.print("  MQTT Error        ");                                 // error in connection

           Serial.println(" MQTT Connection ERROR " );
     
        }    
    } 
    
 }



                                                       // Receive incoming MQTT message   
 
 void callback(char* topic, byte* payload, unsigned int length) 
 { 
                                                      // copu the payload content into a char* 
   char* receiv_string; 
   receiv_string = (char*) malloc(length + 1); 
   memcpy(receiv_string, payload, length);           // copy received message to receiv_string 
   receiv_string[length] = '\0';           
    
       lcd.setCursor(0,0);
       //         01234567890123456789
       lcd.print("Mess=               ");
       
       lcd.setCursor(5,0);
       lcd.print(receiv_string);                      // print reveived message to LCD

       Serial.println( receiv_string );
       
   free(receiv_string); 
 } 
