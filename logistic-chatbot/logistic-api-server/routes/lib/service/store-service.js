/**
 * Created by JJW on 2017-07-14.
 */

var Const = require('../util/const');
const request = require('request');
//iconv
var Iconv = require('iconv').Iconv;
var iconv = new Iconv('euc-kr', 'utf-8//translit//ignore');


//현재 위치 주변의 장소를 검색 하는 로직
var StoreSearchService = {

    execute : (params, onSuccess, onError) => {

        var host = 'https://www.hanjin.co.kr/Delivery_html/store/domestic.jsp';
        //var kbUrl = '/knowledgebases/' + kbKey + '/generateAnswer'

/*
        const requestData = {
            url: host,
            headers: {
                'content-type': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            },
            method: 'POST',
            json: {
                "question": params.query
            }
        };
*/

        var options = { method: 'POST',
            url: 'https://www.hanjin.co.kr/Delivery_html/store/domestic.jsp',
            headers:
            {
                'Host': 'www.hanjin.co.kr',
                'Connection': 'keep-alive',
                'Content-Length': '30',
                'Cache-Control': 'max-age=0',
                'Origin':'https://www.hanjin.co.kr',
                'Upgrade-Insecure-Requests': '1',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                 'Referer': 'https://www.hanjin.co.kr/Delivery_html/store/domestic.jsp',
                 'Accept-Encoding': 'gzip, deflate, br',
                 'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4',
                 'Cookie': 'JSESSIONID=_fFcZAdHvKW4ZP9MNT4ctErkpuE3zfS0K-uRuqZd-86pEAoXc-EB!366309619'

            },
            form: {
                gbn: 'dong',
                org_dong: '%B0%AD%B3%B2'
            },
            encoding:null
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var tmpData = iconv.convert(body).toString();
            console.log(tmpData);
        });

        /*
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

        });*/

    }
}

module["exports"] = StoreSearchService;