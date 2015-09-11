#Weather App
This is the sample Weather Application for the Syncano platform. 



##Step 1 - Install Weather App Solution
The initial steps will walk you through creating a new Syncano account, creating your Instance, and installing the Weather App Solution. 

###Step 1.1 Sign Up
If you haven't already, you will need to sign up for a [new Syncano account](https://dashboard.syncano.io/#/signup). If you already have one, you can skip to step 1.2.

1. Click the link
2. Enter an email address
3. Enter a secure password
4. Click "Create My Account"


###Step 1.2 Create a New Instance
An Instance is your app's backend -- this is where the magic happens. Here, you store data and define all processes for your application. 

####If you just created a new account

1. Click "Create Your First Instance Now" 
2. Then click "Confirm" to create a new Instance

####If you already have an account
1. Log in to Syncano 
2. Click the plus icon in the bottom right corner
3. Then click "Confirm"

Don't forget the Instance name that you just created -- you will need it in the next step!
	
###Step 1.3 Install a Solution
Have you ever written an application and wished someone else had already done parts of it for you? That's what Syncano Solutions are -- pieces of functionality developed by other members of the community.  In order to get you going, we have done most of the work for you.

In the upper right corner, click "Solutions". This is where you will find all of the various pre-made Solutions to install into your application. You can narrow your choices with tags, as well as add Solutions to your list of favorites. 

