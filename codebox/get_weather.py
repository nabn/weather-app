from syncano.models import Object
from datetime import datetime
import datetime
import time
import syncano
import json
import requests

# sample args for testing {"city": "New york", "state": "NY"}
# merge POST and GET ARGS for webhooks and direct CodeBox Runs
GET = ARGS.get("GET",{})
POST = ARGS.get("POST",{})
ARGS.update(GET)
ARGS.update(POST)

syncano_account_key = CONFIG["syncano_account_key"]
syncano.connect(api_key = syncano_account_key)

# Get Instance name from the META object
instance_name = META["instance"]

'''
This function makes a call to the http://openweathermap.org/ api and gets
the current weather in the city and state that you pass.
Make an account with openweathermap and place your api key in the CONFIG
file, where it is labeled 'insert open weather map api key here'
'''
def make_call_for_todays_weather(city, state_or_country):
    open_weather_map_api_key = CONFIG["open_weather_map_api_key"]
    url = "http://api.openweathermap.org/data/2.5/weather?q="+city+","+state_or_country+"&APPID="+open_weather_map_api_key
    r = requests.post(url=url)
    todays_weather = json.loads(r.content)
    return todays_weather

'''
This function checks if the current city objects exists in the city_weather class
If the object does not exist, it is created. If the object does exist, we get the data
from the syncano city_weather object instead of calling the open weather map api.

The objects in the city_weather class are updated on a schedule, check the tasks tab
on the left to edit the schedule!

Also, dont forget to put the name of your instance in the CONFIG file, where it is
labeled 'insert syncano instance name here'
'''
def get_current_temperature(city, state_or_country):
    # looks for the city object by filtering with city and state
    found = False
    syncano_city_objects = Object.please.list(instance_name=instance_name, class_name="city_weather").filter(city__eq=city, state__eq=state_or_country)
    syncano_city_obj = None
    for city in syncano_city_objects:
        found = True
        syncano_city_obj = city
        break

    today = {}
    # if not found, we ping the openweathermap api with the make_call_for_todays_weather() function
    if not found:
        todays_weather = make_call_for_todays_weather(city, state_or_country)
        city_id = todays_weather["id"]
        utc = todays_weather["dt"]

        short_description = todays_weather["weather"][0]["main"]
        long_description = todays_weather["weather"][0]["description"]
        Object.please.create(current_temp=int(todays_weather["main"]["temp"]),
                             current_temp_high=int(todays_weather["main"]["temp_max"]),
                             current_temp_low=int(todays_weather["main"]["temp_min"]),
                             short_description=short_description,
                             long_description=long_description,
                             city=city,
                             state=state_or_country,
                             city_id=city_id,
                             channel="weather_realtime",
                             channel_room=city_id,
                             instance_name=instance_name,
                             class_name="city_weather")
        today['utc'] = utc
        today['city_id'] = city_id
        today['short_description'] = short_description
        today['long_description'] = long_description
        today['temp'] = int(todays_weather["main"]["temp"])
        today['temp_high'] = int(todays_weather["main"]["temp_max"])
        today['temp_low'] = int(todays_weather["main"]["temp_min"])
        return today
    else:  # this means we found the object, and we can use the syncano object to get the data
        rightnow = int(time.mktime(datetime.datetime.now().timetuple()))

        today['utc'] = rightnow
        today['city_id'] = syncano_city_obj.city_id
        today['temp'] = syncano_city_obj.current_temp
        today['temp_high'] = syncano_city_obj.current_temp_high
        today['temp_low'] = syncano_city_obj.current_temp_low
        today['short_description'] = syncano_city_obj.short_description
        today['long_description'] = syncano_city_obj.long_description
        return today

'''
This function calls the openweathermap api to get a 5 day fourcast
We delete the data for the first day because our app uses
the current weather data for the current time instead.

Make sure to make an account with openweathermap and place your api key
in CONFIG where it is labeled 'insert open weather map api key here'
'''
def make_call_for_4_day_forecast(city, state_or_country):
    open_weather_map_api_key = CONFIG["open_weather_map_api_key"]
    url = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+city+","+state_or_country+"&cnt=5&APPID="+open_weather_map_api_key
    r = requests.post(url=url)
    weather_data = json.loads(r.content)
    weather_data = weather_data['list']
    # remove the current day of weather, because we load current day's weather
    # in the get_current_weather() call
    del weather_data[0]

    return weather_data

'''
Calls the make_call_for_4_day_forecast() function
Then the function parses the needed data and returns a json with the data we need
'''
def get_four_day_forecast(city, state_or_country):
    four_day_forecast = make_call_for_4_day_forecast(city, state_or_country)
    parsed = []
    the_day = {}
    for day in four_day_forecast:
        utc = day["dt"]
        the_day['utc'] = utc
        the_day['temp'] = int(day['temp']['day'])
        the_day['temp_low'] = int(day['temp']['min'])
        the_day['temp_high'] = int(day['temp']['max'])
        the_day['short_description'] = day['weather'][0]['main']
        the_day['long_description'] = day['weather'][0]['description']
        parsed.append(the_day)
        the_day = {}
    return parsed

'''
Below is where all the magic happens!
'''

city = ARGS.get("city", None)
state_or_country = ARGS.get("state", None)

if city is None and state_or_country is None:
    raise ValueError("You didn't pass city and state")
elif city is None:
    raise ValueError("You didn't pass city")
elif state_or_country is None:
    raise ValueError("You didn't pass state")

final_data = []
current_weather = get_current_temperature(city, state_or_country)
final_data.append(current_weather)

four_day_forecast = get_four_day_forecast(city, state_or_country)
for day in four_day_forecast:
    final_data.append(day)
print json.dumps(final_data)
