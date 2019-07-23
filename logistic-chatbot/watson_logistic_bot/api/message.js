/**
 * Created by JJW on 2017-04-13.
 */
'use strict';

const Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
/*const FLIGHT_SEARCH = require('../module/flight-schedule-search-service');
const FAQ_SEARCH = require('../module/faq-search-service');*/
//const COMMON_MODULE = require('../module/common/common');
const CommonHandler = require('./module/service/common/CommonHandler');
const SearchHandler = require('./module/service/common/SearchHandler');
const MessageParser = require('./module/message/MessageParser');
const Const = require('./module/util/const');

// Create a Service Wrapper
// Create the service wrapper
let conversation = new Conversation({
    username: '', // replace with username from service key
    password: '', // replace with password from service key
    path: { workspace_id: '' }, // replace with workspace ID
    url: 'https://gateway.watsonplatform.net/conversation/api',
    version_date: '2016-10-21',
    version: 'v1'
});

/**
 *  대화응답을 가져온다.
 * @param message
 * @param context
 * @returns {Promise}
 */
let getConversationResponse = (message, context) => {
    let payload = {
        workspace_id: process.env.WORKSPACE_ID,
        context: context || {},
        input: message || {}
    };

    payload = preProcess(payload);

    //Promise 형태

    /**
     * 실제 왓슨 서버로 부터의 응답을 가져온다.
     */
    return new Promise((resolved, rejected) => {
            // Send the input to the conversation service
            conversation.message(payload, function(err, data) {
            if (err) {
                reject(err);
            }
                //우선 콜백으로 처리 함...
                postProcess(data, function(result){
                    resolved(result);
                })


        });
})
}

/**
 * 요청시 해당 함수를 수행한다..
 * @param req
 * @param res
 */
let postMessage = (req, res) => {
    let message = req.body.input || {};
    let context = req.body.context || {};
    getConversationResponse(message, context).then(data => {

        function sendJson(data, cb)
        {
            res.json(data);
            cb;
        }

        sendJson(data, function()
        {
            data.output.text = [];
            return;
        })
        //res.json(data);

}).catch(err => {
        return res.status(err.code || 500).json(err);
});
}

/**
 * 사용자의 메세지를 Watson Conversation 서비스에 전달하기 전에 처리할 코드
 * @param  {Object} user input
 */
let preProcess = payload => {
    var inputText = payload.input.text;
    console.log("User Input : " + inputText);
    console.log("Processed Input : " + inputText);
    console.log("--------------------------------------------------");

    return payload;
}

/**
 * Watson Conversation 서비스의 응답을 사용자에게 전달하기 전에 처리할 코드
 * @param  {Object} watson response
 */

 let postProcess = (response, callback) => {
// let postProcess = (response) => {
    console.log("Conversation Output : " + response.output.text);
    console.log("--------------------------------------------------");
    if(response.context && response.context.action){
        doAction(response, response.context.action, function(data){
            //context command 정리
            //delete data.context.action
            callback(data);
        })


    }else {

        callback(response);

    }
}

/**
 * 대화 도중 Action을 수행할 필요가 있을 때 처리되는 함수
 * @param  {Object} data : response object
 * @param  {Object} action
 */
