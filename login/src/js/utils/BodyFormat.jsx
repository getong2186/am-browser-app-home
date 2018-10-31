
// 解析body数据格式
export function dealBodyFormat(body){
    let bodyStr = "";
    for(var key in body) {
        bodyStr += key+"="+body[key]+"&";
    }
    return bodyStr.substr(0, bodyStr.length-1);
}
