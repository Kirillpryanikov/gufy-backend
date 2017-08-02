import _ from 'lodash';

export default (ctx) => {

  const handler = {};

  handler.getRandomPrize = async (array, countGame, values) => {
    let userPersent = 0;

    /**
     * Increase the chance of losing
     */
    if (countGame >= _.find(values, value => value.name === 'scratch_count_win').value) {
      userPersent = _.find(values, value => value.name === 'scratch_increase_percent').value;

      _.find(array, item => {
        if (item.name === _.find(values, value => value.name === 'scratch_loss_price').value) {
          let proc = parseInt(userPersent) / 100;
          item.weightVictory = (item.weightVictory * proc) + item.weightVictory;
        }
      });
    }

    let prizes = [];
    _.find(array, (item, index) => {
      if (item.isAvaible && (!item.isGyfi && item.countPrize > 0 || item.isGyfi)) {
        prizes.push({
          index,
          weight: prizes.length === 0 ? item["weightVictory"] : array[index].weightVictory + prizes[prizes.length - 1].weight,
          isGyfi: item.isGyfi,
        })
      }
    });

    prizes = prizes.sort(function(a, b) {
      return a.weight - b.weight;
    });
    const totalWeight = _.last(prizes).weight;
    const random = Math.random() * (0, totalWeight);
    /**
     * Random selection prize
     */
    let winPrize = array[_.find(prizes, prize => prize.weight >= random).index];
    console.log('winPrize  *****************  ', winPrize);
    return generatePrizes(array, winPrize.id, userPersent);
  };

  function generatePrizes(array, prizeId, userPersent) {
    let res = [];
    const winPrize = _.remove(array, item => item.id === prizeId)[0];
    res.push(winPrize[0]);

    array = _.shuffle(array);
    _.find(array, (item, i) => {
      if (i < 4) {
        res.push(array.pop());
      }
    });
    res = _.flatMap(res, dublicate);

    /**
     * Winning prizes should be 3
     */
    res.push(winPrize);

    /**
     * add #12 prize
     */
    if (array.length > 0) {
      res.push(array.pop());
    }

    return {
        prizes: _.shuffle(res),
        idPrize: prizeId,
        userPersent: 100 - userPersent,
        decrease: { isDecrease: !winPrize.isGyfi, count: winPrize.countPrize},
    }
  }

  function dublicate(n) {
    return [n, n]
  }

  return handler;
}
