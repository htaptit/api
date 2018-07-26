var fs = require('fs');
var express = require('express');
var bodyparser = require('body-parser');
var Web3 = require('web3');
var solc = require('solc');
var util = require('util');
var mysql = require('mysql');
var Promise = require('bluebird');

let vin = '1234567890';
let cost = 1000000000000000000;
let gas = 1000000;
let abi = undefined;
let bin = undefined;
let web3 = undefined;

/*
 * This function prepares the server by compiling the Vehicle2 solidity contract
 * source code using the solc npm module. On successful compile, extracts the
 * ABI definition and the bytecode. In addition, initializes a web3 connection
 * to the private ethereum network.
 */
function setUp() {
    let source = fs.readFileSync('../src/Vehicle2.sol', 'UTF-8');
    let compiled = solc.compile(source);

    bin = compiled.contracts[':Vehicle2'].bytecode;

    util.log(`>>>>> setup - Bytecode: ${bin}`);
    util.log(`>>>>> setup - ABI: ${compiled.contracts[':Vehicle2'].interface}`);
    
    abi = JSON.parse(compiled.contracts[':Vehicle2'].interface);

    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8081'));

    util.log('>>>>> setup - Completed !!!')
}

/*
 * This function handles the ajax call to the url '/init'. It uses the web3
 * connection to fetch all the 4 accounts in our private ethereum network
 * and selects the buyer (2nd) and dealer (3rd) account addresses. Next,
 * makes a call to fetch the balances for the buyer and dealer accounts.
 * 
 * Returns the results in the json format:
 * 
 * {
 *     vin: <vin number>,
 *     cost: <vehicle cost>,
 *     buyer: <buyer account address>
 *     dealer: <dealer account address>
 *     buyer_balance: <buyer account balance in ethers>,
 *     dealer_balance: <dealer account balance in ethers>
 * }
 */
function initApi(response) {
    let data = {
        vin: vin,
        cost: 1,
        buyer: undefined,
        dealer: undefined,
        buyer_balance: undefined,
        dealer_balance: undefined
    };

    web3.eth.getAccounts()
    .then(accounts => {
        util.log(`>>>>> initApi - Accounts: ${accounts}`);

        data.buyer = accounts[1];
        data.dealer = accounts[2];

        util.log(`>>>>> initApi - Buyer address: ${data.buyer}`);

        return web3.eth.getBalance(data.buyer);
    })
    .then(balance1 => {
        util.log(`>>>>> initApi - Buyer balance: ${web3.utils.fromWei(balance1, 'ether')}`);

        data.buyer_balance = balance1;

        return web3.eth.getBalance(data.dealer);
    })
    .then(balance2 => {
        util.log(`>>>>> initApi - Dealer balance: ${web3.utils.fromWei(balance2, 'ether')}`);

        data.dealer_balance = balance2;

        response.json(data);
    });
}

/*
 * This function handles the ajax call to the url '/contract'. Since the dealer
 * is responsible for deploying the contract, uses the web3 connection to unlock
 * the dealer account and then deploys the contract code to the private Ethereum
 * network. Once the contract is mined and deployed, extracts the deployed contract
 * address.
 * 
 * Returns the results in the json format:
 * 
 * {
 *     vin: <vin number>,
 *     cost: <vehicle cost>,
 *     buyer: <buyer account address>
 *     dealer: <dealer account address>
 *     contract_address: <address of the deployed contract>
 * }
 */
function contractApi(request, response) {
    let contract = new web3.eth.Contract(abi);

    let data = {
        vin: request.body.vin,
        cost: request.body.cost,
        buyer: request.body.buyer,
        dealer: request.body.dealer,
        contract_address: undefined
    };

    util.log(`>>>>> contractApi - Unlocking ${request.body.dealer} account`);

    web3.eth.personal.unlockAccount(request.body.dealer, 'dealer')
    .then(result => {
        util.log(`>>>>> contractApi - Is dealer account unlocked ? ${result}`);
        util.log('>>>>> contractApi - Ready to deploy Vehicle2 contract');

        contract.deploy({
            data: '0x'+bin,
            arguments: [request.body.vin, cost, request.body.buyer]
        })
        .send({
            from: request.body.dealer,
            gas: gas
        })
        .on('receipt', receipt => {
            util.log(`>>>>> contractApi - Contract sucessfully deployed @ address: ${receipt.contractAddress}`);

            data.contract_address = receipt.contractAddress;

            response.json(data);
        });
    }, error => {
        util.log(`***** contractApi - Dealer account unlock error - ${error}`);
    });
}

