
var Const = require('../../util/const')
//const MessageAction = require('./../../util/messageAction')

var CommonHandlerBase = function(){
    
}


//백 엔드와 연동하여 실패 시
CommonHandlerBase.prototype.errorResponse = function(
        response,
        httpCode){

    response.status(httpCode);
    response.send("");
    
}

//백 엔드와 연동하여 성공시
CommonHandlerBase.prototype.successResponse = function(session, code, speech, data){
    console.log(">>[CommonHandlerBase] code : " + code);
    response.status(Const.httpCodeSucceed);
    
    if(code != Const.responsecodeSucceed){
        
        response.json({
            code : code
        });
        
    } else {

        //카드 또는 일반 텍스트 전송 여부 결정..


        console.log(">>[CommonHandlerBase] successResponse...code : " + code);
        response.json({
            speech: speech,
            displayText: speech,
            data : data,
            source: 'apiai-webhook-sample'
        })

    }

    
}

module["exports"] = CommonHandlerBase;