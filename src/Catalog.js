import axios from 'axios';

const sApiUrl = "http://127.0.0.1/";

const searchBody = {
    "count": true,
    "filter": {
        "filterQuery": "contentType eq 'MarketplaceDurableCatalog_V1.2'and platforms/any(p: p eq 'uwp.store') and (tags/any(t: t eq 'mashup') or tags/any(t: t eq 'worldtemplate'))",
        "scids": [
            "4fc10100-5f7a-4470-899b-280835760c07"
        ]
    },
    "orderBy": {
        "field": "creationDate",
        "orderByDirection": "ASC"
    },
    "top": 25
};

export function search(callback) {
    axios.post(sApiUrl + "v1/catalog/items/search/", searchBody,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
        function (res) {
            if (res) { 
                callback(res.data.results) 
            }
        }).catch(function(err) {
            console.log(err);
        });
}
