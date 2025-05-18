# PlanetPass

**PlanetPass** is a React-based web application that integrates data from various APIs, allowing users to explore countries worldwide. This app provides information about countries, including names, capitals, populations, languages, regions, and flags. Users can filter countries by region, search for specific countries, and view detailed information. Additionally, the app includes features like weather updates, the latest headlines, and an interactive country jigsaw puzzle game.

### Features
- **Country Search and Filter:** Search for countries by name and filter them by region and language.
- **Detailed Country Information:** View details about a country, including its name, capital, population, languages, region, and flag.
- **Weather Updates:** Check the current weather for a selected country or city.
- **News Headlines:** View the latest headlines for each country or region.
- **Interactive Jigsaw Puzzle Game:** Play a fun jigsaw puzzle game featuring country flags.

### Technologies Used
- **Frontend:** React (Functional Components)
- **CSS Framework:** Tailwind CSS
- **APIs:**
  - [REST Countries API](https://restcountries.com/)
  - [OpenWeatherMap API](https://openweathermap.org/) for weather data
  - [NewsAPI](https://newsapi.org/) for the latest news headlines
  - Country Flag Jigsaw Puzzle Game

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/planetpass.git
   cd planetpass


2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the project and add your API keys for the Weather and News APIs:

   ```plaintext
   REACT_APP_WEATHER_API_KEY=your_weather_api_key
   REACT_APP_NEWS_API_KEY=your_news_api_key
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

### API Integration

The application fetches data from several endpoints of the following APIs:

* **REST Countries API** (for country details):

  * **All Countries:** `https://restcountries.com/v3.1/all`
  * **Country by Name:** `https://restcountries.com/v3.1/name/{name}`
  * **Independent Countries:** `https://restcountries.com/v3.1/independent?status=true`
  * **Filter by Region:** `https://restcountries.com/v3.1/region/{region}`

* **OpenWeatherMap API** (for weather data):

  * **Weather by City:** `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={your_api_key}&units=metric`
  * **Weather by Country:** `https://api.openweathermap.org/data/2.5/weather?q={country}&appid={your_api_key}&units=metric`

* **NewsAPI** (for the latest headlines):

  * **Headlines by Country:** `https://newsapi.org/v2/top-headlines?country={country_code}&apiKey={your_api_key}`

* **Country Flag Jigsaw Puzzle Game:**

  * The game allows users to interactively complete a jigsaw puzzle using country flags. The pieces of the puzzle are generated dynamically based on the flag image.

### Weather Feature

* Users can check the current weather for a selected country or city by entering the location in the weather section of the app.
* The weather data includes:

  * Current temperature
  * Weather description (e.g., clear, cloudy)
  * Humidity and wind speed

### News Feature

* Display the latest headlines for each country or region.
* Users can choose a country, and the app will show top headlines related to that country from NewsAPI.

### Jigsaw Puzzle Game Feature

* Users can play a jigsaw puzzle game with images of country flags.
* The game randomly cuts the flag image into pieces and allows users to drag and drop pieces to complete the puzzle.

