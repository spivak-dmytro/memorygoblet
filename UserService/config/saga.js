const sagaConfig = [
  'amqp://localhost',
  process.env.SAGA_QUEUE_NAME,
  {
    connectionOptions: {
      heartbeat: 60,
    },
    pingPongLimit: 10,
    responseTimeout: 1000,
  },
];

export default sagaConfig;
