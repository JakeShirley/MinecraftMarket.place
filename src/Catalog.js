import axios from 'axios';

const sApiUrl = "https://xforge.xboxlive.com/";

const searchBody = {
    "count": true,
    "filter": {
        "filterQuery": "contentType eq 'MarketplaceDurableCatalog_V1.2'and platforms/any(p: p eq 'uwp.store')",
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
    axios.post(sApiUrl + "v1/catalog/items/search/",
        {
            body: searchBody,
            json: true
        }).then(
        function (res) {
            if (res) { return console.log(res); }
        });
}
