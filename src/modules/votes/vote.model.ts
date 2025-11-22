import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface VoteAttributes {
  id: number;
  name: string;
  email: string;
  country: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface VoteCreationAttributes extends Optional<VoteAttributes, 'id'> {}

class Vote extends Model<VoteAttributes, VoteCreationAttributes> implements VoteAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public country!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 3]
      }
    }
  },
  {
    sequelize,
    tableName: 'votes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['country']
      }
    ]
  }
);

export { Vote, VoteAttributes, VoteCreationAttributes };
