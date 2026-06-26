import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: ["localhost:9094"],
});

const admin = kafka.admin();

async function run() {
  await admin.connect();

  const created = await admin.createTopics({
    topics: [
      {
        topic: "notify",
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
  });

  console.log({ created });

  await admin.disconnect();
}

run().catch(console.error);