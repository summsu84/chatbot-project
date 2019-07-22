/**
 * Created by JJW on 2017-07-14.
 */

const kbKey = '[kb-key]';
const subscriptionKey= '[subscription-key]';
var Const = require('../util/const');
const request = require('request');


//현재 위치 주변의 장소를 검색 하는 로직
var FAQService = {

    execute : (params, onSuccess, onError) => {

        var host = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0';
        var kbUrl = '/knowledgebases/' + kbKey + '/generateAnswer'

        const requestData = {
            url: host + kbUrl,
            headers: {
                'content-type': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            },
            method: 'POST',
            json: {
                "question": params.query
            }
        };

        request.post(requestData, (error, response, body) => {
            if (error) {
                console.error(error);
                if (onError)
                    onError(err, null);
            } else if (response.statusCode !== 200) {
                console.error(body);
            } else {
                //Anser 결과 값
                let answers = body.answers;
                let answer;
                if(answers.length > 0)
                {
                    answer = answers[0];
                }
                if (onSuccess) {
                    onSuccess( answer)
                }


            }

        });

    }
}

module["exports"] = FAQService;