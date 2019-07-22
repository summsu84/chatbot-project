
var Const = require('../util/const')

var RequestHandlerBase = function(){
    
}


RequestHandlerBase.prototype.errorResponse = function(
        response,
        httpCode){

    response.status(httpCode);
    response.send("");
    
}

RequestHandlerBase.prototype.successResponse = function(response, code, speech, data){
    console.log(">>[RequestHandlerBase] code : " + code);
    response.status(Const.httpCodeSucceed);
    
    if(code != Const.responsecodeSucceed){

        //success 코드가 아닌 경우..
        response.json({
            speech: speech,
            displayText: speech,
            data : null,
            source: 'apiai-webhook-sample'
        })

        /*response.json({
            code : code
        });*/
        
    } else {

/*        response.json({
            code : Const.responsecodeSucceed,
            data : data
        });*/
        console.log(">>[RequestHandlerBase] successResponse...code : " + code);
        response.json({
            speech: speech,
            displayText: speech,
            data : data,
            source: 'apiai-webhook-sample'
        })

    }

    
}

module["exports"] = RequestHandlerBase;