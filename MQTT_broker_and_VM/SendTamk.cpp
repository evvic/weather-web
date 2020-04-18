//
// Iot arch Tamk 18.2.2019 KN
//   



#include "SendTamk.h"
#include "mqtt_arduino1.h"

#include <mutex>
#include <condition_variable>


extern std::mutex xmut;
extern std::condition_variable cv;
using namespace std;



///////////////////////// create and send REST API //////////////////////////

///////////////////////////////////////////////////////

void send_to_Tamk_REST_API_0(string cl_st, string json_dat)			// create URL with CURL library
{
  CURLcode ret;						// URL send return code
  CURL *hnd;						// CURL Handle
  struct curl_slist *slist;


  std::string url_id = cl_st;

  slist = NULL;
  slist = curl_slist_append(slist, "Content-Type: application/json;charset=UTF-8");

  extern mutex mut;


////////////////////////////////////////////////////////////
///
///	Create REST API URL structure for DB
///
///////////////////////////////////////////////////////////

	std::string json_db = "{ }";

  	json_db="{\"device_id\":\"ICT_2020\",\"data\":"+ json_dat + "}";
    //Originally said "ICT_2018", changed to 2020 cause kari said we think


///////////////////////////Rest Api  URL created //////////////////////


	cout << " POST with cURL= "<<json_db << endl << endl;

////////////////////////// CURL field setting //////////////////	

  hnd = curl_easy_init();

  curl_easy_setopt(hnd, CURLOPT_URL, url_id.c_str());		// Addres to URL

  curl_easy_setopt(hnd, CURLOPT_NOPROGRESS, 1L);

  curl_easy_setopt(hnd, CURLOPT_HEADER, 1L); 

  curl_easy_setopt(hnd, CURLOPT_POSTFIELDS,json_db.c_str());	// JSON data string adding to URL

  int lng=json_db.length(); 

  curl_easy_setopt(hnd, CURLOPT_POSTFIELDSIZE_LARGE, (curl_off_t)lng);

  curl_easy_setopt(hnd, CURLOPT_USERAGENT, "curl/7.38.0");
  curl_easy_setopt(hnd, CURLOPT_HTTPHEADER, slist);
  curl_easy_setopt(hnd, CURLOPT_MAXREDIRS, 50L);
  curl_easy_setopt(hnd, CURLOPT_SSH_KNOWNHOSTS, "/home/pi/.ssh/known_hosts");
  curl_easy_setopt(hnd, CURLOPT_CUSTOMREQUEST, "POST");
  curl_easy_setopt(hnd, CURLOPT_TCP_KEEPALIVE, 1L);
  
  ret = curl_easy_perform(hnd);

  printf("\n"); 
  printf("\n Server Return code ="); 
  cout << ret << endl; 
  printf("\n"); 

  curl_easy_cleanup(hnd);
  hnd = NULL;

  curl_slist_free_all(slist);
  slist = NULL;
 
}




//////////////////////////////////////////////////////////////////
////
////   URL raw test code for testing
////
/////////////////////////////////////////////////////////////////
void test_url(void)
{
  CURLcode ret;
  CURL *hnd;
  struct curl_slist *slist1;

  slist1 = NULL;
  slist1 = curl_slist_append(slist1, "Content-Type: application/json;charset=UTF-8");

  hnd = curl_easy_init();

  curl_easy_setopt(hnd, CURLOPT_URL, "http://poyry.iotlab.tamk.fi/api/v1/weather");

  curl_easy_setopt(hnd, CURLOPT_NOPROGRESS, 1L);
  curl_easy_setopt(hnd, CURLOPT_HEADER, 1L);
  curl_easy_setopt(hnd, CURLOPT_POSTFIELDS, "{ \"temperature\": \"31\", \"wind_speed\":\"72\", \"wind_direction\":\"3\", \"pressure\":\"4\", \"humidity_in\":\"5\", \"humidity_out\":\"6\", \"light\":\"7\",\"rain\":\"8\"}");
  curl_easy_setopt(hnd, CURLOPT_POSTFIELDSIZE_LARGE, (curl_off_t)142);
  curl_easy_setopt(hnd, CURLOPT_USERAGENT, "curl/7.38.0");
  curl_easy_setopt(hnd, CURLOPT_HTTPHEADER, slist1);
  curl_easy_setopt(hnd, CURLOPT_MAXREDIRS, 50L);
  curl_easy_setopt(hnd, CURLOPT_SSH_KNOWNHOSTS, "/home/pi/.ssh/known_hosts");
  curl_easy_setopt(hnd, CURLOPT_CUSTOMREQUEST, "POST");
  curl_easy_setopt(hnd, CURLOPT_TCP_KEEPALIVE, 1L);

  /* Here is a list of options the curl code used that cannot get generated
     as source easily. You may select to either not use them or implement
     them yourself.

  CURLOPT_WRITEDATA set to a objectpointer
  CURLOPT_WRITEFUNCTION set to a functionpointer
  CURLOPT_READDATA set to a objectpointer
  CURLOPT_READFUNCTION set to a functionpointer
  CURLOPT_SEEKDATA set to a objectpointer
  CURLOPT_SEEKFUNCTION set to a functionpointer
  CURLOPT_ERRORBUFFER set to a objectpointer
  CURLOPT_STDERR set to a objectpointer
  CURLOPT_HEADERFUNCTION set to a functionpointer
  CURLOPT_HEADERDATA set to a objectpointer

  */

  ret = curl_easy_perform(hnd);

  curl_easy_cleanup(hnd);
  hnd = NULL;
  curl_slist_free_all(slist1);
  slist1 = NULL;

  printf("\n"); 
  printf("\n Server Return code ="); 
  cout << ret << endl; 
  printf("\n");


  }

/**** End of sample code ****/





