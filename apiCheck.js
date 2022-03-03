require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 8000

app.set('view engine', 'ejs')

app.get('/', async (req,res) => {
    const searchInput = "Fremont Bowl"
    const retrievedJSON = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInput}.json?types=address%2Cpoi&access_token=${process.env.MAPBOX_API_TOKEN}`)
    res.json(retrievedJSON.data)
})

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`)
})

<div><%= feature.text %> </div>
<div><%= `${feature.context[0].text}, ${feature.context[2].text}, ${feature.context[1].text}` %> </div>
<div>address: <%= feature.properties.address %> </div>