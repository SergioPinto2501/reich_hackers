
send_email = [];

document.getElementById("button-mail").addEventListener("click", function() {

    var dropdown = document.getElementById("emailDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});
function showEmails(type) {
    document.getElementById("receivedEmails").style.display = type === "received" ? "block" : "none";
    document.getElementById("sentEmails").style.display = type === "sent" ? "block" : "none";

    var tabs = document.getElementsByClassName("email-tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    event.currentTarget.classList.add("active");

    // Simulate new email detection
    if (type === "received") {
        updateMailIcon();
    }
}
function updateMailIcon() {
    const mailIcon = document.getElementById('button-mail');
    let badge = mailIcon.querySelector('.notification-badge');

    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'notification-badge';
        mailIcon.appendChild(badge);
    }
}
function insertSendEmail(){
    div = document.getElementById("sentEmails");
    div.innerHTML = "";
    for (var i = 0; i < send_email["emails"].length; i++) {
        var email = send_email["emails"][i];
        var emailDiv = document.createElement("div");
        emailDiv.className = "email-item";
        emailDiv.innerHTML =
            "<strong>From: " + email['from'] + "</strong> <br>" +
            "<strong>To: " + email['to'] + "</strong><br>" +
            "<p> Oggeto: " + email['subject'] + "</p>" +
            "<p> Contenuto: " + email['body'] + "</p>";
        console.log(emailDiv);
        div.appendChild(emailDiv);
    }
}
async function getSendEmail() {
    try {
        const response = await fetch("/get_send_emails");
        const data = await response.text();
        if (data) {
            send_email = JSON.parse(data);
        } else {
            console.log("Error");
        }
    } catch (error) {
        console.error("Error fetching emails:", error);
    }
}

async function fetchAndInsertEmails() {
    await getSendEmail();
    insertSendEmail();
}

window.addEventListener('load', function() {
    fetchAndInsertEmails();
});
document.getElementById("button-mail").addEventListener("click", function() {
    var dropdown = document.getElementById("emailDropdown")
    dropdown.style.display === "block" ? "none" : "block";
});

