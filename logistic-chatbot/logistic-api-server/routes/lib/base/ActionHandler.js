/**
 * Created by JJW on 2017-07-20.
 */


var FAQServiceLogic = require("../service/faq-service");
let StoreSearchService = require('../service/store-service');
var RequestHandlerBase = require("./RequestHandlerBase");
var _ = require('lodash');
var Const = require('../util/const');
const host = 'https://logistic-api-server.mybluemix.net/';
var ActionHandler = function(){

}

_.extend(ActionHandler.prototype,RequestHandlerBase.prototype);

ActionHandler.prototype.processAction = function(action, param, res){

    var self = this;


    /**********************************************************
     *  Author : JJW
     *  Desc : MS QnA Maker와 연동하여, 질문에 대한 대답 제공.
     *  Date : 20171024
     ***********************************************************/
    if(action == 'action-faq-service')
    {

        FAQServiceLogic.execute(param, function(result){

            self.successResponse(res,Const.responsecodeSucceed, Const.responseMessageRecommendPlaceSearch, {
                result,
                type : 'text'
            });

        },function(err,code){

            if(err){

                self.errorResponse(
                    response,
                    Const.httpCodeSeverError
                );

            }else{

                self.successResponse(res,code);

            }

        });
        //var testDump = Utils.objCopy(Const.TestData);
        //self.successResponse(res, Const.responsecodeSucceed, "아래 장소는 어때요?", testDump);
    }else if(action == Const.FAQ_COMPENSATION_PROCESS)
    {
        //보상 처리 절차 관련 내용 이미지를 전송하자..

        let messageObj = generateContent(action, null);

        self.successResponse(res,Const.responsecodeSucceed, messageObj.message, {
            messageObj
        });
    }else if(action == Const.FAQ_CUSTOMER_CENTER)
    {
        //보상 처리 절차 관련 내용 이미지를 전송하자..
        let messageObj = generateContent(action, null);

        self.successResponse(res,Const.responsecodeSucceed, messageObj.message, {
            messageObj
        });
    }
    else if(action == Const.FAQ_CUSTOMER_CENTER)
    {
        let messageObj = generateContent(action, null);

        self.successResponse(res,Const.responsecodeSucceed, messageObj.message, {
            messageObj
        });
    }
    else if(action == Const.FAQ_PARTNER_SERVICE)
    {
        let messageObj = generateContent(action, null);

        self.successResponse(res,Const.responsecodeSucceed, messageObj.message, {
            messageObj
        });
    }
    else if(action == Const.FAQ_LOGISTIC_POLICY)
    {
        let messageObj = generateContent(action, null);

        self.successResponse(res,Const.responsecodeSucceed, messageObj.message, {
            messageObj
        });
    }
    else if(action == Const.FAQ_INTERNATIONAL_LOGISTIC)
    {
        let messageObj = generateContent(action, null);

        self.successResponse(res,Const.responsecodeSucceed, messageObj.message, {
            messageObj
        });
    }
    else if(action == Const.WELCOME)
    {
        let messageObj = generateContent(action, null);

        self.successResponse(res,Const.responsecodeSucceed, messageObj.message, {
            messageObj
        });
    }
    //store
    else if(action == Const.STORE_SEARCH)
    {
        StoreSearchService.execute(param, function(result){

            self.successResponse(res,Const.responsecodeSucceed, Const.responseMessageRecommendPlaceSearch, {
                result,
                type : 'text'
            });

        },function(err,code){

            if(err){

                self.errorResponse(
                    response,
                    Const.httpCodeSeverError
                );

            }else{

                self.successResponse(res,code);

            }

        });
    }

}

