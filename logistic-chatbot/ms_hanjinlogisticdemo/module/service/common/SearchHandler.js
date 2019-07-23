/**
 * Created by JJW on 2017-10-23.
 */
var CommonHandlerBase = require("./CommonHandlerBase");
var _ = require('lodash');
const Const = require('../../util/const');
const request = require('request');
const APIEndPoint = 'https://logistic-api-server.mybluemix.net/';
//const APIEndPoint = 'http://localhost:3000/';
var SearchHandler = function(){

}

_.extend(SearchHandler.prototype,CommonHandlerBase.prototype);

SearchHandler.prototype.processAction = function(action, session, params, callback){


    var self = this;
    /**
     *  Desc : Bot으로 부터 입력받은 파라미터를 이용하여, 스케줄 조회를 실시 한다.
     */
    if(action == Const.SEARCH_WAYBILL) {

        let way_number = params;
        //코드를 변환하자..
        var host = APIEndPoint + `api/request/search/waybill/${way_number}`;
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

module["exports"] = new SearchHandler();