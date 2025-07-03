import amqp from "amqplib";

async function startConsumer(companyId: number) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchangeName = "company_topic_exchange";
  await channel.assertExchange(exchangeName, "topic", { durable: true });

  const queueName = `company_${companyId}_queue`;
  const routingKey = `company.${companyId}`;

  const q = await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(q.queue, exchangeName, routingKey);

  console.log(`🚀 Esperando mensagens para a company ${companyId}...`);

  channel.consume(q.queue, (msg) => {
    if (msg) {
      console.log(
        `[Company ${companyId}] Mensagem recebida: ${msg.content.toString()}`
      );
      channel.ack(msg);
    }
  });
}

// Inicia consumidores para company 1 e 2
startConsumer(1).catch(console.error);
startConsumer(2).catch(console.error);
