/**
 * Created by JJW on 2017-10-23.
 */
var CommonHandlerBase = require("./CommonHandlerBase");
var _ = require('lodash');

const request = require('request');
const Const = require('../../util/const');
const APIEndPoint = 'https://logistic-api-server.mybluemix.net/api/'

var CommonHandler = function(){

}

_.extend(CommonHandler.prototype,CommonHandlerBase.prototype);

CommonHandler.prototype.processAction = function(action, params, callback){


    var self = this;
    /**
     *  Desc : Bot으로 부터 입력받은 파라미터를 이용하여, 스케줄 조회를 실시 한다.
     */
    if(action == 'ACTION_FAQ_REQUEST') {

        //코드를 변환하자..
        var host = APIEndPoint + 'request/faq';
        const requestData = {
            url: host,
            method: 'POST',
            json: {
                'query': params
            }
        };

        request.post(requestData, (error, response, body) => {
            if (error) {
                console.error(error);
            } else if (response.statusCode !== 200) {
                console.error(body);
            } else {
                //Anser 결과 값
                let answer = body.data.result;
                if (callback) {
                    callback(answer);
                }

            }

        });
    }else if(action == Const.FAQ_COMPENSATION_PROCESS) {

        //보상절차 정보를 가져오자.
        var host = APIEndPoint + 'request/compensation';
        const requestData = {
            url: host,
            method: 'GET'
        };

        request.get(requestData, (error, response, body) => {
            if (error) {
                console.error(error);
            } else if (response.statusCode !== 200) {
                console.error(body);
            } else {
                //Anser 결과 값
                let messageObj = JSON.parse(body);

                if (callback) {
                    callback(messageObj);
                }

            }

        });
    }else if(action == Const.FAQ_CUSTOMER_CENTER) {

        //보상절차 정보를 가져오자.
        var host = APIEndPoint + 'request/customer';
        const requestData = {
            url: host,
            method: 'GET'
        };

        request.get(requestData, (error, response, body) => {
            if (error) {
                console.error(error);
            } else if (response.statusCode !== 200) {
                console.error(body);
            } else {
                //Anser 결과 값
                let messageObj = JSON.parse(body);

                if (callback) {
                    callback(messageObj);
                }

            }

        });
    }
    else if(action == Const.FAQ_PARTNER_SERVICE) {

        //보상절차 정보를 가져오자.
        var host = APIEndPoint + 'request/partner';
        const requestData = {
            url: host,
            method: 'GET'
        };

        request.get(requestData, (error, response, body) => {
            if (error) {
                console.error(error);
            } else if (response.statusCode !== 200) {
                console.error(body);
            } else {
                //Anser 결과 값
                let messageObj = JSON.parse(body);

                if (callback) {
                    callback(messageObj);
                }

            }

        });
    }
    else if(action == Const.FAQ_LOGISTIC_POLICY) {

        //보상절차 정보를 가져오자.
        var host = APIEndPoint + 'request/policy';
        const requestData = {
            url: host,
            method: 'GET'
        };

        request.get(requestData, (error, response, body) => {
            if (error) {
                console.error(error);
            } else if (response.statusCode !== 200) {
                console.error(body);
            } else {
                //Anser 결과 값
                let messageObj = JSON.parse(body);

                if (callback) {
                    callback(messageObj);
                }

            }

        });
    }
    else if(action == Const.FAQ_INTERNATIONAL_LOGISTIC) {

        //보상절차 정보를 가져오자.
        var host = APIEndPoint + 'request/internationallogistic';
        const requestData = {
            url: host,
            method: 'GET'
        };

        request.get(requestData, (error, response, body) => {
            if (error) {
                console.error(error);
            } else if (response.statusCode !== 200) {
                console.error(body);
            } else {
                //Anser 결과 값
                let messageObj = JSON.parse(body);

                if (callback) {
                    callback(messageObj);
                }

            }

        });
    }
    else if(action == Const.WELCOME) {

        //보상절차 정보를 가져오자.
        var host = APIEndPoint + 'request/welcome';
        const requestData = {
            url: host,
            method: 'GET'
        };

        request.get(requestData, (error, response, body) => {
            if (error) {
                console.error(error);
            } else if (response.statusCode !== 200) {
                console.error(body);
            } else {
                //Anser 결과 값
                let messageObj = JSON.parse(body);

                if (callback) {
                    callback(messageObj);
                }

            }

        });
    }

}

module["exports"] = new CommonHandler();