let generateContent = (action, data) =>{

    let obj =
    {
        "message" : "",
        "contents": [
            {
                "title": "",
                "description": "",
                "image_url": "",
                "link": {
                    "web_url": "http://www.daum.net/contents/1"
                }
            },
            ],
        "buttons" : [
            {
                "title": "",
                "link": {
                    "web_url": "",
                    "mobile_web_url": ""
                }
            }
        ]
    }

    if(action == Const.FAQ_COMPENSATION_PROCESS)
    {
        obj.message = '보상처리 절차입니다. 운송장 번호 확인 후 해당 배송원 또는 대리점에 클레임 발생 전화 이후 보상 처리가 완료됩니다. 좀더 자세한 정보를 원하시면 아래 링크를 클릭 해주세요';
        obj.contents[0].image_url = `${host}/images/faq_compensation_process.png`;
        obj.contents[0].link.web_url = `https://www.hanjin.co.kr/Delivery_html/help/compensation.jsp`;
        //버튼
        let button_1 = {
            text : '메뉴로 가기',
            type : 'imback',
            value : '메뉴'
        }
        obj.buttons= [button_1];
        //delete obj.buttons;
    }else if(action == Const.FAQ_CUSTOMER_CENTER)
    {
        obj.message = '개인택배예약 : 1544-0011\n 반품 및 배송조회 : 1588-0011 \n 국제특송 : 1588-1612 \n(운영시간은 평일 09:00 ~ 18:00, 토요일 09:00 ~ 13:00 입니다). 좀더 자세한 정보를 원하시면 아래 링크를 클릭 해주세요';
        obj.contents[0].image_url = `${host}/images/faq_customer_service_notice.png`;
        obj.contents[0].link.web_url = `https://www.hanjin.co.kr/Delivery_html/help/service_center.jsp`;
        //버튼
        let button_1 = {
            text : '메뉴로 가기',
            type : 'imback',
            value : '메뉴'
        }
        obj.buttons= [button_1];
    }
    else if(action == Const.FAQ_PARTNER_SERVICE)
    {
        obj.message = '대한항공 스카이패스 회원을 대상으로 마일리지를 적립해드립니다. 국내택배의 경우 1박스당 5000원 이상 운송료를 선불로 하신 개인공객에게 1박스당 50마일을 적립해드리며, 국제특송의 경우 1건당 50,000원 이상 운송료를 지불하신 고객에게 마일리지를 적립해드립니다. 좀더 자세한 정보를 원하시면 아래 링크를 클릭 해주세요';
        obj.contents[0].image_url = `${host}/images/faq_skypass.png`;
        obj.contents[0].link.web_url = `https://www.hanjin.co.kr/Delivery_html/cooperate/skypass.jsp`;
        //버튼
        let button_1 = {
            text : '메뉴로 가기',
            type : 'imback',
            value : '메뉴'
        }
        obj.buttons= [button_1];
    }
    /**
     *  택배 얀관 관련
     */
    else if(action == Const.FAQ_LOGISTIC_POLICY)
    {
        obj.message = '택배 운송야관에 대해서 알려드리겠습니다. 아래 링크를 클릭해주세요.';
        obj.contents[0].image_url = `${host}/images/faq_policy.png`;
        obj.contents[0].link.web_url = `https://www.hanjin.co.kr/Delivery_html/help/policy.jsp`;
        //버튼
        let button_1 = {
            text : '메뉴로 가기',
            type : 'imback',
            value : '메뉴'
        }
        obj.buttons= [button_1];
    }else if(action == Const.FAQ_INTERNATIONAL_LOGISTIC)
    {
        obj.message = '국제특송 문의처는 한국 1599-1612, 일본 81-3-5767-7745 이며, 기타 지역 등 좀더 자세한 정보를 원하시면 아래 링크를 클릭 해주세요'
        obj.contents[0].image_url = `${host}/images/faq_abroad.png`;
        obj.contents[0].link.web_url = `https://www.hanjin.co.kr/Delivery_html/store/abroad.jsp`;
        //버튼
        let button_1 = {
            text : '메뉴로 가기',
            type : 'imback',
            value : '메뉴'
        }
        obj.buttons= [button_1];
    } else if(action == Const.WELCOME)
    {
        obj.message = '안녕하세요, 무엇을 도와 드릴까요?'
        obj.contents[0].image_url = `https://lh5.ggpht.com/V4xR5WUXboguWLZScQNdf0aJ_yd-Ppur9jAiWRJZSjJDx92kcgygVKmvEQbsvDfSow=w300`;
        obj.contents[0].link.web_url = `https://www.hanjin.co.kr/Delivery_html/store/abroad.jsp`;
        //버튼
        let button_1 = {
            text : 'FAQ 조회',
            type : 'imback',
            value : 'FAQ 조회'
        }
        let button_2 = {
            text : '예약 조회',
            type : 'imback',
            value : '예약 조회'
        }
        obj.buttons = [button_1, button_2];
    }

    return obj;
}

module["exports"] = new ActionHandler();