import * as amqp from 'amqplib';

let connection: amqp.ChannelModel; // ✅ was amqp.Connection
let channel: amqp.Channel;

/**
 * Initialize RabbitMQ connection and publisher
 */
export async function initializePublisher(): Promise<void> {
  try {
    const url = process.env.RABBITMQ_URL;
    if (!url) throw new Error('RABBITMQ_URL is not defined'); // ✅ guard undefined

    connection = await amqp.connect(url); // ✅ typed string, not string | undefined
    channel = await connection.createChannel(); // ✅ createChannel exists on ChannelModel

    await channel.assertQueue('user.registered', { durable: true });

    console.log(
      '✓ RabbitMQ Publisher initialized - user.registered queue ready',
    );
  } catch (error) {
    console.error('❌ RabbitMQ Publisher initialization error:', error);
    throw error;
  }
}

/**
 * Publish user registered message to notification service
 */
export async function publishUserRegistered(userData: {
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
}): Promise<void> {
  try {
    if (!channel) {
      console.error('❌ RabbitMQ channel not initialized');
      return;
    }

    const message = {
      email: userData.email,
      firstName: userData.firstName || 'User',
      lastName: userData.lastName || '',
      createdAt: userData.createdAt,
    };

    channel.sendToQueue(
      'user.registered',
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      },
    );

    console.log('✓ Published to RabbitMQ - user.registered:');
    console.log('  - email:', message.email);
    console.log('  - firstName:', message.firstName);
    console.log('  - lastName:', message.lastName);
  } catch (error) {
    console.error('❌ Error publishing user registered message:', error);
  }
}
