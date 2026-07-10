import Fastify from "fastify";
import cors from "cors";
import dotenv from "dotenv";
import elasticsearch from "./src/configs/elasticsearch.js";
import searchRoute from "./src/routes/search.route.js";
import fastifySwagger from "@fastify/swagger";
import { swagger, swaggerUI } from "./src/configs/swagger.js";
import fastifySwaggerUi from "@fastify/swagger-ui";

dotenv.config();

const app = Fastify({
  logger: true,
});

await app.register(cors, {
  origin: '*',
  methods: ['GET'],
});

app.register(fastifySwagger, swagger)
app.register(fastifySwaggerUi, swaggerUI)

app.register(elasticsearch);
app.register(searchRoute);

await app.listen({ port: 7000 }, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})