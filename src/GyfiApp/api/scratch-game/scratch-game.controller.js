/**
 * Created by smartit-11 on 28.07.17.
 */
import getHandler from './scratch-game.handler';

export default (ctx) => {
  const handler = getHandler(ctx);

  const { _checkNotFound, checkNotFound, isAuth } = ctx.helpers;
  const { ScratchGamePrize, Values } = ctx.models;
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
    const prizes = await ScratchGamePrize.findAll({})
    return prizes;
  };

  controller.getRandomPrize = async (req) => {
    isAuth(req);
    const prizes = await ScratchGamePrize.findAll({})
    const prize = handler.getRandomPrize(prizes);
    return prize;
  };

  return controller;
}
