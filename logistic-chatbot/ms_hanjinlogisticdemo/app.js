/**
 * Created by JJW on 2017-10-20.
 */
var restify = require('restify');
var builder = require('botbuilder');
var COMMON_MODULE = require('./module/util/common');
const Const = require('./module/util/const');

const CommonHandler = require('./module/service/common/CommonHandler');
const SearchHandler = require('./module/service/common/SearchHandler');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '[input app id]',
    appPassword: '[input app password]'
});
/*var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});*/

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
/*var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
    session.beginDialog('/intent');
});*/
var bot = new builder.UniversalBot(connector,{
    localizerSettings:{
        defaultLocale:"kr"
    }
});

//LUIS App 사용
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/[appId]?subscription-key=[subscription key]&staging=true&verbose=true&timezoneOffset=0&q=';
var recognizer = new builder.LuisRecognizer(model);
var intentDialog = new builder.IntentDialog({recognizers: [recognizer]});


bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye|끝|종료/i });
bot.beginDialogAction('help', '/help', { matches: /^help|도움/i });
bot.beginDialogAction('main', '/', {matches:/^처음|메인|메뉴/i});        //메인으로 이동하기


/*
bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, '안녕하세요, 질문을 입력해주세요..');
    },
    function (session, results) {
        let query = results.response;

        CommonHandler.processAction('ACTION_FAQ_REQUEST', session, query, (result) =>{
            session.send(result);
        });

    }
/!*    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, 'Hi ' + results.response + ', How many years have you been coding?');
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, 'What language do you code Node using? ', ['JavaScript', 'CoffeeScript', 'TypeScript']);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.endDialog('Got it... ' + session.userData.name +
            ' you\'ve been programming for ' + session.userData.coding +
            ' years and use ' + session.userData.language + '.');
    }*!/
]);
*/


/**
 *  대화하기
 */
bot.dialog('/', [
    function (session, args, next) {
        var style = builder.ListStyle['button'];
        var option = session.localizer.gettext(session.preferredLocale(), 'choice_option');
        builder.Prompts.choice(session, '무엇을 도와 드릴까요? 메뉴를 선택하세요.', '고객정보 질의 하기 | 배송조회  | 도움말 ', { listStyle: style });
    },
    //고객정보 질의
     (session, results, next) =>{
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            let entity = "";
            let channelId = session.message.address.channelId;
            let promptText = "";

            //고객 질의인 경우
            if (results.response.index == 0) {
                //entity = "intentFlightSearch";
                entity = "faq";


            } else if (results.response.index == 1) {
                //예약 정보 질의
                entity = 'search';
            }
            else {
                entity = "help";
                session.replaceDialog('/', '해당 메뉴는 준비 중입니다.');
            }

            if (promptText.length > 0) {
                session.beginDialog('/' + entity, {promptText: promptText, languageType: languageType});
            } else {
                session.beginDialog('/' + entity);
            }
        }
    },
    //예약 정보 질의
    (session, results) => {
        //session.beginDialog('/intent');
        session.replaceDialog('/', '해당 메뉴는 준비 중입니다.');
    }
]);

bot.dialog('/search', [
    (session) =>{
        builder.Prompts.text(session, '조회 하실 운송장 번호를 입력해주세요. 운송장번호는 중간 "-" 없이 1234567890 으로 입겨하세요. 현재 일반 고객 서비스만 가능합니다.');
    },
    (session, results) => {
        let query = results.response;

        SearchHandler.processAction(Const.SEARCH_WAYBILL, session, query, (result) =>{
            let message = result;

            let card = messageAdapter(session, message);
            let msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

        });
    }
]);



