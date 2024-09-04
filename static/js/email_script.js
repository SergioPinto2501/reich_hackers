
send_email = [];
received_email = [];

document.getElementById("button-mail").addEventListener("click", function() {
    var dropdown = document.getElementById("emailDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    var phising = document.getElementById("phishingDropdown");
    if(phising.style.display === "block"){
        phising.style.display = "none";
    }
});
function showEmails(type) {
    document.getElementById("receivedEmails").style.display = type === "received" ? "block" : "none";
    document.getElementById("sentEmails").style.display = type === "sent" ? "block" : "none";

    var tabs = document.getElementsByClassName("email-tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    event.currentTarget.classList.add("active");

}
function updateMailIcon() {
    const mailIcon = document.getElementById('button-mail');
    let badge = mailIcon.querySelector('.notification-badge');

    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'notification-badge';
        badge.innerHTML = '!';
        mailIcon.appendChild(badge);
        badge.style.display = 'block';
    }else{
        badge.style.display = 'block';

    }
    setTimeout(() => {
        badge.style.display = 'none';
    }, 5000);


}
function insertSendEmail(){
    div = document.getElementById("sentEmails");
    div.innerHTML = "";
    if(send_email["emails"].length === 0){
        var emailDiv = document.createElement("div");
        emailDiv.className = "email-item";
        emailDiv.innerHTML = "<strong>Non ci sono email inviate</strong>";
        div.appendChild(emailDiv);
    }else {
        for (var i = 0; i < send_email["emails"].length; i++) {
            var email = send_email["emails"][i];
            var emailDiv = document.createElement("div");
            emailDiv.className = "email-item";
            emailDiv.innerHTML =
                "<strong>From: " + email['from'] + "</strong> <br>" +
                "<strong>To: " + email['to'] + "</strong><br>" +
                "<p> Oggeto: " + email['subject'] + "</p>" +
                "<p> Contenuto: " + email['body'] + "</p>";
            div.appendChild(emailDiv);
        }
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
async function getReceivedEmail() {
    try {
        const response = await fetch("/get_received_emails");
        const data = await response.text();
        if (data) {
            received_email = JSON.parse(data);
        } else {
            console.log("Error");
        }
    }catch (error) {
        console.error("Error fetching emails:", error);
    }
}
numberofEmails = 0;
function insertReceivedEmail(){
    div = document.getElementById("receivedEmails");
    div.innerHTML = "";
    if(received_email["emails"].length === 0){
        var emailDiv = document.createElement("div");
        emailDiv.className = "email-item";
        emailDiv.innerHTML = "<strong>Non ci sono email ricevute</strong>";
        div.appendChild(emailDiv);
    }else {
        if(received_email["emails"].length > numberofEmails){
            updateMailIcon();
            numberofEmails = received_email["emails"].length;
        }
        for (var i = 0; i < received_email["emails"].length; i++) {
            var email = received_email["emails"][i];
            var emailDiv = document.createElement("div");
            emailDiv.className = "email-item";
            emailDiv.innerHTML =
                "<strong>From: " + email['from'] + "</strong> <br>" +
                "<strong>To: " + email['to'] + "</strong><br>" +
                "<p> Oggeto: " + email['subject'] + "</p>" +
                "<p> Contenuto: " + email['body'] + "</p>";
            div.appendChild(emailDiv);
        }
    }
}

async function fetchAndInsertEmails() {
    await getSendEmail();
    insertSendEmail();
    await getReceivedEmail();
    insertReceivedEmail();
}

window.addEventListener('load', function() {
    fetchAndInsertEmails();
    const terminalElement = document.getElementById("terminal");
    const observer = new MutationObserver(handleVisibilityChange);
    observer.observe(terminalElement, { attributes: true });
});
function handleVisibilityChange(mutationsList) {
    for (let mutation of mutationsList) {
        if (mutation.attributeName === 'style') {
            const terminal = mutation.target;
            const isVisible = window.getComputedStyle(terminal).display !== 'none';
            if(!isVisible){
                fetchAndInsertEmails();
            }
        }
    }
}