let doAction = (data, action, cb) => {
    console.log("Action : " + action.command);
     if(action.command == "check-faq-search")
    {

        let query = data.context.inputValue;

        CommonHandler.processAction('ACTION_FAQ_REQUEST', query, (result) =>{
            //session.send(result);
            data.output.text.push(result.answer);
            cb(data);
/*            MessageParser.parseResponseMessage('ACTION_FAQ_REQUEST', result, (result) =>{

                //data.output.text.push(result);
                data.output.buttons = result.buttons;
                data.output.image = result.image;
                data.output.link = result.link;
                if(data.output.text.length > 1)
                {
                    data.output.text[0] = result.text;
                }else {
                    data.output.text = result.text;
                }


                cb(data);
            })*/
        });

        //actionCheckLocation 으로 검색 하자..

        /*//if(data.context.ToLocation && data.context.FromLocation)
        if(action.actionCheckFromLocation && action.actionCheckToLocation)
        {
            //조사를 제거한다..
            var fromLocation = COMMON_MODULE.replaceText(data.context.FromLocation, "에서", "");
            var toLocation = COMMON_MODULE.replaceText(data.context.ToLocation, "으로", "");

            AIRPORT_SEARCH.searchAirportCityFromAzure(toLocation)
                .then(function (result) {
                    data.context.ToLocationCode = result.code;
                    data.context.ToLocationTransName = result.transName;
                    data.context.ToLocationImgUrl = result.imgUrl;
                    AIRPORT_SEARCH.searchAirportCityFromAzure(fromLocation)
                        .then(function (result) {

                            data.context.FromLocationCode = result.code;
                            data.context.FromLocationTransName = result.transName;
                            data.context.FromLocationImgUrl = result.imgUrl;

                            cb(data);
                        })
                        .catch(function(error){
                            data.output.text.push("출발지 공항이 존재 하지 않습니다.");
                            cb(data);
                        })
                }).catch(function(error){
                    console.log(">>>>error");
                    data.output.text.push("목적지 공항이 존재 하지 않습니다.");
                    cb(data);
                })

        }else {

            AIRPORT_SEARCH.searchAirportCityFromAzure(action.actionCheckLocation)
                .then(function (result) {
                    //Context에 저장하자..
                    console.log("result.. " + result);



                    if (data.context.ToLocation && !data.context.FromLocation) {
                        //우선 result의 code 가 0 인경우
                        if(result.code == 0)
                        {
                            data.context.ToLocationFound = false;
                        }else {
                            data.context.ToLocationFound = true;
                            data.context.ToLocationCode = result.code;
                            data.context.ToLocationTransName = result.transName;
                            data.context.ToLocationImgUrl = result.imgUrl;
                            data.context.ToLocationCheck = true;
                            //output 이미지 주가..
                            data.output.image = new Object();
                            data.output.image.url = result.imgUrl;
                            console.log(">>>>data img : " + data.output.image.url);
                        }
                    } else {
                        if(result.code == 0)
                        {
                            data.context.FromLocationFound = false;
                        }else {
                            data.context.FromLocationFound = true;
                            data.context.FromLocationCode = result.code;
                            data.context.FromLocationTransName = result.transName;
                            data.context.FromLocationImgUrl = result.imgUrl;
                            data.context.FromLocationCheck = true;
                            data.output.image = new Object();
                            data.output.image.url = result.imgUrl;
                        }

                    }
                    cb(data);
                })
                .catch(function (error) {
                    if (data.context.ToLocation && !data.context.FromLocation) {
                        data.context.ToLocationCheck = false;
                    }else {
                        data.context.FromLocationCheck = false;
                    }
                    data.output.text.push("해당 공항이 존재 하지 않습니다.");
                    cb(data);
                })
        }*/

    }
    else if(action.command == "check-faq-compensation-process") {

         let query = data.context.inputValue;

         CommonHandler.processAction(Const.FAQ_COMPENSATION_PROCESS, query, (result) => {
             //session.send(result);

             MessageParser.parseResponseMessage(Const.FAQ_COMPENSATION_PROCESS, result, (result) =>{

                 //data.output.text.push(result);
                 data.output.buttons = result.buttons;
                 data.output.image = result.image;
                 data.output.link = result.link;
                 if(data.output.text.length > 1)
                 {
                     data.output.text[0] = result.text;
                 }else {
                     data.output.text = result.text;
                 }


                 cb(data);
             })
         });
    }
    else if(action.command == "check-faq-customer-service") {

         let query = data.context.inputValue;

         CommonHandler.processAction(Const.FAQ_CUSTOMER_CENTER, query, (result) => {
             //session.send(result);

             MessageParser.parseResponseMessage(Const.FAQ_COMPENSATION_PROCESS, result, (result) =>{

                 //data.output.text.push(result);
                 data.output.buttons = result.buttons;
                 data.output.image = result.image;
                 data.output.link = result.link;
                 data.output.text = result.text;


                 cb(data);
             })
         });
    }
     /**
      *  파트너 서비스
      */
     else if(action.command == "check-faq-partner-service") {

         let query = data.context.inputValue;

         CommonHandler.processAction(Const.FAQ_PARTNER_SERVICE, query, (result) => {
             //session.send(result);

             MessageParser.parseResponseMessage(Const.FAQ_COMPENSATION_PROCESS, result, (result) =>{

                 //data.output.text.push(result);
                 data.output.buttons = result.buttons;
                 data.output.image = result.image;
                 data.output.link = result.link;
                 data.output.text = result.text;


                 cb(data);
             })
         });
     }
     /**
      *  운송약관 서비스
      */
     else if(action.command == "check-faq-logistic-policy-service") {

         let query = data.context.inputValue;

         CommonHandler.processAction(Const.FAQ_LOGISTIC_POLICY, query, (result) => {
             //session.send(result);

             MessageParser.parseResponseMessage(Const.FAQ_COMPENSATION_PROCESS, result, (result) =>{

                 //data.output.text.push(result);
                 data.output.buttons = result.buttons;
                 data.output.image = result.image;
                 data.output.link = result.link;
                 data.output.text = result.text;


                 cb(data);
             })
         });
     }
     /**
      *  국제특송
      */
     else if(action.command == "check-faq-international-logistic-service") {

         let query = data.context.inputValue;

         CommonHandler.processAction(Const.FAQ_INTERNATIONAL_LOGISTIC, query, (result) => {
             //session.send(result);

             MessageParser.parseResponseMessage(Const.FAQ_COMPENSATION_PROCESS, result, (result) =>{

                 //data.output.text.push(result);
                 data.output.buttons = result.buttons;
                 data.output.image = result.image;
                 data.output.link = result.link;
                 data.output.text = result.text;


                 cb(data);
             })
         });
     }
    /**
     *  Welcome
     */
    else if(action.command == "welcome") {

        let query = data.context.inputValue;
         CommonHandler.processAction(Const.WELCOME, query, (result) => {
             MessageParser.parseResponseMessage(Const.WELCOME, result, (result) => {
                 data.output.text.push(result);
                 data.output.image = result.image;
                 data.output.text = result.text;
                 data.output.buttons = result.buttons;
                 cb(data);
             })
         });
    }
     /**
      *  FAQ Intro
      */
     else if(action.command == "faq-intro") {

         let query = data.context.inputValue;

         MessageParser.parseResponseMessage(Const.FAQ_INTRO, null, (result) =>{
             //data.output.text.push(result);
             data.output.image = result.image;
             //data.output.text = result.text;
             cb(data);
         })
     }
     /**
      *  Search
      */
     else if(action.command == "check-search-waybill") {

         let query = data.context.inputValue;

         SearchHandler.processAction(Const.SEARCH_WAYBILL, query, (result) =>{
             MessageParser.parseResponseMessage(Const.WELCOME, result, (result) => {
                 data.output.text.push(result);
                 data.output.image = result.image;
                 data.output.text = result.text;
                 data.output.buttons = result.buttons;
                 cb(data);
             })

         });
     }
    else{

        console.log(">>>>>>datatext length : " + data.output.text)
        cb(data);

    }
    console.log(">>h2");

}

/**
 * Make reservation
 * @param  {Object} data : response object
 * @param  {Object} action
 */
let confirmReservation = (data, action) =>{
    //TODO
    return data;
}

module.exports = {
        'initialize': (app, options) => {
        app.post('/api/message', postMessage);

    },
    'getConversationResponse' : getConversationResponse
};