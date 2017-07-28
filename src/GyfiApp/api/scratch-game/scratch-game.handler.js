import _ from 'lodash';

export default (ctx) => {

  const handler = {};

  handler.getRandomPrize = (array) => {
    let prizes = [];
    _.find(array, (item, index) => {
      prizes.push({
        index,
        weight: index === 0 ? item["weightVictory"] : array[index].weightVictory + prizes[index - 1].weight,
      })
    });

    prizes = prizes.sort(function(a, b) {
      return a.weight - b.weight;
    });
    const random = Math.random() * (0, _.last(prizes).weight + 1);
    return array[_.find(prizes, prize => prize.weight >= random).index]
  };


  return handler;
}





// var arr = [0.902, 0.22, 2.2, 0.88, 25, 0.12, 30.1]
//
// var res = [];
//
// arrNew = [];
// for(var i=0; i<arr.length; i++){
//   if(arrNew.length == 0){
//
//     arrNew.push({index: i, value: arr[0],  old:arr[i]})
//
//   } else {
//
//     arrNew.push({index: i, value: (arr[i] + arrNew[i-1].value), old:arr[i]})
//
//   }
// }
// arrNew.sort();
// var total = arr.reduce(function(a, b){
//   return a+b;
// });
//
// for(var j=0; j<10; j++){
//   var randomValue = Math.random() * (0, total + 1);
//   console.log('randomValue ', randomValue)
//
//   for(var i = 0; i< arrNew.length; i++){
//     if(arrNew[i].value >= randomValue){
//       res.push(arrNew[i].old);
//       break;
//     }
//   }
// }
//
//
// console.log('res 1', res)
