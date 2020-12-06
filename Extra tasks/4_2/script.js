function add(a, b){
    if(arguments.length === 1){
        return function(b){
            return (b + a);
        }
    }
    return (a + b);
}

function mul(a, b){
    if(arguments.length === 1){
        return function(b){
            return (b * a);
        }
    }
    return (a * b);
}

function sub(a, b){
    if(arguments.length === 1){
        return function(b){
            return (b - a);
        }
    }
    return (a - b);
}

function div(a, b){
    if(arguments.length === 1){
        return function(b){
            return (b / a);
        }
    }
    return (a / b);
}

function pipe(){
    let arr = arguments;
    let result;
    return function(a){
        for(let i = 0; i < arr.length; i++){
            result = arr[i](a);
        }
        return result;
    }
}


let a = add(1,2); // 3
let b = mul(a, 10); // 30
let sub1 = sub(1); // sub1 отнимает от любого числа единицу
let c = sub1(b); // 29
let d = mul(sub(a,1))(c); // 58
let doSmth = pipe(add(d), sub(c), mul(b), div(a)); // функция, последовательно выполняющая эти операции.
let result = doSmth(0); // (((0 + 58) - 29) * 30) / 3 = 290
let x = pipe(add(1), mul(2))(3); // 8
console.log(a);
console.log(b);
console.log(c);
console.log(d);
console.log(doSmth);
console.log(result);
console.log(x);

