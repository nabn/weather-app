from syncano.models import Object, CodeBox
import syncano

syncano_account_key = CONFIG["syncano_account_key"]
syncano.connect(api_key=syncano_account_key)

# Get Instance name from the META object
instance_name = META["instance"]

all_cities = Object.please.list(instance_name=instance_name, class_name="city_weather")

update_city_weather_codebox_id = CONFIG["update_city_weather_codebox_id"]
# For loop that updates the weather for all cities
for city in all_cities:
    # This CodeBox updates the weather for a city
    CodeBox.please.run(instance_name=instance_name,
                       id=update_city_weather_codebox_id,
                       payload={"object_id":city.id})

'''
This codebox loops through all the city objects and updates their weather by running
the CodeBox with the label "update_city_weather"

We run this CodeBox on a schedule.

The updates for the city objects all go into the channel "weather_realtime"
The channel has a room name which is ID of the city, we get this unique ID from
the open weather map api. Each city is in a different channel room. This makes
parsing the changes on the front end easy!

Dont forget these three things in the CONFIG file
- syncano_account_key
- instance_name
- update_city_weather_codebox_id
'''
