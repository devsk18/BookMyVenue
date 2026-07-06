import VenueSearchRepository from "../repositories/VenueSearchRepository.js";
import { searchVenueSchema } from "../schemas/search.schema.js";


export default async function (fastify) {

    fastify.get("/search/venues", { schema: searchVenueSchema }, async (req, reply) => {
        console.log(req.query);
        if (!req.query.q) {
            reply.code(400).send({
                count: 0,
                results: [],
                message: "Missing required query parameter."
            });
        }
        const repo = new VenueSearchRepository();
        reply.code(200).send(await repo.search(
            fastify.elastic,
            req.query
        ));
    });

};