bot.dialog('/faq', [
    (session) =>{
        builder.Prompts.text(session, '고객님들께서 궁금하신점을 질문 하세요. (일반 질의, 고객센터 안내, 보상 처리 절차, 약관 조회 등)');
    },
    (session, results, next) => {
        session.sendTyping();           //typing..
        let query = results.response;

        CommonHandler.processAction('ACTION_FAQ_REQUEST', session, query, (result) =>{

            //결과가 없거나, score가 낮은 경우, intentDialog로 이동하자..
            let score = result.score;
            console.log("score : " + score);
            if(score < 30)
            {
                //스코어가 낮으면, IntentDialog로 넘어간다.
                session.replaceDialog('/intent', {
                    message : {
                    text : query
                }});
            }else {
                session.send(COMMON_MODULE.replaceTextAll(result.answer, 'undefined', ''));
                //session.replaceDialog('/');
                //session.endDialog();
                var style = builder.ListStyle['button'];
                var option = session.localizer.gettext(session.preferredLocale(), 'choice_option');
                builder.Prompts.choice(session, '질문하신 내용에 대한 답변에 만족하시나요?', '네 | 아니요 ', { listStyle: style });
            }
        });
    },
    (session, results) => {
        if (results.response && results.response.entity != '(quit)') {
            //고객 질의인 경우
            if (results.response.index == 0) {
                //entity = "intentFlightSearch";
                session.endDialog('메뉴로 이동합니다.');
            } else if (results.response.index == 1) {
                session.replaceDialog('/faq');
            }
            else {
                session.replaceDialog('/faq');
            }
        }
    }
    ]
);


//help
bot.dialog('/help', [
    (session) =>{
        session.endDialog('질문 하시고 싶은거나, 운송장 조회를 해보세요');
    }
]);




/**
 *  Intent다이얼로그 설정
 */
bot.dialog('/intent', intentDialog);

intentDialog.onBegin(function(session, args, next){
    console.log(">>>>>>>>>>>>>intentDialog begin is called..");
    //잘못 입력한 경우 발생 시 ....
    if(args && args.hasOwnProperty('message'))
    {
        var obj = {
            message : {
                text : args.message.text
            }
        };
        recognizer.recognize(obj, function(err, result)
        {
            console.log(">>>test");
            //session.replaceDialog('/intentFlightSearch', result);
            intentDialog.replyReceived(session, result);
        })
    }else {
        //endDialog..

    }
});

