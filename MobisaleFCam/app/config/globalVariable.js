export default class GlobalVariable
{
    static kong_token = null;
    static kong_time = null;
    static device_imei = '';
    static ftel_mobisalecam_header = '';
    static isLogin = false; // Danh dau cho network biet khong can phai navigate khi code -1 o man hinh login
    static isLoged = false; // Danh dau cho notifi biet trang thai da login roi chua, de login roi moi route theo noti hoac khong
    static isOpenApp = true; // 
    static isBackLogin = false;
    static isRememberPass = false;

    // Cau hinh upload
    static UPLOAD_IMAGE_URL = 'https://sapi.fpt.vn/systemapitest/api/ImageManagermentGlobal/Upload';
    static DOWNLOAD_IMAGE_URL = 'https://sapi.fpt.vn/systemapitest/api/ImageManagermentGlobal/Download';
    static UPLOAD_IMAGE_TOKEN = '25F012B015861574B08EAD4F1CEDB8C0';
    static UPLOAD_SOURCE = 2; // Source danh dau cua FCAM
    static UPLOAD_TYPE_CONTRACT = 2;
    static UPLOAD_TYPE_TTKH = 3;

    // Get System Api Token
    static SYS_TOKEN = 'https://sapi.fpt.vn/mobi-mobisaleglobalstag/User/GetSystemApiToken'
    
    /**
     * Set thong tin upload
     * 
     * @param {*} configs 
     */
    static setUploadConfig(configs)
    {
        this.UPLOAD_IMAGE_URL   = configs.UploadImageUrl;
        this.DOWNLOAD_IMAGE_URL = configs.DownloadImageUrl;
        this.UPLOAD_IMAGE_TOKEN = configs.UploadImageToken;
        this.UPLOAD_SOURCE      = configs.UploadSource || 2;

        this.UPLOAD_TYPE_CONTRACT = configs.UploadTypeContract;
        this.UPLOAD_TYPE_TTKH     = configs.UploadTypeTTKH;
    }
}