const jwt = require('jsonwebtoken');
import _ from 'lodash';
import getHandler from './scratch-game.handler';

export default (ctx) => {
  const handler = getHandler(ctx);

  const { _checkNotFound, checkNotFound, isAuth } = ctx.helpers;
  const { ScratchGamePrize, ScratchGameHistory, Values, User } = ctx.models;
  const { e400 } = ctx.errors;

  const controller = {};

  controller.create = async (req) => {
    isAuth(req)
    const params = req.allParams()
    const prize = await ScratchGamePrize.create(params)
    return prize;
  };

  controller.getPrizes = async (req) => {
    isAuth(req);
    const prizes = await ScratchGamePrize.findAll({});
    return prizes;
  };

  controller.getRandomPrizes = async (req) => {
    isAuth(req);

    const token = req.headers['x-access-token'];
    const userObj = jwt.verify(token, ctx.config.jwt.secret);


    /**
     * get option for game
     */
    const options = await Values.findAll({
      where: {
        name: ['scratch_increase_percent', 'scratch_count_win', 'scratch_loss_price', 'scratch-cost-game'],
      },
    });
    const costGame = _.find(options, option => option.name === 'scratch-cost-game').value;

    /**
     * get gyfi User
     */
    const gyfiUser = await User.findById(userObj.id, {attributes: ['id', 'gyfi']});
    if (gyfiUser.gyfi < parseInt(costGame)) {
      throw e400('У вас недостаточно валюты')
    }

    /**
     * get count of games on current day
     */
    const getCountGameUser = await ScratchGameHistory.count({
      where: {
        userId: userObj.id,
        dateGame: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        },
      },
    });

    /**
     * get All prizes
     */
    const allPrizes = await ScratchGamePrize.findAll({});

    const result = await handler.getRandomPrize(allPrizes, getCountGameUser, options);

    /**
     * write game in history
     */
    if (result.idPrize) {
      await ScratchGameHistory.create({
          userId: userObj.id,
          prizeId: result.idPrize,
          percentWin: result.userPersent,
          dateGame: new Date(),
        })

      gyfiUser.gyfi -= costGame;
      await gyfiUser.save()
    }
    return result.prizes;
  };

  return controller;
}
