# weather-app
Weather data collection and transmission through a wired Arduino

###### LOG & NOTES FOR WEATHER-APP DEVELOPMENT... <br>


## Raspberry Pi VM / MQTT Broker: <br>

#### The Raspberry Pi is the VM, running the C++ gateway code as the MQTT broker. The broker accepts the MQTT message sent from the Arduino and parses the data in JSON format and then sends it to my database.

To **subscribe to ALL MQTT messages** being received: `mosquitto_sub -t "#"` <br>
The hash #, gives all messages being received (at least in it''s scope) <br>
mqtt_arduinno1.cpp added backend URL http://bowd9-api.course.tamk.cloud/v1/weather to send_to_Tamk_REST_API_0() so weather data started to get parsed and sent into JSON formatted messages to my DB. <br>

Used WinSCP (like PuTTY) to login into VM and edit mqtt_arduinno1.cpp, then saved changes. <br>
Logged into VM through PuTTY and navigated to iotti/Embsys/ and in console used `make` command to **compile saved changes**. <br>
After, typed command `./goE` to **run compiled C++** so now MQTT messages sent from Arduino are getting parsed into JSON format and sent to my backend. <br>

When the terminal is closed, the VM running the program stops (so no more data is parced and sent to our DB). <br>
To **keep the program running after the terminal/session is closed**: `nohup./goE/dev/null 2>&1`. <br>
However, the program CANNOT be running while another person/team is editing the file or else it can become corrupted.<br>
To **stop the program from running**: `kill 14095`. <br>
To **check beforehand if the program is running**: `ps aux | grep -i 'goE'` OR `ps -A`. If you see a `goE` in the terminal, then the program is still running and must be terminated. <br>

To check how many times the program is running: `ps aux | grep -i 'goE'` OR `ps -A`. If `goE` is displayed more than once, it is running more than once which causes errors. <br>

We were able to test the frontend was displaying the data in my DB by using eric.brown/frontend/weather-app/ and changing the datadummp.js file to use my backend DB URL versus the original from the school. <br>


###### With data now flowing into backend container, we must now work on frontend to work on the internet. <br>
<br>
OpenVPN GUI is needed to connect to my student VPN <br>
WinSCP is like PuTTY but with a folder UI <br>
