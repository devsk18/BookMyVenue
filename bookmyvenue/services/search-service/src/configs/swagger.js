export const swagger = {
  openapi: {
    info: {
      title: 'BMV Search API',
      description: 'This is the Search API for BookMyVenue, which allows users to search for venues based on various criteria such as location, price, capacity, and more. The API provides endpoints to perform full-text searches, apply filters, and retrieve relevant venue information.',
      version: '1.0.0'
    },
    servers: [{ url: 'http://localhost:3000' }]
  }
}

export const swaggerUI = {
  routePrefix: '/docs', // Access the UI via http://localhost:3000/docs
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  }
}