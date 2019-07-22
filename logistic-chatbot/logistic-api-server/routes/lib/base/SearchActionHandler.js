/**
 * Created by JJW on 2017-07-20.
 */

var RequestHandlerBase = require("./RequestHandlerBase");
var _ = require('lodash');
var Const = require('../util/const');
const host = 'https://logistic-api-server.mybluemix.net/';
const SearchServiceLogic = require('../service/search-service');
const jwt = require('jsonwebtoken');

var SearchActionHandler = function(){

}

_.extend(SearchActionHandler.prototype,RequestHandlerBase.prototype);

SearchActionHandler.prototype.processAction = function(action, param, req, res){

    var self = this;


    /**********************************************************
     *  Author : JJW
     *  Desc : 운송장 번호 기반 조회 서비스
     *  Date : 20171101
     ***********************************************************/
    if(action == Const.SEARCH_WAYBILL)
    {

        SearchServiceLogic.execute(param, function(result){
            //성공시
            let messageObj = generateContent(action, result);

            self.successResponse(res,Const.responsecodeSucceed, messageObj.message, {
                messageObj
            });


        },function(err,code, msg){

            if(err){

                self.errorResponse(
                    response,
                    Const.httpCodeSeverError
                );

            }else{

                self.successResponse(res,code, msg, {});

            }

        });
        //var testDump = Utils.objCopy(Const.TestData);
        //self.successResponse(res, Const.responsecodeSucceed, "아래 장소는 어때요?", testDump);
    }else if(action == Const.SEARCH_WAYBILL_WITH_TOKEN)
    {
        //token verify
        let authheader = req.headers['authorization'] || req.query.token

        const token = authheader.replace('bearer ', '');

        // token does not exist
        if(!token) {
            return res.status(403).json({
                success: false,
                message: 'not logged in'
            })
        }

        // get the decoded payload ignoring signature, no secretOrPrivateKey needed

        var decoded = jwt.decode(token);

        let messageObj = generateContent(action, decoded.id);

        self.successResponse(res,Const.responsecodeSucceed, messageObj.message, {
            messageObj
        });

// get the decoded payload and header
        //var decoded = jwt.decode(token, {complete: true});
        //console.log('header : ' + decoded.header);
        //console.log('payload : ' + decoded.payload);

        // create a promise that decodes the token req.app.get('jwt-secret')
        /*const p = new Promise(
         (resolve, reject) => {
         jwt.verify(token, 'shhhhh', { audience: 'Audience', issuer : 'Issuer', subject : 'subject' }, (err, decoded) => {
         if(err) reject(err)
         resolve(decoded)
         })
         }
         )*/
  /*      const p = new Promise(
            (resolve, reject) => {
                jwt.verify(token, 'secret', { audience: 'NodeJSAPI', issuer : 'JavaTokenManager', subject : 'users' }, (err, decoded) => {
                    if(err) reject(err)
                    resolve(decoded)
                })
            }
        )*/

/*
        jwt.verify(token, 'secret', { audience: 'NodeJSAPI', issuer : 'JavaTokenManager', subject : 'users' }, (err, decoded) => {
            if(err) {

                console.log("ERROR");
            }else
            {

                let messageObj = generateContent(action, decoded);

                self.successResponse(res,Const.responsecodeSucceed, messageObj.message, {
                    messageObj
                });
            }

        })*/

        /*// if token is valid, it will respond with its info
        const respond = (token) => {

            //성공시
            let messageObj = generateContent(action, token);

            self.successResponse(res,Const.responsecodeSucceed, messageObj.message, {
                messageObj
            });


        }

        // if it has failed to verify, it will return an error message
        const onError = (error) => {
            if(error){
                self.errorResponse(
                    response,
                    Const.httpCodeSeverError
                );

            }else{

                self.successResponse(res,code, msg, {});

            }
        }

        // process the promise
        p.then(respond).catch(onError)*/
    }

}

generateContent = (action, data) =>{

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

    if(action == Const.SEARCH_WAYBILL)
    {
        obj.message = Const.MSG_RESPONSE_SEARCH_WAYBILL + `\n 주문 하신 상품 ${data.product_name} 이며, 현재 상태는 ${data.product_status} 입니다. 자세한 결과를 원하시면 아래 '확인하기'를 클릭 해주세요.`
        obj.contents[0].link.web_url = `http://www.hanjin.co.kr/Delivery_html/inquiry/result_waybill.jsp?wbl_num=${data.way_number}`;
        //버튼
        let button_1 = {
            text : '메뉴로 가기',
            type : 'imback',
            value : '메뉴'
        }
        obj.buttons= [button_1];
        //delete obj.buttons;
    }else if(action == Const.SEARCH_WAYBILL_WITH_TOKEN){
        obj.message = `토큰 검증 완료 ${data}`,
            obj.contents[0].link.web_url = `http://www.hanjin.co.kr/Delivery_html/inquiry/result_waybill.jsp?wbl_num=${data.way_number}`;
        //버튼
        let button_1 = {
            text : '메뉴로 가기',
            type : 'imback',
            value : '메뉴'
        }
        obj.buttons= [button_1];
    }

    return obj;
}




module["exports"] = new SearchActionHandler();