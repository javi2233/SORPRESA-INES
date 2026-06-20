function normalizeText(text){
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
}
function getSolved(){ return JSON.parse(localStorage.getItem("solvedTests") || "[]"); }
function setSolved(arr){ localStorage.setItem("solvedTests", JSON.stringify(arr)); }
function checkChallenge(index, answer){
    const input = document.getElementById("answer");
    const feedback = document.getElementById("feedback");
    if(normalizeText(input.value) === normalizeText(answer)){
        const solved = getSolved();
        if(!solved.includes(index)) solved.push(index);
        setSolved(solved);
        feedback.innerHTML = `<span class="ok">Correcto. Llave ${index+1} conseguida ❤️</span>`;
        setTimeout(()=>{ window.location.href = "index.html"; }, 1200);
    } else {
        feedback.innerHTML = `<span class="error">No es esa... prueba otra vez ❤️</span>`;
    }
}
