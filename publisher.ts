import amqp from "amqplib";

async function publish() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchangeName = "company_topic_exchange";
  await channel.assertExchange(exchangeName, "topic", { durable: true });

  const messages = [
    { routingKey: "company.1", content: "Mensagem para a empresa 1" },
    { routingKey: "company.2", content: "Mensagem para a empresa 2" },
  ];

  for (const msg of messages) {
    channel.publish(exchangeName, msg.routingKey, Buffer.from(msg.content));
    console.log(
      `Mensagem enviada: "${msg.content}" com chave "${msg.routingKey}"`
    );
  }

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
}

publish().catch(console.error);
