export default (models) => {
  // const { User, Post, Wall, Product, Action, Ticket, Device, Message } = models
  // USER
  // User.hasMany(Post, {
  //   foreignKey: 'userId',
  // })
  // User.hasMany(Product, {
  //   foreignKey: 'ownerId',
  // })
  // User.hasMany(Action, {
  //   foreignKey: 'ownerId',
  // })
  // User.hasMany(Ticket, {
  //   foreignKey: 'userId',
  // })
  // Action.hasMany(Ticket, {
  //   foreignKey: 'actionId',
  // })
  // User.hasMany(Device, {
  //   foreignKey: 'userId',
  // })
  // // Пример с сообщениями верный!
  // Message.belongsTo(User, {
  //   foreignKey: 'toUserId',
  //   as: 'toUser',
  // })
  // Message.belongsTo(User, {
  //   foreignKey: 'fromUserId',
  //   as: 'fromUser',
  // })
  // User.hasMany(Message, {
  //   foreignKey: 'fromUserId',
  // })
  // User.hasMany(Message, {
  //   foreignKey: 'toUserId',
  // })
  // // Конец примера
  // User.hasOne(Wall, {
  //   foreignKey: 'wallId',
  // })
  // Wall.hasMany(Post, {
  //   foreignKey: 'wallId',
  // })
  // Post.belongsTo(Wall, {
  //   foreignKey: 'wallId',
  // })
  // Message.create({
  //   fromUserId: 1,
  //   toUserId: 2,
  //   text: '123',
  // })
  // Пример с сообщениями

  return models
}
