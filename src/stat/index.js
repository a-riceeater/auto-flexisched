let exit = false;
let postInterval;
const endBtn = document.getElementById('end');

document.getElementById("submit").addEventListener("click", (e) => {
    if (!e.isTrusted) return;
    exit = false;

    try {
        clearInterval(postInterval);
    } catch (e) {

    }

    wl("System: $ Starting...", "finish")

    setTimeout(() => {
        document.querySelectorAll("input").forEach(input => {
            if (exit) return;
            if (input.value.trim().replaceAll(" ", "") == "") return throwEmpty()
        })

        var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        var regex = new RegExp(expression);

        const endpoint = document.getElementById("endpoint").value;

        if (!regex.test(endpoint)) {
            exit = true;

            wl("Error: $ Invalid endpoint!", "error")

            finish()
            return;
        }

        const fname = document.getElementById("teacher_fname").value;
        const lname = document.getElementById("teacher_lname").value;

        const day = document.getElementById("day").value;
        const interval = document.getElementById("interval").value;

        const token = document.getElementById("token").value;

        if (parseInt(interval) < 5000) {
            exit = true;
            wl("Error: $ Too low interval!", "error")
            finish()
            return;
        }

        if (day < 1 || day > 2) {
            exit = true;
            wl("Error: $ Invalid day! (1/2)", "error");
            finish();
            return;
        }

        endBtn.style.opacity = 1;
        endBtn.style.cursor = "pointer"
        endBtn.disabled = false;

        postInterval = setInterval(() => {
            fetch("/api/sched", {
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    fname: fname,
                    lname: lname,
                    day: day,
                    endpoint: endpoint,
                    interval: interval
                }),
                method: 'POST'
            })
                .then((d) => { return d.json() })
                .then((data) => {
                    if (data.error) {
                        wl("Error: $ " + data.message, "error")
                    } else {
                        if (data.message.includes("<!DOCTYPE html>")) {
                            wl("Error: $ Invalid token!", "error")
                            exit = true;
                            clearInterval(postInterval)
                            endBtn.style.opacity = 0.5;
                            endBtn.style.cursor = "not-allowed";
                            endBtn.disabled = true;
                            finish()

                            return;
                        } else {
                            wl("Response: $ " + data.message);
                        }
                    }
                })
        }, parseInt(interval))
    }, 200)
})

function throwEmpty() {
    exit = true;

    wl("Error: $ All inputs required!", "error")
    finish()
}

function finish() {
    wl("Exited.", "finish")
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keydown", (e) => {
        if (e.key === " ") e.preventDefault()
    })
})

function wl(l, t) {
    const m = document.createElement("p")
    m.innerText = l;

    switch (t) {
        case "error":
            m.classList.add("res-error")
            break;
        case "finish":
            m.classList.add("res-finished")
            break;
    }

    document.getElementById("response-output").appendChild(m)
    document.getElementById("response-output").scrollBottom()
}

endBtn.addEventListener("click", (e) => {
    console.log("c")
    if (!e.isTrusted) return;
    console.log("cc")

    if (endBtn.disabled == true) return
    console.log("ccc")

    clearInterval(postInterval)

    endBtn.style.opacity = 0.5;
    endBtn.style.cursor = "not-allowed";
    endBtn.disabled = true;

    finish()
    exit = false;
})