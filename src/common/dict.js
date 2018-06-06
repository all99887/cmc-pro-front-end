import util from "~/common/util";
import axios from 'axios'

let dictCode = {}

function getCodeData(type) {
    // if (util.isEmptyObject(dictCode) || type === 'reload') {
        axios.post('/common/dictList.do', {}).then(response =>  {
            if(response.data.success){
                let codes = response.data.dict
                dictCode = codes ? codes : {}
                if (typeof window.localStorage !== 'undefined') {
                    sessionStorage.setItem('_dictCode', JSON.stringify(dictCode))
                }
            }
        }).catch(response => {
            console.log(response);
        });
    // }
}

// function getCode(codeName) {
//     if (util.isEmptyObject(dictCode)) {
//         if (typeof window.localStorage !== 'undefined') {
//             dictCode = JSON.parse(sessionStorage.getItem('_dictCode'))
//         }
//     }
//     return dictCode[codeName]
// }

function getCodeItems(codeName) {
    if (util.isEmptyObject(dictCode)) {
        if (typeof window.localStorage !== 'undefined') {
            dictCode = JSON.parse(sessionStorage.getItem('_dictCode'))
        }
    }
    var [...items] = dictCode[codeName] ? dictCode[codeName]:[]
    return items
}

function rendCode (codeName, codeVal) {
    if (util.isEmptyObject(dictCode)) {
        if (typeof window.localStorage !== 'undefined') {
            dictCode = JSON.parse(sessionStorage.getItem('_dictCode'))
        }
    }
    var items = dictCode[codeName] ? dictCode[codeName]:[]
    codeVal = codeVal + ''
    for (var i = 0 ; i < items.length; i++) {
        if (items[i].value === codeVal) {
            return items[i].label
        }
    }
    return codeVal
}

export default {
    getCodeData: getCodeData,
    rendCode: rendCode,
    getCodeItems: getCodeItems,
    // // getCodeItemsCb: getCodeItemsCb,
    // getCode: getCode,
    // rendDatetime: rendDatetime
}