intentDialog.matches('FAQ_CompensationProcess', [
    function(session, args, next) {
        console.log('CompesationProcess is called..');
        session.sendTyping();           //typing..
        //보상처리 절차 호출
        CommonHandler.processAction(Const.FAQ_COMPENSATION_PROCESS, session, null, (result) =>{

            //결과가 없거나, score가 낮은 경우, intentDialog로 이동하자..
            let message = result;
            let card = messageAdapter(session, message);
            let msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
            //session.endDialog();
            var style = builder.ListStyle['button'];
            var option = session.localizer.gettext(session.preferredLocale(), 'choice_option');
            builder.Prompts.choice(session, '질문하신 내용에 대한 답변에 만족하시나요?', '네 | 아니요 ', { listStyle: style });
        });
    },
    function (session, results)
    {
        if (results.response && results.response.entity != '(quit)') {
            //고객 질의인 경우
            if (results.response.index == 0) {
                //entity = "intentFlightSearch";
                session.endDialog('메뉴로 이동합니다.');
            } else if (results.response.index == 1) {
               session.replaceDialog('/faq');
            }
            else {
                session.replaceDialog('/faq');
            }
        }
    }
]).matches('FAQ_CustomerService', [
    function(session, args, next) {
        console.log('CustomerService is called..');
        session.sendTyping();           //typing..
        //보상처리 절차 호출
        CommonHandler.processAction(Const.FAQ_CUSTOMER_CENTER, session, null, (result) =>{

            //결과가 없거나, score가 낮은 경우, intentDialog로 이동하자..
            let message = result;

            let card = messageAdapter(session, message);
            let msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
            var style = builder.ListStyle['button'];
            var option = session.localizer.gettext(session.preferredLocale(), 'choice_option');
            builder.Prompts.choice(session, '질문하신 내용에 대한 답변에 만족하시나요?', '네 | 아니요 ', { listStyle: style });
        });
    },
    function (session, results)
    {
        if (results.response && results.response.entity != '(quit)') {
            //고객 질의인 경우
            if (results.response.index == 0) {
                //entity = "intentFlightSearch";
                session.endDialog('메뉴로 이동합니다.');
            } else if (results.response.index == 1) {
                session.replaceDialog('/faq');
            }
            else {
                session.replaceDialog('/faq');
            }
        }

    }
]).matches('FAQ_InternationalLogistic', [
    function(session, args, next) {
        console.log('CompesationProcess is called..');
        session.sendTyping();           //typing..
        //보상처리 절차 호출
        CommonHandler.processAction(Const.FAQ_INTERNATIONAL_LOGISTIC, session, null, (result) =>{

            //결과가 없거나, score가 낮은 경우, intentDialog로 이동하자..
            let message = result;

            let card = messageAdapter(session, message);
            let msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
            var style = builder.ListStyle['button'];
            var option = session.localizer.gettext(session.preferredLocale(), 'choice_option');
            builder.Prompts.choice(session, '질문하신 내용에 대한 답변에 만족하시나요?', '네 | 아니요 ', { listStyle: style });
        });
    },
    function (session, results)
    {
        if (results.response && results.response.entity != '(quit)') {
            //고객 질의인 경우
            if (results.response.index == 0) {
                //entity = "intentFlightSearch";
                session.endDialog('메뉴로 이동합니다.');
            } else if (results.response.index == 1) {
                session.replaceDialog('/faq');
            }
            else {
                session.replaceDialog('/faq');
            }
        }

    }
]).matches('FAQ_LogisticPolicy', [
    function(session, args, next) {
        console.log('CompesationProcess is called..');
        session.sendTyping();           //typing..
        //보상처리 절차 호출
        CommonHandler.processAction(Const.FAQ_LOGISTIC_POLICY, session, null, (result) =>{

            //결과가 없거나, score가 낮은 경우, intentDialog로 이동하자..
            let message = result;

            let card = messageAdapter(session, message);
            let msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
            var style = builder.ListStyle['button'];
            var option = session.localizer.gettext(session.preferredLocale(), 'choice_option');
            builder.Prompts.choice(session, '질문하신 내용에 대한 답변에 만족하시나요?', '네 | 아니요 ', { listStyle: style });
        });
    },
    function (session, results)
    {
        if (results.response && results.response.entity != '(quit)') {
            //고객 질의인 경우
            if (results.response.index == 0) {
                //entity = "intentFlightSearch";
                session.endDialog('메뉴로 이동합니다.');
            } else if (results.response.index == 1) {
                session.replaceDialog('/faq');
            }
            else {
                session.replaceDialog('/faq');
            }
        }

    }
]).matches('FAQ_PartnerService', [
    function(session, args, next) {
        console.log('CompesationProcess is called..');
        session.sendTyping();           //typing..
        //보상처리 절차 호출
        CommonHandler.processAction(Const.FAQ_PARTNER_SERVICE, session, null, (result) =>{

            //결과가 없거나, score가 낮은 경우, intentDialog로 이동하자..
            let message = result;

            let card = messageAdapter(session, message);
            let msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
            var style = builder.ListStyle['button'];
            var option = session.localizer.gettext(session.preferredLocale(), 'choice_option');
            builder.Prompts.choice(session, '질문하신 내용에 대한 답변에 만족하시나요?', '네 | 아니요 ', { listStyle: style });
        });
    },
    function (session, results)
    {
        if (results.response && results.response.entity != '(quit)') {
            //고객 질의인 경우
            if (results.response.index == 0) {
                //entity = "intentFlightSearch";
                session.endDialog('메뉴로 이동합니다.');
            } else if (results.response.index == 1) {
                session.replaceDialog('/faq');
            }
            else {
                session.replaceDialog('/faq');
            }
        }
    }
]).
onDefault(function(session) {
    console.log(">>>>>>>>>>>FlightIntent DefaultMessage <<<<<<<<<<<<<<<<");
    session.send('죄송합니다. 요청하신 내용을 이해하지 못했습니다. 메뉴로 이동합니다.');
    //session.replaceDialog('/intent');
    session.endDialog();
    //session.sendTyping();
});

