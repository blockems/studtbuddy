document.addEventListener('DOMContentLoaded', function(){
    const newAccountButton = document.getElementById('newAccount');
    newAccountButton.addEventListener('click', function(){
        window.location.href = "/signup"
    })
})