let form = document.getElementById('lobby__form')

let displayName = sessionStorage.getItem('display_name')
if(displayName){
    form.name.value = displayName
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    sessionStorage.setItem('display_name', e.target.name.value)

    window.location = "room.html?room=readinghall"
})

document.getElementById("private__button").addEventListener("click", function(event) {
    // Prevent default form submission behavior
    event.preventDefault();
    
    // Redirect user to lobby.html page
    window.location.href = "lobby.html";
});