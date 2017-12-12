import axios from 'axios';

const sApiUrl = "http://minecraftmarketplaceproxy.azurewebsites.net/";

const searchBody = {
    "count": true,
    "filter": {
        "filterQuery": "contentType eq 'MarketplaceDurableCatalog_V1.2'and platforms/any(p: p eq 'uwp.store') and (tags/all(t: t ne 'realms'))",
        "scids": [
            "4fc10100-5f7a-4470-899b-280835760c07"
        ]
    },
    "orderBy": {
        "field": "creationDate",
        "orderByDirection": "ASC"
    },
    "top": 75
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
