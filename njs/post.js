const token = require("prompt-sync")()("Token: ")

fetch("https://hpms.flexisched.net/clickToSched.php", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": `flexisched_session_id=${token}`,
    "Referer": "https://hpms.flexisched.net/dashboard.php",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "flex=Dandrea%2C%20Patrick&day=1&period=1",
  "method": "POST"
})
    .then((data) => {
        return data.text()
    })
    .then((data) => {
        console.dir(data)
    })
    .catch((err) => {
        console.error(err);
    })

// possible require to remove sec-fetch-mde and sec-fetch-site