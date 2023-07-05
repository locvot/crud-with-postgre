import { Sequelize, DataTypes, Model } from "sequelize";
import configure from "../config/db.js";

const sequelize = new Sequelize(
    configure.db, 
    configure.user, 
    configure.password, 
    {
        host: configure.host,
        dialect: configure.dialect,

        pool: {
            max: configure.pool.max,
            min: configure.pool.min,
            acquire: configure.pool.acquire,
            idle: configure.pool.idle
        }
    }
);

class User extends Model{}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
    },
    email_verify_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    forgot_password_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

class RefreshToken extends Model{}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    token:{
      type: DataTypes.STRING,
    },
    user_id:{
      type: DataTypes.UUID,
    }
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
  }
);

class DatabaseService {
    constructor() {
      this.sequelize = sequelize;
      this.models = {};
  
      // Import your Sequelize models here
      this.models = { User, RefreshToken };
  
      // Initialize associations and perform any additional model configurations
  
      // Sync the models with the database
      this.sequelize.sync();
    }
  
    async connect() {
      try {
        await this.sequelize.authenticate();
        console.log('Connected to PSQL!');
      } catch (err) {
        console.log('Error:', err);
        throw err;
      }
    }
  
    // Define your Sequelize model getters here
    get users() {
      return this.models.User;
    }
  
    get refreshTokens() {
      return this.models.RefreshToken;
    }
  }

const databaseService = new DatabaseService();
export default databaseService;
