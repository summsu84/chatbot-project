/**
 * Created by JJW on 2017-10-26.
 */
/**
 * Created by JJW on 2017-10-23.
 */
var _ = require('lodash');
const request = require('request');
const Const = require('../util/const');

var MessageParser = function(){

}

MessageParser.prototype.parseResponseMessage = (action, params, callback) =>{


    var self = this;
    /**
     *  Desc : Bot으로 부터 입력받은 파라미터를 이용하여, 스케줄 조회를 실시 한다.
     */
    if(action == 'ACTION_FAQ_REQUEST') {


        let output = convertWatsonMessage(params);
        output.text = [];
        output.text.push(params.data.messageObj.message);

        callback(output);

    }else if(action == Const.FAQ_COMPENSATION_PROCESS) {

        let output = convertWatsonMessage(params);
        output.text = [];
        output.text.push(params.data.messageObj.message);

        callback(output);
    }else if (action == Const.WELCOME)
    {
        let output = convertWatsonMessage(params);
        output.text = [];
        output.text.push(params.data.messageObj.message);

        callback(output);
    }else if (action == Const.FAQ_INTRO)
    {
        let output = generateImageObj('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6XO8e4KjxylOMFPvj3RAjUluV8KkJbIfmL1zz3h2jalKZH18J9A');
        callback(output);
    }

}

let convertWatsonMessage = (messageObj) =>
{
    let message = messageObj.data.messageObj;
    let watsonMsg = {

    }
    if(!message.hasOwnProperty('type'))
    {
        //컨텐츠 내용을 보고 카드를 결정하자.
        //1. 컨텐츠 내용이 아무것도 없는 경우, 일반 메시지
        //2. 컨텐츠 내용이 있는 경우, HeroCard
        //3. 버튼 내용이 있는 경우, HeroCard + Button
        if(message.hasOwnProperty('contents'))
        {
            if(message.hasOwnProperty('buttons'))
            {
                //HeroCard
                //1. 버튼의 개수를 파악하자..
                let buttonArray = [];
                let text = message.message;
                for(let i in message.buttons)
                {
                    let button = message.buttons[i];

                    let title = button.text;
                    let value = button.value;

                    //let link = button.link.web_url;

                    let buttonObj = {
                        button : {
                            type: 'imback',
                            text: title,
                            value: value
                        }
                    }
                    buttonArray.push(buttonObj);
                }

                //buttonObject 생성
                watsonMsg['buttons'] = buttonArray;
            }else
            {
                //HeroCard

            }

            let contents = message.contents;
            //content parsing
            //output 이미지 주가..
            for(var c in contents) {
                let content = contents[c];

                if (content.hasOwnProperty('image_url')) {
                    let imgUrl = content.image_url;
                    let image = {
                        image_url: imgUrl
                    }
                    watsonMsg['image'] = image;

                }
                if (content.hasOwnProperty('link')) {
                    //추후
                    let link = content.link;
                    watsonMsg['link'] = link
                }
            }

        }else
        {
            //일반 텍스트
        }
    }

    return watsonMsg;
}

let generateImageObj = (imgUrl) =>
{

    let watsonMsg = {
        image : {
            image_url : imgUrl
        }
    }

    return watsonMsg;
}

module["exports"] = new MessageParser();