# Pangs

## Project Idea and Description
 - A fullstack application that allows users to save their favorite restaurants for future reference! Users can also save their favorite menu items and record notes on their experience.

## API 
- Mapbox Geocoding API
- Request URL
	- https://api.mapbox.com/geocoding/v5/mapbox.places/fremont%20bowl.json?types=address%2Cpoi&access_token=YOUR_MAPBOX_ACCESS_TOKEN
- Response
```json
{
  "type": "FeatureCollection",
  "query": ["fremont", "bowl"],
  "features": [
    {
      "id": "poi.1279900271475",
      "type": "Feature",
      "place_type": ["poi"],
      "relevance": 1,
      "properties": {
        "foursquare": "5a1b300ec47cf927fe903663",
        "landmark": true,
        "address": "4258 Fremont Ave N",
        "category": "sushi restaurant, sushi, japanese restaurant, japanese food, restaurant"
      },
      "text": "Fremont Bowl",
      "place_name": "Fremont Bowl, 4258 Fremont Ave N, Seattle, Washington 98103, United States",
      "center": [-122.350019, 47.659101],
      "geometry": {"coordinates": [-122.350019, 47.659101], "type": "Point"},
      "context": [
        {"id": "neighborhood.8166201025628200", "text": "Fremont"},
        {"id": "postcode.9998848571717140", "text": "98103"},
        {
          "id": "place.6907264716229470",
          "wikidata": "Q5083",
          "text": "Seattle"
        },
        {
          "id": "district.9122689011421610",
          "wikidata": "Q108861",
          "text": "King County"
        },
        {
          "id": "region.9713796497246050",
          "short_code": "US-WA",
          "wikidata": "Q1223",
          "text": "Washington"
        },
        {
          "id": "country.19678805456372290",
          "wikidata": "Q30",
          "short_code": "us",
          "text": "United States"
        }
      ]
    },
    {
      "id": "poi.962072696597",
      "type": "Feature",
      "place_type": ["poi"],
      "relevance": 0.99,
      "properties": {
        "foursquare": "5650f73a498e402a2a072beb",
        "landmark": true,
        "address": "43986 Pacific Commons Blvd",
        "category": "juice bar, restaurant"
      },
      "text": "Bowl of Heaven",
      "place_name": "Bowl of Heaven, 43986 Pacific Commons Blvd, Fremont, California 94538, United States",
      "center": [-121.969145, 37.500919],
      "geometry": {"coordinates": [-121.969145, 37.500919], "type": "Point"},
      "context": [
        {"id": "neighborhood.10534580001004340", "text": "Baylands"},
        {"id": "postcode.13342989026196310", "text": "94538"},
        {
          "id": "place.8182364350628200",
          "wikidata": "Q49220",
          "text": "Fremont"
        },
        {
          "id": "district.11187960009291250",
          "wikidata": "Q107146",
          "text": "Alameda County"
        },
        {
          "id": "region.9803118085738010",
          "short_code": "US-CA",
          "wikidata": "Q99",
          "text": "California"
        },
        {
          "id": "country.19678805456372290",
          "wikidata": "Q30",
          "short_code": "us",
          "text": "United States"
        }
      ]
    },
    {
      "id": "poi.558345795475",
      "type": "Feature",
      "place_type": ["poi"],
      "relevance": 0.99,
      "properties": {
        "foursquare": "4b1ee95ef964a520752124e3",
        "landmark": true,
        "address": "40645 Fremont Blvd",
        "category": "bowling, bowl, bowling alley, leisure"
      },
      "text": "Cloverleaf Family Bowl",
      "place_name": "Cloverleaf Family Bowl, 40645 Fremont Blvd, Fremont, California 94538, United States",
      "center": [-121.965847, 37.535273],
      "geometry": {"coordinates": [-121.965847, 37.535273], "type": "Point"},
      "context": [
        {"id": "neighborhood.14924020012307340", "text": "Irvington"},
        {"id": "postcode.13342989026196310", "text": "94538"},
        {
          "id": "place.8182364350628200",
          "wikidata": "Q49220",
          "text": "Fremont"
        },
        {
          "id": "district.11187960009291250",
          "wikidata": "Q107146",
          "text": "Alameda County"
        },
        {
          "id": "region.9803118085738010",
          "short_code": "US-CA",
          "wikidata": "Q99",
          "text": "California"
        },
        {
          "id": "country.19678805456372290",
          "wikidata": "Q30",
          "short_code": "us",
          "text": "United States"
        }
      ]
    },
    {
      "id": "poi.309237748246",
      "type": "Feature",
      "place_type": ["poi"],
      "relevance": 0.99,
      "properties": {
        "foursquare": "4c12af3b127f9521488b2425",
        "landmark": true,
        "address": "816 Joe Clifton Dr",
        "category": "bowling, bowl, bowling alley, leisure"
      },
      "text": "Cardinal Lanes",
      "place_name": "Cardinal Lanes, 816 Joe Clifton Dr, Fremont, Kentucky 42001, United States",
      "center": [-88.636152, 37.082446],
      "geometry": {"coordinates": [-88.636152, 37.082446], "type": "Point"},
      "context": [
        {"id": "neighborhood.10234474623635510", "text": "Clayshire"},
        {"id": "postcode.5049848953797060", "text": "42001"},
        {"id": "place.10337820373628200", "text": "Fremont"},
        {
          "id": "district.12527870970659510",
          "wikidata": "Q506370",
          "text": "McCracken County"
        },
        {
          "id": "region.11038292189170890",
          "short_code": "US-KY",
          "wikidata": "Q1603",
          "text": "Kentucky"
        },
        {
          "id": "country.19678805456372290",
          "wikidata": "Q30",
          "short_code": "us",
          "text": "United States"
        }
      ]
    },
    {
      "id": "poi.1219770731751",
      "type": "Feature",
      "place_type": ["poi"],
      "relevance": 0.99,
      "properties": {
        "foursquare": "4d28b65c6e27a143910a1d24",
        "landmark": true,
        "address": "1205 E 23rd St",
        "category": "bowling, bowl, bowling alley, leisure"
      },
      "text": "30 Bowl",
      "place_name": "30 Bowl, 1205 E 23rd St, Fremont, Nebraska 68025, United States",
      "center": [-96.481126, 41.450999],
      "geometry": {"coordinates": [-96.481126, 41.450999], "type": "Point"},
      "context": [
        {"id": "postcode.4365803748932660", "text": "68025"},
        {
          "id": "place.5325640978628200",
          "wikidata": "Q653613",
          "text": "Fremont"
        },
        {
          "id": "district.3459535893257320",
          "wikidata": "Q490703",
          "text": "Dodge County"
        },
        {
          "id": "region.13305404449987740",
          "short_code": "US-NE",
          "wikidata": "Q1553",
          "text": "Nebraska"
        },
        {
          "id": "country.19678805456372290",
          "wikidata": "Q30",
          "short_code": "us",
          "text": "United States"
        }
      ]
    }
  ],
  "attribution": "NOTICE: © 2022 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained. POI(s) provided by Foursquare."
}
```

