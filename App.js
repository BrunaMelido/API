const express = require('express');
const app = express();
const amqp = require('amqplib');
const { json } = require('body-parser');
require('dotenv').config();
const MONGODB_URI="mongodb+srv://ApiRabbitMQ:MBnlrel4PaC4eiYi@cluster0.onmqki7.mongodb.net/?retryWrites=true&w=majority"
const { MongoClient } = require('mongodb');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Obtendo a URL do RabbitMQ das variáveis de ambiente
const RABBITMQ_URL = process.env.RABBITMQ_URL;

// Função para armazenar a mensagem no MongoDB
async function storeMessageInMongoDB(data) {
  try {
    const client = await MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true });
    const db = client.db();
    const collection = db.collection('messages');

    // Inserir o objeto de dados no banco de dados
    await collection.insertOne(data);

    console.log('Mensagem armazenada no MongoDB.');
    await client.close();
  } catch (error) {
    console.error('Erro ao armazenar mensagem no MongoDB:', error);
  }
}

// Definir a função sendToQueue
async function sendToQueue(data) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queueName = 'queue_name';
    const message = JSON.stringify(data);

    await channel.assertQueue(queueName);
    await channel.sendToQueue(queueName, Buffer.from(message));
    console.log('Mensagem enviada para a fila do RabbitMQ.');
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Erro ao enviar mensagem para o RabbitMQ:', error);
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/FrontValidacao/Front.html");
});

app.post('/', async (req, res) => {
  const cartao = {
    "agencia": req.body.agencia,
    "conta": req.body.conta,
    "cpf": req.body.cpf,
    "dataDeNascimento": req.body.dataDeNascimento,
    "nomeCompleto": req.body.nomeCompleto,
    "nomeCartao": nomeCartao(req.body.nomeCompleto),
    "bandeiraDoCartao": req.body.bandeiraDoCartao,
    "tipoDoCartao": req.body.tipoDoCartao,
    "dataDeVencimento": req.body.dataDeVencimento
  };
  console.log(cartao);
  res.send("Formulário enviado com sucesso!");

  // Enviar o objeto cartao para a fila do RabbitMQ
  await sendToQueue(cartao);
  // Armazenar o objeto cartao no MongoDB
  await storeMessageInMongoDB(cartao);
});

function nomeCartao(nomeCompleto) {
  const partesNome = nomeCompleto.trim().split(' ');
  const primeiroNome = partesNome[0];
  const ultimoSobrenome = partesNome[partesNome.length - 1];
  let abreviacoesNomesMeio = '';
  if (partesNome.length > 2) {
    for (let i = 1; i < partesNome.length - 1; i++) {
      const nomeMeio = partesNome[i];
      abreviacoesNomesMeio += nomeMeio.charAt(0).toUpperCase() + ' ';
    }
  }
  // Retorna o nome do cartão formatado
  return `${primeiroNome} ${abreviacoesNomesMeio}${ultimoSobrenome}`;
}

app.listen(process.env.PORT, async () => {
  console.log('Servidor ativo: http://localhost:' + process.env.PORT);
});