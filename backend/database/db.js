import mongoose from 'mongoose';

const Connection = async (username, password) => {
  const URL = `mongodb://${username}:${password}@crud-app-shard-00-00.fyf2n.mongodb.net:27017,crud-app-shard-00-01.fyf2n.mongodb.net:27017,crud-app-shard-00-02.fyf2n.mongodb.net:27017/CRUD-APPLICATION?ssl=true&replicaSet=atlas-rz0rvg-shard-0&authSource=admin&retryWrites=true&w=majority`;

  try {
    await mongoose.connect(URL);
    console.log('Database Connected Successfully');
  } catch (error) {
    console.log('Error: ', error.message);
  }
};

export default Connection;
