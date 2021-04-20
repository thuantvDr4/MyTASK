/**
 * - Regex Filter
 * @author ThuanDD3
 * @date June, 2019
 */

/**
 * Trim long text
 * @value string
 * @return replace all special character except number
 */
export function trimLongText(str) {

    let rep = str.length > 35 ? `${str.substring(0, 35)}...` : str;
    return rep;
}

/**
 * Convert Number
 * @value string
 * @return replace all special character except number
 */
export function convertPhone(str) {
	return str.replace(/[^\x00-\x7F]|\D|\r|\n|\\|\s/g, '');
}

/**
 * Convert Number (Number - String)
 * @value string
 * @return replace all special character except number
 */
export function removeAllcharINstring(str) {
    let str_ = str.toString();
	return str_.replace(/[^\x00-\x7F]|\D|\r|\n|\\|\s/g, '');
}

/**
 * Detect if string all white space
 * @value string
 * @return replace all white space to empty
 */
export function convertWhiteSpace(str) {
	return str.replace(/^\s\s*/, '').replace(/\s+$/, '');
}

/**
 * Detect if string all white space
 * @value string
 * @return replace all white space to empty
 */
export function convertWhiteSpaceNum(str) {
    let str_ = str.toString();
	return str_.replace(/^\s\s*/, '').replace(/\s+$/, '');
}

/**
 * Find char in String
 * @value string
 * @return string after find follow model char
 */
export function findCharInString(str) {

    let result = '';
    let allowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%()-{}:=@,.";
    
    str.split('').forEach(char => {
        if (allowLetters.includes(char)) {
            result += char;
        }
    });

	return result;
}

// -----------------------------------
/**
 * Remove: All char, whitespace, breakline, special char except - number
 * @param {*} str 
 * @return string number
 */
export function removeAllchar_type_01(str) {
    let str_ = str.toString();
	return str_.replace(/[^\x00-\x7F]|\D|\r|\n|\\|\s/g, '');
}

/**
 * Remove: All char, whitespace, brekline except - dot, number
 * @param {*} str 
 * @return string number and dot
 */
export function removeAllchar_type_02(str) {
    let str_ = str.toString();
    str_ = str_.replace(/[^\x00-\x7F]|[^0-9.]|\r|\n|\\|\s/g, '');
    
    return str_;
}