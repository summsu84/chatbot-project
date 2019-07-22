/**
 * Created by JJW on 2017-11-01,
 */

const endpoint = 'http://www.hanjin.co.kr/Delivery_html/inquiry/result_waybill.jsp?wbl_num=';
var Const = require('../util/const');
const request = require('request');
const cheerio = require('cheerio');
//iconv
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('euc-kr', 'utf-8//translit//ignore');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const Common = require('../util/common');



//현재 위치 주변의 장소를 검색 하는 로직
var SearchService = {

    execute : (params, onSuccess, onError) => {

        let number = params;

        const options = {
            url: endpoint + number,
            headers: {
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
                'Upgrade-Insecure-Requests' : '1',
                'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Host':'www.hanjin.co.kr'
            },
            method: 'GET',
            encoding:null,
            gzip : true
        };

        request(options, (error, response, body) => {
            if (error) {
                console.error(error);
                if (onError)
                    onError(err, null);
            } else if (response.statusCode !== 200) {
                console.error(body);
            } else {
                //성공인 경우..
                parsingResultWaybill(body, (result)=>{
                    result['way_number'] = number;
                    if (onSuccess) {
                        onSuccess( result)
                    }
                }, (msg) => {
                    onError (null, Const.responsecodeNotFoundWaybil, msg);
                })
            }

        });

    }
}

/**
 *  예약번호 상태 확인 -- 개발 중
 * @param body
 * @param callback
 */
let parsingResultWaybill = (body, callback, onError) =>
{

    let tmpData = iconv.convert(body).toString();
    let $ = cheerio.load(tmpData);
    let prname;
    let status;
    let resultTable = $('table');

    //resulttable 길이를 체크하여, 운송장 번호 체크 한다.
    if(resultTable.length == 0)
    {
        //callback 처리
        onError('죄송합니다. 고객님께서 입력하신 운송작업 내역을 찾을 수 없습니다. 입력하신 내용을 다시 확인 해주세요.');
    }else {
        //아래 each 함수에서 this가 안먹힘..
        resultTable.each((i) => {
            //let table = $(this);
            let table = resultTable[i];
            let pi = i;
            if (pi == 0) {
                let td = $(table).find('tbody tr td');
                td.each(function (j) {
                    let ctd = td[j];
                    if (pi == 0) {
                        if (j == 1) {
                            //productname
                            prname = $(ctd)[0].children[0].data;
                        }
                    }
                });
            } else if (pi == 1) {
                let tr = $(table).find('tbody tr');
                let trLength = tr.length;
                status = tr[trLength - 1].children[1].children[0].children[0].data;
            }

        })

        callback(
            {
                product_name: Common.removeSpace(prname),
                product_status: Common.removeSpace(status)
            }
        )
    }
}

module["exports"] = SearchService;