1. Follow this link - [Weather Sample App](https://dashboard.syncano.io/#/solutions/40/edit)
2. Click "Install Solution"
3. Select the Instance name you made from the previous step
4. Leave version at `1.0`
5. Click "Confirm"

After you click confirm, you should be redirected to your Instance, with the notification in the bottom left telling you that it was successfully installed.

###Step 1 Complete
Congratulations -- you have completed step 1! You should now have a new Instance with the `Weather Sample App` Solution installed. If not, you may have missed a step -- go try them again.

##Step 2 - Configure a 3rd Party Service
Syncano is great for tying together many different microservices and 3rd party APIs for your app to consume. In this step, we will set up [OpenWeatherMap](http://openweathermap.org/) to use in our application.

###Step 2.1 Sign Up for OpenWeatherMap
OpenWeatherMap is a great data source for all things weather. This app merely scratches the surface of what's possible. The great thing is, they have a free account that has a high limit of API calls for you to test.

1. Go to the [OpenWeatherMap Signup Page](http://home.openweathermap.org/users/sign_up)
2. Enter in a username, email address, and secure password
3. Click to agree with their "Terms of Service"
4. Click "Create Account"
5. After logging in, copy and store your `API Key` -- it's just after your email address and name


###Step 2.2 Update CodeBox Configurations
As a part of the Solution you installed, we included a `CONFIG` for the CodeBoxes to use.  These will need some information before you can proceed, so that they run correctly. 

####Get your Account Key
1. Make sure you are logged in to your Syncano Dashboard
2. Click "Account" in the upper left corner
3. Click your user name (the top menu item)
4. Then click the "Authentication" menu item

Copy and store your `Account Key` for the next step.


####Update Your First Config

1. Click `syncano` in the upper left to go to the Instance screen
2. Click the Instance where you installed the Weather App solution
3. In the left side menu, click "CodeBoxes"
4. Click the `get_weather` CodeBox

You should now be at the `Edit` screen with some `Python` code in an editor window. We will come back to this later.

For right now, click `Config`. Here is another editor window, with the following `JSON` object.

```
{
  "syncano_account_key": "YOUR ACCOUNT KEY",
  "open_weather_map_api_key": "YOUR OPEN WEATHER API KEY"
}
```

1. Replace "YOUR ACCOUNT KEY" with the `Account Key` you copied in the last step. It's a string, so leave the quotes.
2. Replace "YOUR OPEN WEATHER API KEY" with the OpenWeatherMap API key.  Yes -- also a string.
3. Click the floppy disk button to the right, and save your config. 

At this point, you can test the CodeBox on the edit screen. Copy and paste the following code in the `Payload` window.

```
{"city": "New York", "state": "NY"}
```

Now click the play button on the right, and the terminal window will display the results of your CodeBox run. If it doesn't work, check your `CONFIG` and make sure you have everything there set up properly. 

####Update Remaining Configurations
We need to update both the `update_city_weather` and `update_all_current_weather` configurations. 

#####For `update_city_weather` CodeBox config

1. Copy the `CONFIG` from the `get_weather` CodeBox
2. Click the back arrow, then select `update_city_weather`
3. Click `CONFIG` and select the entire object
4. Paste the `CONFIG` from `get_weather`

The `get_weather` and `update_city_weather` configurations are exactly the same; make sure they are identical. Before you click the back button - write down the `id` in the text `CodeBox: update_city_weather (id: ##)`.

#####For `update_all_current_weather` CodeBox config

The `update_all_current_weather` is _**almost**_ the same, which is always dangerous. You will need the `syncano_account_key` property,  and the second property is the `id` of `update_city_weather` CodeBox.

1. Click the `update_all_current_weather` CodeBox, and then go to its `CONFIG`. It should look like this:

	```
	{
	  "syncano_account_key": "YOUR ACCOUNT KEY",
	  "update_city_weather_codebox_id": "UPDATE CITY WEATHER CODEBOX ID"
	}
	```
2.  Replace the first line with `syncano_account_key` from `get_weather` and `update_city_weather`. 
3.  Change "UPDATE CITY WEATHER CODEBOX ID" to the `id` from `update_city_weather`. Yes, it still needs quotes.

###Step 2 Complete
Your application’s backend is completely set up now. Everything you need to run the front end code is done. Let's get the front end working next.


##Step 3 - Run Your Application
So far, you have installed a Solution into a new Instance, created your OpenWeatherMap account, and updated your CodeBox configurations.  If you have everything right, then there are only a couple more tasks left.

###Step 3.1 - Create an Instance API Key
There are three API keys in Syncano for various security levels: 

+ The `Account Key`, which controls _everything_; and with great power, comes great responsibility -- so be careful. We use it in the CodeBox, because those are server side processes and there is no access to it.
+ The `API Key`, which is at the Instance level and essentially scopes the data to that specific Instance. It has limited access to everything.
+ The `User Key`, which is specific to every user in your application. You don't have direct access to that without credentials from the user. 

For this, we only need the `API Key`.  But first, we need to create it.

1. Make sure you are logged in your Syncano Dashboard
2. Navigate to your Instance with the `Weather Sample App` Solution installed
3. Click on "API Keys" in the left menu
4. Click the plus icon, type in a description, and click "Confirm" -- you don't need to change any settings

After you confirm, you will see your `API Key`. Copy that and save it somewhere for later.

###Step 3.2 - Download the Application Code
There are a few last steps before you can view the application in your browser, but we are getting closer. Excited? Me too!

1. Download the [`weather-app`](https://github.com/Syncano/weather-app/archive/master.zip) repo from GitHub. 
2. Unzip the files and open the folder. 
3. Locate the `index.js` file in the `scripts` folder, and open it in your favorite text editor, such as Atom, WebStorm, or VIM. 

###Step 3.3 - Update the Application Code
There are 3 items you need to modify in the `index.js` file.

+ Webhook URL
+ Instance API Key
+ Instance Name

####Update the Webhook URL

1. Make sure you are logged in to your Syncano Dashboard
2. Navigate to your Instance with the `Weather Sample App` Solution installed
3. Click on `Webhooks` in the left side menu (it's the default page for the Instance)
4. Click the link icon under `URL` for the `get_all_weather` endpoint
5. Update `index.js` line 8 with your Webhook URL

	```
	var BASE_URL = "ADD YOUR WEBHOOK HERE";
	```

####Update the Syncano Credentials

1. Locate lines 9-12 in `index.js`
	```
	var syncano = new Syncano({
		apiKey: 'YOUR API KEY',
		instance: 'YOUR INSTANCE NAME'
	});
```
2. Change `apiKey` to be the Instance API Key from the last step. Of course, it's in quotes.
3. Change `instance` to be the Instance name with the `Weather Sample App` Solution installed.
4. Save `index.js`

###Step 3 Complete - Declare Victory

In the `weather-app-master` folder, locate the `index.html` file, and open it in your browser. Type in a city and state name, and press enter.  

##Go Further

At this point, you can look around at the other pieces in your Syncano Instance. Take a look at the CodeBoxes and learn what they do. Create your own, and try it out with the console.

Two main items we haven't covered -- 
+ Tasks - there is a schedule set up to run once a day, at midnight, to update cities
+ Channels - this is where the live updates come from. Whenever a city is updated, a Channel will send it to the front end code. 

Also -- after you have entered a few cities, make sure to look at Classes and view the `city_weather` data objects that have been created. 

Now, go build your own application, and tell us about it!


### Contributors

* Kelly Andrews  - [twitter](https://twitter.com/kellyjandrews), [github](https://github.com/kellyjandrews)
* Jhishan Khan - [twitter](https://twitter.com/jhishan), [github](https://github.com/jhishan)
* Brian Chuck - [twitter](https://twitter.com/devchuk), [github](https://github.com/devChuk)



