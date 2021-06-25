export const PASS_PHARASE           = 'MoBiSale_Password@0123456789!*.*';
export const CHECK_SUM_KEY          = 'ftel-mobisale-cam';


export const RELEASE                = true;              // true: RELEASE  --- false: STAGING | DEBUG

// export const BASE_URL               = !RELEASE
//                                     ? 'https://sapi.fpt.vn/mobi-mobisaleglobalstag'     // STAGING
//                                     : 'https://sapi.fpt.vn/mobi-mobisaleglobal';        // RELEASE

export const BASE_URL               = 'https://sapi.fpt.vn/mobi-mobisaleglobal';  // edit 16/04/2021

export const KONG_AUTH              = 'Basic dGhhbmhkYzNAZnB0LmNvbS52bjoxMjM0NTY=';
export const KONG_REFRESH           = 50;                                               // thoi gian refresh kong token. tinh theo phut
export const URL_KONG_GET_TOKEN     = 'https://sapi.fpt.vn/token/GenerateToken';

export const INTERNET_ID            = { Id: 1, Name: 'Internet' };                      // option default chon internet o step 2: service type
export const EQUIP_ID               = { Id: 2, Name: 'Equipment' };
export const INTERNET_EQUIP_ID      = [{ Id: 1, Name: 'Internet' }, { Id: 2, Name: 'Equipment' }];

export const EXTRA_SER_ID           = { Id: 4, Name: 'Equipment' };                     // option default chon internet o step 2: service type (Ban them)
export const IP_MONTH               = { Value: 1, Name: '1M' };

export const SENDER_ID              = "177200803334";                                   //-> NOTIFICATION FIREBASE BEN ANH VU