/*
 * This function handles the ajax call to the url '/payment'. Since the buyer is
 * the entity invoking the contract, uses the web3 connection to unlock the buyer
 * account and then invoke the buyVehicle method on the depoloyed contract. Once
 * the contract method is mined and executed, extracts the balances for the buyer
 * and dealer accounts as well as the emitted events.
 * 
 * Returns the results in the json format:
 * 
 * {
 *     events: <array of emitted events>,
 *     buyer_balance: <buyer account balance in ethers>,
 *     dealer_balance: <dealer account balance in ethers>
 * }
 */
function paymentApi(request, response) {
    let contract = new web3.eth.Contract(abi);

    util.log(`>>>>> paymentApi - Contract address: ${request.body.contract_address}`);

    contract.options.address = request.body.contract_address;    

    util.log(`>>>>> paymentApi - Unlocking ${request.body.buyer} account`);

    web3.eth.personal.unlockAccount(request.body.buyer, 'buyer')
    .then(result => {
        util.log(`>>>>> paymentApi - Is buyer account unlocked ? ${result}`);
        util.log('>>>>> paymentApi - Ready to invoke buyVehicle() method');

        contract.methods.buyVehicle()
        .send({
            from: request.body.buyer,
            value: cost,
            gas: gas
        })
        .on('receipt', receipt => {
            util.log(`>>>>> paymentApi - Contract method buyVehicle() successfully invoked: ${receipt}`);
    
            let data = { 
                events: [], 
                buyer_balance: 0, 
                dealer_balance: 0 
            };

            contract.getPastEvents('Bought', {
                fromBlock: 0,
                toBlock: 'latest'
            })
            .then(events => {
                events.forEach(event => {
                    data.events.push(event.returnValues);
                });
                
                util.log(`>>>>> paymentApi - List of events - ${JSON.stringify(data.events)}`);
    
                return web3.eth.getBalance(request.body.buyer);
            })
            .then(balance1 => {
                util.log(`>>>>> paymentApi - Buyer balance: ${web3.utils.fromWei(balance1, 'ether')}`);
    
                data.buyer_balance = web3.utils.fromWei(balance1, 'ether');
    
                return web3.eth.getBalance(request.body.dealer);
            })
            .then(balance2 => {
                util.log(`>>>>> paymentApi - Dealer balance: ${web3.utils.fromWei(balance2, 'ether')}`);

                data.dealer_balance = web3.utils.fromWei(balance2, 'ether');

                response.json(data);
            })
        })
    }, error => {
        util.log(`***** paymentApi - Buyer unlock error - ${error}`);
    });
}

/*
 * ----- Start of The main server code -----
 */

setUp();

var app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.use(function(req, res, next) {
    util.log(`Request => url: ${req.url}, method: ${req.method}`);
    next();
});

app.use(express.static('./static'));

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "playingtime"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("DB is connected!!!")
});

app.get('/init', function(req, res) {
    initApi(res);
});

app.post('/contract', function(req, res) {
    contractApi(req, res);
});

app.post('/payment', function(req, res) {
    paymentApi(req, res);
});

function saveTransactionToDatabase(transactionHash, from, value, to) {
    // get account by from address (from)
    con.query("SELECT * FROM users WHERE address = ? LIMIT 1", [from], function (err, result) {
            if (err) throw err;
            
            var moment = require('moment');
            var localTime  = moment.utc(moment.utc().format('YYYY-MM-DD HH:mm:ss')).toDate();
            localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

            var _result = result;

            // get account by from address (to)
            con.query("SELECT * FROM users WHERE address = ? LIMIT 1", [to], function (err, result) {
                var values = {
                    name: _result[0].name,
                    email: _result[0].email,
                    type: _result[0].type,
                    created_at: localTime,
                    transaction_hash: transactionHash,
                    value: value,
                    to_address: result[0].name
                 }
                // save to database
                con.query("INSERT INTO transaction SET ?", values, function (err, result) {
                    if (err) throw err;
                    console.log(result)
                });
            });
    });
};

app.post('/sendTransaction', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }
    const from = req.query.from;
    const to = req.query.to;
    const password = req.query.password;
    const value = web3.utils.toWei(req.query.value.replace(',', '.'), 'ether');

    util.log(`>>>>> contractApi - Unlocking ${req.query.from} account`);

    web3.eth.personal.unlockAccount(from, password)
    .then(result => {
        util.log(`>>>>> contractApi - Is dealer account unlocked ? ${result}`);

        web3.eth.sendTransaction({from, to, value})
        .then(result => {
            saveTransactionToDatabase(result.transactionHash, from, value, to);

            res.send({unlock: true, infoTransaction: result});
        });

    })
    .catch(error => {
            res.send({ unlock: false, infoTransaction: null });
            return;
    });
});

