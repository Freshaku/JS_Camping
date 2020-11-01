"use strict";

function findMaxArrSum(arr){
    let maxSum = 0;
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
      if (maxSum < sum){
        maxSum = sum;
        } else if (sum < 0){
            sum = 0;
        }
    }
    return maxSum;
}

console.log(findMaxArrSum([-2,1,-3,4,-1,2,1,-5,4]));