// Dotenv configuration
import dotenv from 'dotenv'

// Express, used to create the server that the API runs on
import express from 'express'

// Imports body-parser to parse request bodies
import bodyParser from 'body-parser'

// Imports the router from the routes file, holds all the routes for the API
import router from './routes'

// Configures CORS rules
import cors from 'cors'

// Configures the environment variables
dotenv.config()

// Creates the express app
const app = express()

// Configures the CORS rules for the application
app.use(cors({
    // origin: 'http://localhost:3000',
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Configures the port for the server, uses environment variable if defined, otherwise defaults to 8080
const port = process.env.PORT || 8080

// Configures the body-parser middleware to parse JSON request bodies
app.use(bodyParser.json())
app.use('/api', router)

// Catch-all route to handle undefined paths
app.use((_: Request, res: any) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found on this server. Please refer to the API documentation for more information.'
    })
})

// Starts the server on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