app.get('/transactionHistory', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }
    const email = req.query.email;
    const type = parseInt(req.query.type);

    con.query("SELECT * FROM transaction WHERE email = ? AND type = ?", [email, type], function (err, result) {
        res.send({history: result});
    });
});


app.get('/getEmailByName', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }
    const name = req.query.name;

    con.query("SELECT * FROM users WHERE email = ? LIMIT 1", [name], function (err, result) {
        res.send({email: result[0].email, type: result[0].type});
    });
});

app.get('/getEmailByAddress', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }
    const address = req.query.address;

    con.query("SELECT * FROM users WHERE address = ? LIMIT 1", [address], function (err, result) {
        res.send({email: result[0].email, type: result[0].type, name: result[0].name});
    });
});

app.get('/getNameByAddress', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }
    const address = req.query.address;

    con.query("SELECT * FROM users WHERE address = ? LIMIT 1", [address], function (err, result) {
        res.send({name: result[0].name});
    });
});

app.get('/getContacts', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }
    const email = req.query.email;
    const type = parseInt(req.query.type);

console.log(req.query)

    con.query("SELECT * FROM contact WHERE email = ? AND type = ?", [email, type], function (err, result) {
        console.log(result);
        res.send({constacts: result});
    });
});

app.post('/newContacts', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }
    const email = req.query.email;
    const type = parseInt(req.query.type);
    const address = req.query.address;
    
    var values = {
        address: address,
        email: email,
        type: type
     }

    // save to database
    con.query("INSERT INTO contact SET ?", values, function (err, result) {
        if (err) throw err;
        res.send({saved: true});
    });
});

app.get('/getTransaction', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }
    const hash = req.query.hash;

    web3.eth.getTransaction(hash)
    .then(result => {
        res.send({transaction: result});
    })
    .catch(error => {
        res.send({transaction: null});
    })
});


app.get('/getTransactionCount', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }

    const address = req.query.address;

    web3.eth.getTransactionCount(address)
    .then(result => {
        res.send({transactionCount: result});
    });
});

app.get('/getBalance', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }

    const address = req.query.address;

    web3.eth.getBalance(address)
    .then(result => {
        res.send({balance: web3.utils.fromWei(result, 'ether')});
    });
});

app.get('/checkIsAddress', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }

    const address = req.query.address;

    const result = web3.utils.isAddress(address)
    res.send({isAddress: result});
});

app.post('/unlockAccount', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }

    const address = req.query.address;
    const password = req.query.password;
    web3.eth.personal.unlockAccount(address, password)
    .then(result => {
        util.log(`>>>>> contractApi - Is ${address} account unlocked ? ${result}`);
        res.send({unlock: result});
    })
    .catch(error => {
        res.send({unlock: false});
        return;
    });
});

app.post('/newAccount', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }

    var moment = require('moment');
    var localTime  = moment.utc(moment.utc().format('YYYY-MM-DD HH:mm:ss')).toDate();
    localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

    const name = req.query.name;
    const email = req.query.email;
    const password = req.query.password;
    const type = parseInt(req.query.type);
    const created_at = localTime;

    web3.eth.personal.newAccount(password)
    .then(result => {
        var values = {
            name: name,
            email: email,
            type: type,
            datetime: created_at,
            address: result
        }
        var rs = result;
        con.query("INSERT INTO users SET ?", values, function (err, result) {
            if (err) throw err;
            res.send( {account: rs} );
        });
    });
});

app.get('/accounts', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }
    var totalBalance = 0;
    var email = req.query.email;
    var type = parseInt(req.query.type);

    con.query("SELECT * FROM users WHERE email = ? AND type = ?", [email, type], function (err, result) {
        res.send({accounts: result});
    });
});

app.get('/totalAccount', function(req, res) {
    if (isEmpty(req.query)) {
        res.send({error: "Not found !", message: "Vui long them tham so !"});
        return;
    }

    var email = req.query.email;
    var type = parseInt(req.query.type);

    con.query("SELECT COUNT(*) AS total FROM users WHERE email = ? AND type = ?", [email, type], function (err, result) {
            if (err) {
                res.send({error: "Query !", message: err.stack});
                return;
            }

            res.send(result);
    });
});

app.listen(9001);

util.log('-> Express server @localhost:9001');
