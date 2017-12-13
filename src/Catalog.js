import axios from 'axios';

const sApiUrl = "https://mcjakefunction.azurewebsites.net/api/HttpTriggerJS1?code=cakYK6Z5NZg7r9TMNMQvzN/ef8T9qsoYkwJEYkVxJTBzMX46sMblYA==";

function createSearchBody(tags, skip, count, searchTerm) {
    let filterTagsQuery = "";
    for(let i = 0; i < tags.length; ++i) {
        filterTagsQuery += (i === 0 ? "and" : "or") + " (tags/any(t: t eq '" + tags[i] + "'))";
    }

    let result = {
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

    if(searchTerm) {
        result.search = searchTerm;
        result.searchfields = [
            "title",
            "description"
        ];
    }

    return result;
}

export function search(tags, searchTerm, callback) {
    axios.post(sApiUrl, createSearchBody(tags, 0, 100, searchTerm),
        {
            headers: {
                "Content-Type": "application/json",
                "xforge_endpoint": "/v1/catalog/items/search/"
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
