# ABOUT THE CHALLENGE 

This repository is a part of our team's '<b>Flame Guard Dispatch</b>' submission for the Tech Optimum Hacks 2023 hackathon. 
Here is our team : 

![FlameGuard (1)](https://github.com/YanikaD/FlameGuardDispatch/assets/72496335/0c303262-64a9-4f33-838e-a5e5d66e9501)

# Introduction
Our innovation aims to:

1. Facilitate fire departments and local people in California to investigate the route and estimate the distance from fire stations to fire locations.

2. Plan and transfer victims to hospitals nearby.
   
3. Analyze the severity of fire events such as hotspot locations
   
4. Present the chemical from the combustion in California as time-series and spatial data then visualize them in Dashboard.
   
![FlameGuard](https://github.com/YanikaD/FlameGuardDispatch/assets/72496335/85573888-ddcc-4cad-b8a9-c76bac9f00d2)

## Study area

California, located on the western coast of the United States, boasts an incredibly diverse and picturesque landscape. Its geography includes coastal regions, towering mountains, vast deserts, fertile valleys, and lush forests. This diversity of terrain contributes to the state's rich ecological and cultural heritage.

**Coastal Regions**: California's extensive coastline stretches for over 800 miles along the Pacific Ocean, offering stunning vistas and a temperate climate.

**Mountain Ranges**: The Sierra Nevada mountain range runs along the eastern edge of the state, with peaks exceeding 14,000 feet. The coastal ranges also contribute to the state's topographical variety.

**Deserts**: The southeastern part of California is characterized by desert landscapes, including the iconic Mojave Desert, known for its unique flora and otherworldly landscapes.

**Valleys**: Fertile valleys, such as the Central Valley, are essential agricultural regions, producing a significant portion of the nation's fruits, vegetables, and nuts.

**Forests**: California's forests, including the famous redwood and sequoia groves, are both awe-inspiring and ecologically vital.

## Problem

California's natural beauty is juxtaposed with its susceptibility to wildfires, a recurring environmental challenge that has gained considerable attention in recent years. Some of the factors attributed to this include: 

**Climate Factors**: The Mediterranean climate prevalent in much of California features hot, dry summers and mild, wet winters. This creates ideal conditions for the ignition and spread of wildfires.

**Drought**: Prolonged periods of drought have left vegetation parched and susceptible to ignition. Drier conditions also lead to reduced moisture content in soil and plants.
Santa Ana Winds: These strong, dry winds originating from the desert can fan the flames of wildfires, causing rapid and unpredictable spread.

**Urban-Wildland Interface**: California's expanding urban areas often interface with wildland areas, increasing the risk of fires encroaching on populated regions.

**Human Activity**: Many wildfires are sparked by human activities, including power lines, discarded cigarettes, campfires, and equipment use. Accidental or intentional ignitions contribute to fire incidents.
The summary of the type of fires in the region can be seen below:
![Area burnt per incident type-2](https://github.com/YanikaD/FlameGuardDispatch/assets/72496335/9cceff05-c3c4-4ed1-9212-3131fadb0df3)


## Methodology
![FlameGuard (2)](https://github.com/YanikaD/FlameGuardDispatch/assets/72496335/1e2cb0c3-41c3-4897-a9d7-1aebc676fb12)

### Step 1: Spatial analysis by GIS tools
The first step is an analysis of hotspots and active fire locations by using open-source datasets from NASA FIRMS https://firms.modaps.eosdis.nasa.gov/active_fire/. The fire point has an attribute of 'Brightness index' which represents temperature of fire in Kelvin, the fire derived from MODIS Sattellite resolution 1 km. And then summarize the active fire points into each county and visualize the map as choropleth maps. Moreover, we performed the analysis of Fire hotspot to see which area of California has been affected by fires often
![FlameGuard (1)](https://github.com/YanikaD/FlameGuardDispatch/assets/119694198/ebce3228-8199-4c6f-9c4d-52b10922ffe5)

### Step 2: Routing and Reporting
### 2.1. Routing Machine: 
This step utilizes 'Routing machine' leaflet library using JAVA Script code. Routing Machine library is typically used in applications that require mapping functionalities, such as GPS navigation apps, logistics and transportation management systems, location-based services. The library is built to handle complex routing scenarios, including multi-point routes, turn-by-turn directions, real-time traffic updates, and alternative route suggestions.
![image](https://github.com/YanikaD/FlameGuardDispatch/assets/119694198/88b62dfd-4477-44d0-9409-115dd14251f9)

By leveraging a Routing Machine library, we need to handle a variety of geographical data formats, including GeoJSON, shapefiles, in order to integrate with geographic data systems.
Furthermore, we leverages this library to tailor the routing experience to the application that helps fire fighters planning the route when there is a fire event.
To get started with Leaflet Routing Machine, we need to set the leaflet page with the following script:
```
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
<script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
```
Note: Before adding shapefile formats such as hospitals, hotspots, and boundaries, they need to be converted into GeoJson formats in order to work with this library. This step we converted them by using QGIS software.

### 2.2. Online responsive report using HTML:
This form allows people to report fire locations that happen around their locations. This platform can mitigate the severity of fires and the dangers of smokes, and it could extinguish quickly before they cause many effects. This form uses HTML code.
![Screenshot (1305)](https://github.com/YanikaD/FlameGuardDispatch/assets/119694198/59b46bc5-bc7d-4510-b7c4-cc07f9dfdb96)

### Step 3: Effect
Fire events in California, particularly wildfires, can have a wide range of significant effects on the environment, communities, economy, and public health. These effects can be both immediate and long-term. Here are some of the key effects of fire events in California:
Smoke and Air Pollution, Wildfire smoke can lead to poor air quality, causing respiratory problems and exacerbating existing health conditions. It can also affect visibility and lead to transportation disruptions.
Health Impacts, People, especially those with respiratory issues, may experience health problems due to exposure to smoke and air pollutants.
According to our analysis, Plumas, Humboldt, Mendocino, Butte and Shasta counties have the most effects from fires since these areas usually have fire occurrences repeatedly.
![mapfre](https://github.com/YanikaD/FlameGuardDispatch/assets/119694198/f10a6f5d-4f8c-410c-8e54-18cfeca03551)
![maphp](https://github.com/YanikaD/FlameGuardDispatch/assets/119694198/ec126174-e9c5-4502-96eb-76ccf7a46649)
![Screenshot (1304)](https://github.com/YanikaD/FlameGuardDispatch/assets/119694198/b433a153-90de-4d3a-85b2-8ef16efe8f09)

### Step 4: Particulate analysis
In this part, provided a dashboard to present the chemical from the combustion in California. the component can be selected to filter the data. The data is represented in timeseries and spatial.
![Untitled design](https://github.com/YanikaD/FlameGuardDispatch/assets/42495494/617524f5-cf1c-4a5f-8f54-a2963d893c5b)

## Solution

### 1. During-Fire events

<b>Response</b>

Our innovation could help fire departments to manage faster routes from fire stations to fire events, and enable them to find the nearest hospitals for transferring victims. Moreover, our online responsive report form can gather real-time of fire events and firefighters can be able to reach there quickly.

### 2. Post-Fire events

<b>Response</b>

The effect and particular analysis parts of the platform can help the government, organization and normal people to manage the situation of fire. Moreover, they can see the effect of wildfire not only in agriculture and building but also their health because of the chemical particular from the burning.


## Limitations
1. There are many lines of GeoJson format so when we added it into our script, it takes times.
2. Many fire points from 2012-2023 so we needed to aggregate them all into 1 attribute in order to do a hotspot analysis of 11 years
3. The dataset of Chemical gass from open sources are available only daily so we have to visualize them daily instead of yearly(2012-2023).
4. The dataset of Chemical gass from open sourecs are stored by 1 year/chemical/county so it quiet hard to download a bunch of data then we selected onl year 2022.
5. We could only deploy our web application locally at the moment.
6. It took some time to do our data preparation since we have data formats shapefile, csv and geoJson.
7. There is a difficulty of setting geoJson marker styles.
8. The version of Leaflet that can support routing function are quiet old. So, we have to use plain JavaScript.



## References
1. United Nations Climate Change: https://di.unfccc.int/time_series
2. NASA Air Quality Observations from Space: https://airquality.gsfc.nasa.gov
3. https://www.100forms.com/ready-forms/report-an-issue-form/
4. https://www.liedman.net/leaflet-routing-machine/
5. Chemical data in CA: https://www.arb.ca.gov/aqmis2/aqdselect.php?tab=daily





