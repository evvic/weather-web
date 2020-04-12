
///////////////////////////  18.2.2019  KN /////////////////////////////



#include <cstdio>
#include <cstring>
#include <string>
#include <functional>     	// c++11

#include <iostream>        	// due to: cout

#include <fstream>
#include <jsoncpp/json/json.h>

#include <mutex>
#include <condition_variable>

using std::cout;
using std::endl;
 


#include "mqtt.h"

#include "mqtt_arduino1.h"
#include "SendTamk.h"


using namespace std;

extern mutex xmut;
extern std::condition_variable cv;


//////////////////////////////////////////////////////////////////////////
//////////
//////////    MQTT
//////////
/////////////////////////////////////////////////////////////////////////

mqtt::mqtt(const char *id, const char *host, int port) : mosquittopp(client_id)
{
	int keepalive = 60;

	// Connect immediately. This could also be done by calling
	// mqtt_tempconv->connect(). 

	printf("****   MQTT start connect ****** \n");

	connect(host, port, (int) keepalive);
};


////////// ON CONNECT ///////////////////////////////////////////////////


void mqtt::on_connect(int rc)
{
	printf("****   MQTT Connected with code= %d  *****\n", rc);
	if(rc == 0)
	{

		/* Only attempt to subscribe on a successful connect. */

		subscribe(NULL, in_topic);

		printf("****   MQTT subscription to topic = ");printf(in_topic);
		printf("    ****\n");

	}
}

//////////////////////////  ON SUBSCRIBE ///////////////////////////////////////

void mqtt::on_subscribe(int mid, int qos_count, const int *granted_qos)
{

	printf("****   MQTT Topic subscription succeeded.   ****\n");

}


//////////////////////////// Message received //////////////////////////////////

void mqtt::on_message(const struct mosquitto_message *message)
{
	
	printf("\n");
	
        printf(" Msg received "); 

	if(!strcmp(message->topic, in_if_topic))
	{
		memset(buf, 0, 151*sizeof(char));
		// Copy N-1 bytes to ensure always 0 terminated. 
		memcpy(buf, message->payload, 150*sizeof(char));

		/// ICT course   prefix:  IOTJS
		if((buf[0]=='I') && (buf[1]=='O') && (buf[2]=='T') && (buf[3]=='J') && (buf[4]=='S'))  /// ICT course
          		{  ICT_rest();  };

	}  // ICT topic	 MQTT message exist in buf[] global table		
}



////////////////////////////////  IOT ICT course format //////////////////////

void mqtt::ICT_rest (void)

{

    Json::Reader reader;
    Json::Value obj;


	
        char json_1[250];			// temp JSON string

	char sensor_name1[80];		// character tables for sensor tags
	char sensor_path1[80];
	char sensor_unit1[10];



	int i=0;
	while(buf[i]!=0)
	{
          json_1[i]=buf[i+6];	// remove "IOTJS="  from beging of MQTT message
 	//  cout << json_1[i] ; 
	  i++;
	}
	json_1[i]='\0';



	
	std::string json_in;
	std::string parse_string;

	json_in=json_1;
	
	cout << "json_in = " << json_in << endl ;

	// dummy string start settings

	sprintf(sensor_name1,"-");
	sprintf(sensor_path1,"dummy");
	float sensor_value1=-2000;
	sprintf(sensor_unit1,"-");
	sprintf(sensor_data,"?");


	char svalue[30];


	////////////     Parse out json tags     ///////////////////////////


 	if(reader.parse(json_in, obj)==true)	// check if parsing OK
	{     
  

		//   Check mqtt message content 


		/////////////////////////////// signal name /////////////////////
		if(obj["S_name"].isString())
		{
			parse_string=obj["S_name"].asString();
			strncpy(sensor_name1,parse_string.c_str(),parse_string.length());
			sensor_name1[parse_string.length()]='\0';
 			cout << " Sensor name: " << sensor_name1 ;
		};


		////////////////////////////// signal value //////////////////////
		if(obj["S_value"].isDouble())
		{
			sensor_value1=obj["S_value"].asFloat();
			cout << " // Sensor value Float: " << sensor_value1 ;
			sprintf(svalue,"%f",sensor_value1);
		}
		else
		{

			if(obj["S_value"].isInt())
			{
				sensor_value1=obj["S_value"].asInt();
				cout << " // Sensor value Int: " << sensor_value1 ;
				sprintf(svalue,"%d",sensor_value1);
			}
		};	


		//////////////////////////////// signal path //////////////////////
		if(obj["S_path"].isString())
		{
			parse_string=obj["S_path"].asString();
			strncpy(sensor_path1,parse_string.c_str(),parse_string.length());
			sensor_path1[parse_string.length()]='\0';
 			cout << " // Sensor path: " << sensor_path1 ;
		};


		///////////////////////////////// signal unit ///////////////////////
		if(obj["S_unit"].isString())
		{
			parse_string=obj["S_unit"].asString();
			strncpy(sensor_unit1,parse_string.c_str(),parse_string.length());
			sensor_unit1[parse_string.length()]='\0';
 			cout << " // Sensor unit: " << sensor_unit1 ;
		};


		////////////////////////////////// signal data ////////////////////////
		if(obj["S_data"].isString())
		{
			parse_string=obj["S_data"].asString();
			strncpy(sensor_data,parse_string.c_str(),parse_string.length());
			sensor_data[parse_string.length()]='\0';
 			cout << " // Sensor data: " << sensor_data ;
		};


		cout << " ::parsing done " << endl;

		///       send JSON to TAMK  

		/////////////////////  final out json string  //////////////////

		std::string jsondat ="{\"";

		std::string sen_name;		// sensor name string

		sen_name=sensor_name1;
		
		//  create JSON string from sensor name + sensor value 

		jsondat=jsondat + sen_name + "\":" + svalue + "}" ;

		cout << " To send sensor: " << jsondat<< endl << endl;




		///////////////////////////////////////   SEND TO DB ////////////////////////////////////////////		

		send_to_Tamk_REST_API_0("http://webapi19sa-1.course.tamk.cloud/v1/weather",jsondat);	// call url creation function	


		

	} else
	{
		cout << " --- Error in JSON parsing ---- " << endl;
	};

					

}









