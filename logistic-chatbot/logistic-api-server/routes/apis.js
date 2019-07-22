var express = require('express');
var router = express.Router();
const ActionHandler = require('../routes/lib/base/ActionHandler');
const SearchActionHandler = require('../routes/lib/base/SearchActionHandler');
const Const = require('./lib/util/const');

/* query faq */
router.post('/request/faq', function(req, res) {
    processPostRequest('action-faq-service', req, res);
    //res.json('respond with a resource');
});
router.get('/request/faq/:query', function(req, res) {
    processGetRequest('action-faq-service', req, res);
    // res.json('respond with a resource');
});
/* 보상처리절차 */
router.get('/request/compensation', function(req, res) {

    processGetRequest(Const.FAQ_COMPENSATION_PROCESS, req, res);
    //res.json('respond with a resource');
});
/* 고개센터 안내 */
router.get('/request/customer', function(req, res) {

    processGetRequest(Const.FAQ_CUSTOMER_CENTER, req, res);
    //res.json('respond with a resource');
});
/* 고개센터 안내 */
router.get('/request/policy', function(req, res) {

    processGetRequest(Const.FAQ_LOGISTIC_POLICY, req, res);
    //res.json('respond with a resource');
});
/* 고개센터 안내 */
router.get('/request/partner', function(req, res) {

    processGetRequest(Const.FAQ_PARTNER_SERVICE, req, res);
    //res.json('respond with a resource');
});
/* 국제특송 */
router.get('/request/internationallogistic', function(req, res) {

    processGetRequest(Const.FAQ_INTERNATIONAL_LOGISTIC, req, res);
    //res.json('respond with a resource');
});

/* Welcome */
router.get('/request/welcome', function(req, res) {

    processGetRequest(Const.WELCOME, req, res);
    //res.json('respond with a resource');
});

//store search
router.get('/request/store/:location', function(req, res){
    processGetRequest(Const.STORE_SEARCH, req, res);
})


//search waybill with token - 2108.04.17
router.get('/request/search/waybill', function(req, res){
    processSearchGetRequest(Const.SEARCH_WAYBILL_WITH_TOKEN, req, res);
})

//search waybill
router.get('/request/search/waybill/:number', function(req, res){
    processSearchGetRequest(Const.SEARCH_WAYBILL, req, res);
})


let processSearchGetRequest = (action, req, res) =>
{

    console.log('processSearchGetRequest [action] : ' + action);
    try {
        //test
        let params = {};
        if(action == Const.SEARCH_WAYBILL)
        {
            params = req.params.number;
        }
        SearchActionHandler.processAction(action, params, req, res);
        //console.log('result: ', speech);
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
}

let processGetRequest = (action, req, res) =>
{
    res.header("Access-Control-Allow-Origin", "*");
    console.log('processGetRequest [action] : ' + action);
    try {
        //test
        let params = {};
        if(action == 'action-selectComments')
        {
            params = req.params.placeid;
        }
        ActionHandler.processAction(action, params, res);
        //console.log('result: ', speech);
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
}

let processPostRequest = (action, req, res) =>
{
    //res.header("Access-Control-Allow-Origin", "*");
    console.log('device request');
    try {
        //test
        let params = req.body;
        ActionHandler.processAction(action, params, res);
        //console.log('result: ', speech);
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
}


/*
 router.get('/employee/:id', function(req, res) {
 let empId = req.params.id;
 res.json(`${empId} 직원 상세 보기`);
 });
 //클라이언트에서 변경할 데이터를 json으로 넘겨줌, url id 가 올라옴
 router.put('/employee/:id', function(req, res) {
 //path variable
 let empId = req.params.id;
 let modified = req.body;
 console.log(modified);

 res.json(`${empId} 번 직원 정보 수정정`);});
 router.post('/employee', function(req, res) {
 let fromClient = req.body;   //body에 json이 들어옴
 console.log(fromClient)
 res.json(fromClient);
 });
 router.delete('/employee/:id', function(req, res) {
 let empId = req.params.id;

 res.json(`${empId} 직원 삭제 `);
 });
 */


module.exports = router;
