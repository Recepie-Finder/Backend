const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const server = ['./server.js']
 
swaggerAutogen(outputFile, server)