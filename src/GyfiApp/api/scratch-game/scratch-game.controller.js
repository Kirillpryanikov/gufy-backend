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

  controller.getHistoryGame = async (req) => {
    isAuth(req);
    const history = await ScratchGameHistory.findAll({});
    return history;
  };

  controller.updatePrize = async (req) => {
    const params = req.allParams();
    const { id } = params;
    await ScratchGamePrize.update(params, {
      where: {
        id,
      },
    });
    return ScratchGamePrize.findById(id)
  };

  controller.updateHistory = async (req) => {
    const params = req.allParams();
    const { id } = params
    await ScratchGameHistory.update(params, {
      where: {
        id,
      },
    });
    return ScratchGameHistory.findById(id)
  };

  controller.deletePrize = async (req) => {
    isAuth(req);
    const params = req.allParams();
    const { id } = params
    await ScratchGamePrize.destroy({
      where: {
        id,
      },
    })
  };

  controller.deleteHistory = async (req) => {
    isAuth(req);
    const params = req.allParams();
    const { id } = params
    await ScratchGameHistory.destroy({
      where: {
        id,
      },
    })
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
        name: ['scratch_increase_percent', 'scratch_count_win', 'scratch_loss_price', 'scratch-cost-game', 'scratch-free-game'],
      },
    });
    const costGame = _.find(options, option => option.name === 'scratch-cost-game').value;
    const countFreeGame = _.find(options, option => option.name === 'scratch-free-game').value;

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
     * get gyfi User
     */
    let gyfiUser;
    if (getCountGameUser >= countFreeGame) {
      gyfiUser = await User.findById(userObj.id, {attributes: ['id', 'gyfi']});
      if (gyfiUser.gyfi < parseInt(costGame)) {
        throw e400('У вас недостаточно валюты')
      }
    }

    /**
     * get All prizes
     */
    const allPrizes = await ScratchGamePrize.findAll({});

    const result = await handler.getRandomPrize(allPrizes, getCountGameUser, options);
    _.forEach(result.prizes, prize => {
        if (prize.id === result.idPrize) {
          if (prize.isGyfi && prize.prizeGyfi > 0){
            prize.isWinningPrize = true;
          } else if (!prize.isGyfi) {
            prize.isWinningPrize = true;
          }
        }
    });
    /**
     * write game in history
     */
    let idHistoryGame;
    if (result.idPrize) {
      idHistoryGame = await ScratchGameHistory.create({
          userId: userObj.id,
          prizeId: result.idPrize,
          percentWin: result.userPersent,
          dateGame: new Date(),
        })
    }
    /**
     *  If prize is not money, needed decrease count prizes
     */
    if (result.decrease.isDecrease) {
      let count = result.decrease.count;
      count--;

      await ScratchGamePrize.update({countPrize: count}, {
        where: {
          id: result.idPrize,
        },
      })
    }

    if (getCountGameUser >= countFreeGame) {
      gyfiUser.gyfi -= costGame;
      await gyfiUser.save()
    }
    return {
      idHistory: idHistoryGame.id,
      prizes: result.prizes,
    };
  };

  controller.handlerFinishGame = async (req) => {
    isAuth(req);

    const token = req.headers['x-access-token'];
    const userObj = jwt.verify(token, ctx.config.jwt.secret);

    const params = req.allParams();
    const { id } = params;
    const scratchGame = await ScratchGameHistory.find({
      where: {
        id: id,
        isFinish: false,
      },
    });

    if (!scratchGame) {
      throw e400('Приз за игру уже был получен')
    }

    const user = await User.find({
      where: {
        id: userObj.id,
      },
    });

    const prize = await ScratchGamePrize.find({
      where: {
        id: scratchGame.prizeId,
      },
    });

    if (prize.isGyfi && +prize.prizeGyfi > 0) {
      user.gyfi += +prize.prizeGyfi;
      scratchGame.isFinish = true;

      user.save();
      scratchGame.save();
    }
  };

  return controller;
}
