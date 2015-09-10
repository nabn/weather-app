from syncano.models import *
import syncano
import requests
import json
# sample ARGS for testing  {"city": "New york", "state": "NY"}
# merge POST and GET ARGS so that we can run this in a webhook and with direct CodeBox runs
GET = ARGS.get("GET",{})
POST = ARGS.get("POST",{})
ARGS.update(GET)
ARGS.update(POST)

# Make sure to put your syncano account key in the CONFIG file
syncano_account_key = CONFIG["syncano_account_key"]
syncano.connect(api_key=syncano_account_key)

# Make sure to put your instance name in the CONFIG file
instance_name = CONFIG["instance_name"]


'''
This function gets the current temperature of a given city and state and then updates
a specific city object with the new current data

Be sure to go to http://openweathermap.org/ and make an account.
After you have made your account, get your openweather map api key and place it
in the CONFIG file where it is labeled 'insert open weather map api key here'
'''
def get_current_temperature(city, state_or_country):
    open_weather_map_api_key = CONFIG["open_weather_map_api_key"]
    url = "http://api.openweathermap.org/data/2.5/weather?q="+city+","+state_or_country+"&APPID="+open_weather_map_api_key
    r = requests.post(url=url)
    todays_weather = json.loads(r.content)

    city_id = todays_weather["id"]

    short_description = todays_weather["weather"][0]["main"]
    long_description = todays_weather["weather"][0]["description"]

    Object.please.update(current_temp=int(todays_weather["main"]["temp"]),
                         current_temp_high=int(todays_weather["main"]["temp_max"]),
                         current_temp_low=int(todays_weather["main"]["temp_min"]),
                         short_description=short_description,
                         long_description=long_description,
                         instance_name=instance_name,
                         class_name="city_weather",
                         id=ARGS["object_id"])


# This is where all the magic happens! We get the city and then pass the details to our get_current_temperature() function
city = Object.please.get(instance_name=instance_name, class_name="city_weather", id=ARGS["object_id"])
get_current_temperature(city=city.city, state_or_country=city.state)
