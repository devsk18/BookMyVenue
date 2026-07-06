import fp from 'fastify-plugin'
import { Client } from '@elastic/elasticsearch'

export default fp(async function (fastify) {
    const client = new Client({
        node: process.env.ELASTIC_URL
    });

    fastify.decorate("elastic", client);
});