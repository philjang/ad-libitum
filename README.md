# ad Libitum

## Project Idea and Description
 - A fullstack application that allows users to save their favorite restaurants for future reference! Users can also save their favorite menu items and record notes on their experience.

## Installation Instructions

## Link to Current Version

[ad-Libitum on Heroku](https://ad-libitum-deploy.herokuapp.com)

## Technologies Used

## Development Approach

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
[x] Welcome home page that renders login/signup
[x] User profile page that displays user's saved restaurants - ended up having a separate profile page and indices for each type of location
[x] User will be able to create custom categories to organize the list of restaurants (e.g. "Go-To", "Comfort", "Sushi All-stars", "Too Pricey for Tuesday")
[x] User will be able to access a details page for each restaurant, which will contain:
[x] A note made by user, which can be edited if needed
[x] A map of the immediate vicinity of the restaurant
[x] Favorite menu items from the restaurant

## Stretch Goals
[x] Responsive design for use on various screen sizes
[x] Other user lists (e.g. cafes, bars, dessert spots, etc.) - more to be added
[] User created groups to connect to other users (e.g. Family Favorites, Homie Favorites)
  - Add M:N linking groups (with attribute name) to users table and view that displays list of places that have been added by everyone in the group (later add a details page that links to recommended menu items)
[] Randomized restaurant/menu item picker
[] Display ETA/estimated distance/embedded navigation link (for mobile)
[] Ability to add user photos for restaurant or menu items (Not sure if possible with just postgres)

### Post-project Reflection
- Overall, I would say that I am proud of what I was able to put together in a week's time! There were definitely times during the build that left me frustrated or stumped, but they ended up becoming great teaching moments as they led me to rabbit-holes of thought experiments and provided an opportunity to learn some of the intricacies of the many technologies available. Really starting to love the open-source culture of software development. There were many stretch goals that I could not get to quite yet, but I believe the additions of these features over time will really flesh out this project. In terms of user interface, adding an edit page directly connected to the category list page will likely improve user experience and flow. The final proof-of-concept implementation of the Cafe and Cafe Categories models leave a lot to be desired in terms of concision for the time being, but I have some ideas on a cleaner solution.

### Resources
- Mapbox Geocoding API/Mapbox GL JS (https://docs.mapbox.com/)
- Stack Overflow: postgis psql extension for geometry data type
- (https://sequelize.org/v6/)
- (https://devcenter.heroku.com/categories/reference)
- (https://app.diagrams.net/)
- (https://fontawesome.com/icons)
- (https://icons8.com/)
- (https://startbootstrap.com/)
- (https://getbootstrap.com/)
- (https://unsplash.com/)
- (https://animate.style/)
