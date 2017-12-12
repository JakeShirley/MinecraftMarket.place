import axios from 'axios';

const sApiUrl = "http://minecraftmarketplaceproxy.azurewebsites.net/";

function createSearchBody(tags, skip, count) {
    let filterTagsQuery = "";
    for(let i = 0; i < tags.length; ++i) {
        filterTagsQuery += (i === 0 ? "and" : "or") + " (tags/any(t: t eq '" + tags[i] + "'))";
    }

    return {
        "count": true,
        "filter": {
            "filterQuery": "contentType eq 'MarketplaceDurableCatalog_V1.2'and platforms/any(p: p eq 'uwp.store')" + filterTagsQuery,
            "scids": [
                "4fc10100-5f7a-4470-899b-280835760c07"
            ]
        },
        "top": count,
        "skip": skip
    };
}

export function search(tags, callback) {
    axios.post(sApiUrl + "v1/catalog/items/search/", createSearchBody(tags, 0, 100),
        {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
        function (res) {
            if (res) {
                callback(res.data)
            }
        }).catch(function (err) {
            console.log(err);
        });
}
