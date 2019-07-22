(function(global) {
    "use strict;"

    // Class ------------------------------------------------
    var Const = {};

    Const.httpCodeSucceed = 200;
    Const.httpCodeFileNotFound = 404;
    Const.httpCodeSeverError = 500;
    Const.httpCodeAuthError = 503;

    Const.responsecodeSucceed = 1;

    Const.responsecodeNotFoundWaybil = 2;

    Const.resCodeLoginNoName = 1000001;
    Const.resCodeLoginNoRoomID = 1000002;
    Const.resCodeLoginNoUserID = 1000003;
    Const.resCodeUserListNoRoomID = 1000004;
    Const.resCodeMessageListNoRoomID = 1000005;
    Const.resCodeMessageListNoLastMessageID = 1000006;
    Const.resCodeSendMessageNoFile = 1000007;
    Const.resCodeSendMessageNoRoomID = 1000008;
    Const.resCodeSendMessageNoUserID = 1000009;
    Const.resCodeSendMessageNoType = 1000010;
    Const.resCodeFileUploadNoFile = 1000011;

    Const.resCodeSocketUnknownError = 1000012;
    Const.resCodeSocketDeleteMessageNoUserID = 1000013;
    Const.resCodeSocketDeleteMessageNoMessageID = 1000014;
    Const.resCodeSocketSendMessageNoRoomID = 1000015;
    Const.resCodeSocketSendMessageNoUserId = 1000016;
    Const.resCodeSocketSendMessageNoType = 1000017;
    Const.resCodeSocketSendMessageNoMessage = 1000018;
    Const.resCodeSocketSendMessageNoLocation = 1000019;
    Const.resCodeSocketSendMessageFail = 1000020;

    Const.resCodeSocketTypingNoUserID = 1000021;
    Const.resCodeSocketTypingNoRoomID = 1000022;
    Const.resCodeSocketTypingNoType = 1000023;
    Const.resCodeSocketTypingFaild = 1000024;

    Const.resCodeSocketLoginNoUserID = 1000025;
    Const.resCodeSocketLoginNoRoomID = 1000026;

    Const.resCodeTokenError = 1000027;

    Const.resCodeStickerListFailed = 1000028;

    Const.responsecodeParamError = 2001;
    Const.responsecodeTokenError = 2100;

    Const.messageTypeText = 1;
    Const.messageTypeFile = 2;
    Const.messageTypeLocation = 3;
    Const.messageTypeContact = 4;
    Const.messageTypeSticker = 5;

    Const.messageNewUser = 1000;
    Const.messageUserLeave = 1001;

    Const.typingOn = 1;
    Const.typingOff = 0;

    Const.pagingLimit = 50;

    Const.FAQ_INTRO = 100000
    Const.FAQ_NORMAL = 10010
    Const.FAQ_COMPENSATION_PROCESS = 10020;
    Const.FAQ_CUSTOMER_CENTER = 10030;
    Const.FAQ_LOGISTIC_POLICY = 10040;
    Const.FAQ_PARTNER_SERVICE = 10050;
    Const.FAQ_STORE_OPEN = 10060;
    Const.FAQ_INTERNATIONAL_LOGISTIC = 10070;
    Const.FAQ_CASH_INVOICE =10080;
    Const.WELCOME =11000;
    Const.STORE_SEARCH = 12000;

    Const.SEARCH_WAYBILL = 20000;
    Const.SEARCH_WAYBILL_WITH_TOKEN = 20001;


    Const.MSG_RESPONSE_FAQ_COMPENSATION = '보상처리 절차입니다. 운송장 번호 확인 후 해당 배송원 또는 대리점에 클레임 발생 전화 이후 보상 처리가 완료됩니다. 좀더 자세한 정보를 원하시면 아래 링크를 클릭 해주세요.';
    Const.MSG_RESPONSE_FAQ_CUSTOMER_SERVICE = '개인택배예약 : 1544-0011\n 반품 및 배송조회 : 1588-0011 \n 국제특송 : 1588-1612 \n(운영시간은 평일 09:00 ~ 18:00, 토요일 09:00 ~ 13:00 입니다). 좀더 자세한 정보를 원하시면 아래 링크를 클릭 해주세요';
    Const.MSG_RESPONSE_FAQ_PARTNER_SERVICE = '대한항공 스카이패스 회원을 대상으로 마일리지를 적립해드립니다. 국내택배의 경우 1박스당 5000원 이상 운송료를 선불로 하신 개인공객에게 1박스당 50마일을 적립해드리며, 국제특송의 경우 1건당 50,000원 이상 운송료를 지불하신 고객에게 마일리지를 적립해드립니다. 좀더 자세한 정보를 원하시면 아래 링크를 클릭 해주세요';
    Const.MSG_RESPONSE_FAQ_LOGISTIC_POLICY = '예약에서 배달 까지 원콜 서비스로 모시겠습니다.';
    Const.MSG_RESPONSE_FAQ_INTERNATIONAL_LOGISTIC = '국제특송 문의처는 한국 1599-1612, 일본 81-3-5767-7745 이며, 좀더 자세한 정보를 원하시면 아래 링크를 클릭 해주세요';


    Const.MSG_RESPONSE_SEARCH_WAYBILL = '배송조회 결과입니다.';




    // Exports ----------------------------------------------
    module["exports"] = Const;
    //module["exports"] = TestData;

})((this || 0).self || global);
