# Currency Conversion API

## Introduction
This project is a task is to create a REST API backend (Node JS Typescript) and frontend (VUE JS Typescript) that processes the following inputs :
- A source currency
- A target currency
- A monetary value

The API leverages the exchange rates provided at [swop.cx](https://swop.cx/) and return a converted value. For instance, if the input is 30, USD, and GBP, the API will return the calculated result.

## Cloning the Repository
- git clone https://github.com/majroit/nosto.git


## Running the Application

### Running with Docker(Redis, InfluxDB, Grafana, Backend, Frontend)
- cd nosto 
  - docker-compose up -d

### or manually :

### Backend(Node JS Typscript)
- cd backend (from nosto folder)
 - npm install 
 - npm run dev
   - Default port is 3000 , if the port is busy or you got port in use error you can change port in backend/.env file.
   - The backend address will be http://localhost:3000

### Frontend(VUE JS Typescript)
- cd frontend (from nosto folder)
  - npm install 
  - npm run dev
    - Default port is 4000 , if the port is busy or you got port in use error you can change port in frontend/.env file.
    - If you change default port for backend make sure to change API URL in frontend/.env file: VITE_API_URL
    - The frontend address will be http://localhost:4000

## Other Considerations:

### Postman collection
- Postman collection for convert API included in the project. You can download, import in Postman and use it.

#### InfluxDB Config
- URL: http://localhost:8086
- Username: admin
- Password: adminadmin
- Initial Organization Name: majid
- Initial Bucket Name: nosto
When the configuration setting finished check your config with .env in backend folder to be same. and set the token.

#### Grafana Config
- Grafana URL: http://localhost:3001
- Grafana USER: admin
- Grafana PASSWORD: admin
- ADD new data source: InfluxDB 
  - Query Language: FLUX  
  - Url: http://influxdb:8086
  - Token: as you got from InfluxDB config
  - Organization: as you got from InfluxDB config
  - Default Bucket: as you got from InfluxDB config
