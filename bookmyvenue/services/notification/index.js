import Fastify from "fastify";
import cors from "@fastify/cors";
import { Kafka } from "kafkajs";
import MailService from "./src/services/MailService.js";

const app = Fastify({
  logger: true,
});

await app.register(cors, {
  origin: '*'
});

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["localhost:9094"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "notification-service-group" });


const run = async () => {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: "notify", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        let status = false;

        // TODO: use a factory class for diff notifier types 
        // when multiple notification channel comes
        switch (data.type) {
          case "EMAIL":
            const mailer = new MailService(data);
            status = await mailer.send();

          default:
            app.log.info(`${data.type} not implemented`)
        }

        app.log.info("Notification sent");

        // for analytics
        await producer.send({
          topic: "analytics-service",
          messages: [
            { 
              value: JSON.stringify({ 
                type: data.type, 
                status 
              }) 
            },
          ],
        });

      } catch (err) {
        app.log.error(err);

        // for analytics
        await producer.send({
          topic: "analytics-service",
          messages: [
            { 
              value: JSON.stringify({ 
                type: data.type, 
                status: false 
              }) 
            },
          ],
        });
      }
    },
  });
};


await app.listen({ port: 3000 }, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})

await run();


// TODO: remove the try-catch to keep the msge in topic in case of error for retry
// TODO: and use a DLQ to keep the retiried msges (min-2 times)
// TODO: move kafka code to seperate file
