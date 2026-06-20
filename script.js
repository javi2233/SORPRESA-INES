// =============================
// CONFIGURACIÓN: CAMBIA ESTO
// =============================
const tripDate = new Date("2026-07-10T17:00:00");

const tests = [
    { title:"Primera llave", unlockDate:new Date("2026-06-24T20:00:00"), page:"prueba1.html" },
    { title:"Segunda llave", unlockDate:new Date("2026-06-27T20:00:00"), page:"prueba2.html" },
    { title:"Tercera llave", unlockDate:new Date("2026-07-01T20:00:00"), page:"prueba3.html" },
    { title:"Cuarta llave", unlockDate:new Date("2026-07-04T20:00:00"), page:"prueba4.html" },
    { title:"Quinta llave", unlockDate:new Date("2026-07-08T20:00:00"), page:"prueba5.html" },
    { title:"Sexta llave", unlockDate:new Date("2026-07-10T15:00:00"), page:"prueba6.html" }
];

function getSolved(){ return JSON.parse(localStorage.getItem("solvedTests") || "[]"); }
function setSolved(arr){ localStorage.setItem("solvedTests", JSON.stringify(arr)); }

function formatCountdown(diff){
    if(diff <= 0) return "Disponible ahora";
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24))/(1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60))/(1000*60));
    const seconds = Math.floor((diff % (1000*60))/1000);
    return `${days} días · ${hours} h · ${minutes} min · ${seconds} s`;
}

function updateCountdowns(){
    const now = new Date();
    document.getElementById("tripCountdown").innerHTML = formatCountdown(tripDate - now);

    const next = tests
        .filter(t => t.unlockDate > now)
        .sort((a,b)=>a.unlockDate-b.unlockDate)[0];

    document.getElementById("nextCountdown").innerHTML =
        next ? formatCountdown(next.unlockDate - now) : "Todas las pruebas están disponibles";
}

function renderKeys(){
    const solved = getSolved();
    const box = document.getElementById("keys");
    box.innerHTML = "";

    tests.forEach((_,i)=>{
        const div = document.createElement("div");
        div.className = "key" + (solved.includes(i) ? " done" : "");
        div.innerHTML = solved.includes(i) ? "🗝️" : "🔒";
        box.appendChild(div);
    });

    document.getElementById("progressText").innerHTML = `${solved.length} de ${tests.length} llaves conseguidas`;
}

function renderTests(){
    const now = new Date();
    const solved = getSolved();
    const container = document.getElementById("tests");
    container.innerHTML = "";

    tests.forEach((test,i)=>{
        const available = test.unlockDate <= now;
        const isSolved = solved.includes(i);
        const div = document.createElement("div");
        div.className = "test" + (!available ? " locked" : "") + (isSolved ? " done" : "");

        if(isSolved){
            div.innerHTML = `
                <div class="lock-icon">🗝️</div>
                <span class="badge done-badge">Superada</span>
                <h3>${test.title}</h3>
                <p class="ok">Llave ${i+1} conseguida. Esta parte de la misión ya está completada.</p>
            `;
        } else if(!available){
            div.innerHTML = `
                <div class="lock-icon">🔒</div>
                <span class="badge locked-badge">Bloqueada</span>
                <h3>${test.title}</h3>
                <p>Disponible el ${test.unlockDate.toLocaleDateString("es-ES")} a las ${test.unlockDate.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}.</p>
                <a class="button-link disabled-link">Aún no disponible</a>
            `;
        } else {
            div.innerHTML = `
                <div class="lock-icon">🔐</div>
                <span class="badge">Disponible</span>
                <h3>${test.title}</h3>
                <p>La prueba ya está abierta. Entra, resuélvela y escribe la contraseña al final.</p>
                <a class="button-link" href="${test.page}">Entrar a la prueba</a>
            `;
        }
        container.appendChild(div);
    });

    updateFinalState();
}

function updateFinalState(){
    const solved = getSolved();
    const finalBox = document.getElementById("finalBox");
    const finalText = document.getElementById("finalText");

    if(solved.length >= tests.length){
        finalBox.classList.remove("locked");
        finalText.innerHTML = "Has conseguido todas las llaves. Ya puedes descubrir la sorpresa ❤️";
    } else {
        finalBox.classList.add("locked");
        finalText.innerHTML = `Todavía necesitas ${tests.length - solved.length} llave(s) para descubrir lo que he preparado para ti ❤️`;
    }
}

function tryReveal(){
    const solved = getSolved();
    if(solved.length >= tests.length){
        document.getElementById("reveal").style.display = "block";
        document.getElementById("finalButton").style.display = "none";
    } else {
        alert("Aún faltan llaves por conseguir ❤️");
    }
}

function refresh(){
    updateCountdowns();
    renderKeys();
    renderTests();
}

refresh();
setInterval(updateCountdowns,1000);
setInterval(renderTests,30000);
