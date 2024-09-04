
phishing_info = [];

document.getElementById("button-phishing").addEventListener("click", function() {
    var dropdown = document.getElementById("phishingDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    var email = document.getElementById("emailDropdown");
    if(email.style.display === "block"){
        email.style.display = "none";
    }
    check_if_somehome_is_victim();
});
function showPhishingData(type) {
    document.getElementById("phising-data").style.display = type === "received" ? "block" : "none";

    var tabs = document.getElementsByClassName("email-tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    event.currentTarget.classList.add("active");

}
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
function check_if_somehome_is_victim(){
    document.getElementById("phising-data").innerHTML = "";
    fetch("get_token_from_phishing/")
        .then(response => response.json())
        .then(data => {
            let length = Object.keys(data.info).length;
            if(length > 0){
                phishing_info = data.info;
                length = Object.keys(phishing_info).length;
                for (var i = 0; i < length; i++) {
                    var node_information = phishing_info[i];

                    div = document.createElement("div");
                    div.className = "phishing-item";
                    div.innerHTML = "<strong>[+]Vittima: </strong><br><p>" + node_information[1] + " " + node_information[0] + "</p> " +
                        "<strong>[+]Email: </strong><br><p>" + node_information[2] + "</p>" +
                        "<strong>[+]Token: </strong><br><p>" + node_information[3] + "</p>";
                    document.getElementById("phising-data").appendChild(div);
                }
            }else{
                var div = document.createElement("div");
                div.className = "phishing-item";
                div.innerHTML = "<strong>Non ci sono vittime</strong><br>";
                document.getElementById("phising-data").appendChild(div);
            }
        });
}