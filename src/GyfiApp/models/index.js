import setAssociations from './associations'
export default function () {
  const models = {
    Action: require('./Action').default(...arguments),
    User: require('./User').default(...arguments),
    Product: require('./Product').default(...arguments),
    Wall: require('./Wall').default(...arguments),
    Ticket: require('./Ticket').default(...arguments),
    Post: require('./Post').default(...arguments),
    Category: require('./Category').default(...arguments),
    UserLike: require('./UserLike').default(...arguments),
    SocialNetwork: require('./SocialNetwork').default(...arguments),
    Device: require('./Device').default(...arguments),
    Message: require('./Message').default(...arguments),
    Values: require('./Values').default(...arguments),
    ScratchGamePrize: require('./ScratchGamePrize').default(...arguments),
    ScratchGameHistory: require('./ScratchGameHistory').default(...arguments),
    FreeGyfi: require('./FreeGyfi').default(...arguments),
    Support: require('./Support').default(...arguments),
  };
  return setAssociations(models)
}
