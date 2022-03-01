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
- Welcome Page
![Welcome Page](public/img/Welcome.png)
- User Page
![User Page](public/img/Profile.png)
- Restaurant/Categories List 
![List Page](public/img/List.png)
- Restaurant/Categories/Menu Item New
![New Entry Page](public/img/New.png)
- Restaurant Details Page
![Details Page](public/img/Details.png)
- Entry Edit Page
![Entry Edit Page](public/img/Edit.png)

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


### Link to Current Version

### Resources
- Stack Overflow: postgis psql extension for gemoetry data type