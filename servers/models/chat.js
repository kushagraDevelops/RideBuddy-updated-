import db from '../db';

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ride_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'messages',
    timestamps: false
  });

  // Optional associations
  Chat.associate = (models) => {
    Chat.belongsTo(models.User, { foreignKey: 'sender_id', as: 'Sender' });
    Chat.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'Receiver' });
    Chat.belongsTo(models.Ride, { foreignKey: 'ride_id' });
  };

  return Chat;
};