//메시지를 파싱하여, 적절한 카드를 만들자.
let messageAdapter = (session, messageObj) => {

    /*{
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
    }*/
    if(messageObj.data == null)
    {
        let title = messageObj.hasOwnProperty('title') || '';
        let subtitle = messageObj.hasOwnProperty('subtitle') || '';
        let text = messageObj.displayText;

        return new builder.HeroCard(session)
            .title(title || '')
            .subtitle(subtitle || '')
            .text(text || '')
            .buttons([
                builder.CardAction.imBack(session, '메뉴', '메뉴 바로 가기')
            ]);
    }else {
        let message = messageObj.data.messageObj;
        if (!message.hasOwnProperty('type')) {
            //컨텐츠 내용을 보고 카드를 결정하자.
            //1. 컨텐츠 내용이 아무것도 없는 경우, 일반 메시지
            //2. 컨텐츠 내용이 있는 경우, HeroCard
            //3. 버튼 내용이 있는 경우, HeroCard + Button
            if (message.hasOwnProperty('contents')) {
                if (message.hasOwnProperty('buttons')) {
                    //HeroCard
                    //1. 버튼의 개수를 파악하자..
                    let buttonArray = [];
                    let text = message.message;
                    /*                for(let i in message.buttons)
                     {
                     let button = message.buttons[i];

                     let title = button.title;
                     let link = button.link.web_url;

                     let buttonObj = builder.CardAction.openUrl(session, link, title)
                     buttonArray.push(buttonObj);
                     }*/
                    for (let i in message.buttons) {
                        let button = message.buttons[i];

                        let title = button.text;
                        let value = button.value;

                        //let link = button.link.web_url;

                        let buttonObj = {
                            button: {
                                type: 'imback',
                                text: title,
                                value: value
                            }
                        }
                        buttonArray.push(buttonObj);
                    }

                    //buttonObject 생성
                    //watsonMsg['buttons'] = buttonArray;

                    let content = message.contents[0];

                    return new builder.HeroCard(session)
                        .title(content.title || '')
                        .subtitle(content.description || '')
                        .text(text || '')
                        .images([
                            builder.CardImage.create(session, content.image_url || '')
                        ])
                        .buttons([
                            builder.CardAction.openUrl(session, content.link.web_url, '확인하기'),
                            builder.CardAction.imBack(session, '메뉴', '메뉴 바로 가기')
                        ]);
                } else {
                    //HeroCard

                }
            } else {
                //일반 텍스트
            }
        }
    }
}


let createCard = (selectedCardName, session) => {
    switch (selectedCardName) {
        case HeroCardName:
            return createHeroCard(session);
        case ThumbnailCardName:
            return createThumbnailCard(session);
        case ReceiptCardName:
            return createReceiptCard(session);
        case SigninCardName:
            return createSigninCard(session);
        case AnimationCardName:
            return createAnimationCard(session);
        case VideoCardName:
            return createVideoCard(session);
        case AudioCardName:
            return createAudioCard(session);
        default:
            return createHeroCard(session);
    }
}

let createHeroCard = (session, obj) => {
    if(obj)
    {
        return new builder.HeroCard(session)
            .title(obj.cardTitle)
            .subtitle(obj.cardSubTitle)
            .text(obj.cardText)
            .images([
                builder.CardImage.create(session, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReSBzfmwO5kmdDawIn5etVlr_cbAdkfRwt3zXbo3dyr1wyJVNQDw')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'http://www.topasweb.com/main.do', 'Get Started')
            ]);
    }else
    {
        return new builder.HeroCard(session)
            .title('BotFramework Hero Card')
            .subtitle('Your bots — wherever your users are talking')
            .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
            .images([
                builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
            ]);
    }

}

let createThumbnailCard = (session) => {
    return new builder.ThumbnailCard(session)
        .title('BotFramework Thumbnail Card')
        .subtitle('Your bots — wherever your users are talking')
        .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
        .images([
            builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
        ]);
}