## ERD

![ERD of my project](./ERD.drawio.png)

## RESTful Routing Chart

| Method | Path | Purpose |
| ------ | -------------- | -------------------------------- |
| GET | `/restaurants` | Display a list of saved restaurants |
| GET | `/restaurants/new` | Display a form for adding a new restaurant |
| POST | `/restaurants` | Creates a new restaurant, then redirects back to `GET /restaurants` |
| GET | `/restaurants/:id` | Display details of a restaurant including note, map, and highlight menu items |
| GET | `/restaurants/:id/new` | Display a form for adding a new menu item |
| POST | `restaurants/:id` | Creates a new menu item, then redirects back to `GET /restaurants/:id` |
| GET | `/restaurants/edit/:id` | Display an editable form for the details of a restaurant |
| PUT | `/restaurants/:id` | Updates notes about a restaurant |
| DELETE | `/restaurants` | Deletes the specified restaurant |
| DELETE | `/restaurants/:id` | Deletes the specified highlight menu item |
| GET | `/categories/` | Display a list of categories |
| GET | `/categories/:name` | Display a list of restaurants in category |
| GET | `/categories/new` | Display a form for adding a new category |
| POST | `/categories` | Creates a new category, then redirects back to `GET /categories` |
| DELETE | `/categories` | Deletes the specified category |

## Wireframes

## User Stories
- As a user, I want to save restaurants to a list so that I have a reference if I want to visit again.
- As a user, I want to save menu items I've enjoyed in the past so I always know what to order when I'm not feeling adventurous.
- As a user, I want to leave notes about my favorite restaurants so I can remember why I enjoyed it so much.
- As a user, I want to see a map of exactly where the restaurant is so I can find it easily once I've parked. 
- As a user, I want to edit my notes about restaurants in case my opinion changes.
- As a user, I want to delete restaurants from my list if they are no longer good.
- As a user, I want to make custom categories to sort my favorite restaurants.

## MVP Goals
- Welcome home page that renders login/signup
- User profile page that displays user's saved restaurants
- User will be able to access a details page for each restaurant, which will contain:
	- A note made by user, which can be edited if needed
	- A map of the immediate vicinity of the restaurant
	- Favorite menu items from the restaurant
- User will be able to create custom categories to organize the list of restaurants
	- e.g. "Go-To", "Comfort", "Sushi All-stars", "Too Pricey for Tuesday"

## Stretch Goals
- User created groups to connect to other users (e.g. Family Favorites, Homie Favorites)
- Other user lists (e.g. cafes, bars, dessert spots, etc.)
- Randomized restaurant/menu item picker
- Responsive design for use on mobile
- Display ETA/estimated distance/embedded navigation link
- Ability to add user photos for restaurant or menu items