import express from 'express'
import path from 'path'
import rateLimit from 'express-rate-limit'

const app = express();
import fetch from 'node-fetch'

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "stat")))
app.use(express.json())


const apiLimiter = rateLimit({
    windowMs: 5000,
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,
})

app.use('/api', apiLimiter)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.post("/api/sched", (req, res) => {
    const token = req.body.token;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const day = req.body.day;
    const endpoint = req.body.endpoint;
    const interval = req.body.interval;

    if (!token || !fname || !lname || !day || !endpoint || !interval) return res.send({ error: true, message: "Invalid form body! (missing inputs)" });

    if (parseInt(interval) < 5000) return res.send({ error: true, message: "Invalid interval!" })

    var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    var regex = new RegExp(expression);

    if (!regex.test(endpoint)) return res.send({ error: true, message: "Invalid endpoint!" })


    console.log(`Fetching to endpoint ${endpoint}... \nDay: ${day} \nTeacher: ${fname} ${lname} \nInterval: ${interval} \nToken: ${token.slice(0, 8)}...`)
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
            "Referer": `${endpoint}`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `flex=${fname}%2C%20${lname}&day=${day}&period=1`,
        "method": "POST"
    })
        .then((data) => {
            return data.text()
        })
        .then((data) => {
            if (!data.includes("<!DOCTYPE html>")) console.dir(data)
            res.send({ error: false, message: data });
        })
        .catch((err) => {
            console.error(err);
            res.send({ error: true, message: err });
        })
})

app.get("/license", (req, res) => {
    res.sendFile(path.join(__dirname, "license.html"))
})

app.listen(80, () => {
    console.log("Server started.")
})