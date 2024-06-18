    // Inicializace soketové komunikace
const socket = io(); 
let name;  // Proměnná pro uchování jména uživatele
let lastTurn = document.getElementById("lastTurn");

// Skrytí určitých částí HTML při načítání stránky
document.getElementById("loading").style.display = "none";
document.getElementById("bigcont").style.display = "none";
document.getElementById("userCont").style.display = "none";
document.getElementById("oppNameCont").style.display = "none";
document.getElementById("valueCont").style.display = "none";
document.getElementById("whosTurn").style.display = "none";
//document.getElementById("lastTurn").style.display = "none";

// Přidání události kliknutí na tlačítko 'find'
document.getElementById('find').addEventListener("click", function () {
    name = document.getElementById("name").value;  // Získání jména z inputu
    document.getElementById("user").innerText = name;  // Nastavení jména v HTML
    if (name == null || name == '') {  // Ověření, zda bylo zadáno jméno
        alert("Please enter a name");  // Zobrazení upozornění, pokud jméno chybí
    } else {
        socket.emit("find", { name: name });  // Odeslání události "find" na server s jménem uživatele

        document.getElementById("loading").style.display = "block";  // Zobrazení načítacího prvku
        document.getElementById("find").disabled = true;  // Deaktivace tlačítka 'find'
    }
});

// Zpracování události "find" přijaté ze serveru
socket.on("find", (e) => {
    let allPlayersArray = e.allPlayers;  // Získání pole všech hráčů ze serveru
    console.log("html", allPlayersArray);  // Výpis pole do konzole

    if (name != '') {  // Kontrola, zda je jméno zadáno
        // Zobrazení a skrytí určitých částí HTML
        document.getElementById("userCont").style.display = "block";
        document.getElementById("oppNameCont").style.display = "block";
        document.getElementById("valueCont").style.display = "block";
        document.getElementById("loading").style.display = "none";
        document.getElementById("name").style.display = "none";
        document.getElementById("find").style.display = "none";
        document.getElementById("enterName").style.display = "none";
        document.getElementById("bigcont").style.display = "block";
        document.getElementById("whosTurn").style.display = "block";
        document.getElementById("whosTurn").innerText = "X's Turn";  // Nastavení textu "X's Turn"
    }

    let oppName;
    let value;
    

    // Vyhledání objektu hráče podle jména
    const foundObject = allPlayersArray.find(obj => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`);
    foundObject.p1.p1name == `${name}` ? oppName = foundObject.p2.p2name : oppName = foundObject.p1.p1name;
    foundObject.p1.p1name == `${name}` ? value = foundObject.p1.p1value : value = foundObject.p2.p2value;
    
    // Nastavení jména soupeře a hodnoty v HTML
    document.getElementById("oppName").innerText = oppName;
    document.getElementById("value").innerText = value;
    
});

// Přidání události kliknutí na tlačítka herního pole
document.querySelectorAll(".btn").forEach(e => {
    e.addEventListener("click", function () {
        
        let value = document.getElementById("value").innerText;  // Získání hodnoty (X nebo O)
        if(lastTurn.innerText==''|| lastTurn.innerText!= value){
        e.innerText = value;  // Nastavení hodnoty do kliknutého tlačítka
        console.log(value);
        


        socket.emit("playing", { value: value, id: e.id, name: name });  // Odeslání události "playing" na server
        }
    })
});

// Zpracování události "playing" přijaté ze serveru
socket.on("playing", (e) => {
    const foundObject = (e.allPlayers).find(obj => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`);

    p1id = foundObject.p1.p1move;
    p2id = foundObject.p2.p2move;
    
    // Nastavení textu "X's Turn" nebo "O's Turn" podle aktuálního stavu hry
    if ((foundObject.sum) % 2 == 0) {
        document.getElementById("whosTurn").innerText = "O's Turn";
        lastTurn.innerText="X";
    } else {
        document.getElementById("whosTurn").innerText = "X's Turn";
        lastTurn.innerText="O";
    }

    // Aktualizace herního pole podle tahů hráčů
    if (p1id != '') {
        document.getElementById(`${p1id}`).innerText = "X";
        document.getElementById(`${p1id}`).disabled = true;
        document.getElementById(`${p1id}`).style.color = "black";
    }
    if (p2id != '') {
        document.getElementById(`${p2id}`).innerText = "O";
        document.getElementById(`${p2id}`).disabled = true;
        document.getElementById(`${p2id}`).style.color = "black";
    }

    check(name, foundObject.sum);  // Volání funkce pro kontrolu vítězství nebo remízy
});

// Funkce pro kontrolu vítězství nebo remízy
function check(name, sum) {
    // Získání hodnot z herního pole
    document.getElementById("btn1").innerText == '' ? b1 = "a" : b1 = document.getElementById("btn1").innerText;
    document.getElementById("btn2").innerText == '' ? b2 = "b" : b2 = document.getElementById("btn2").innerText;
    document.getElementById("btn3").innerText == '' ? b3 = "c" : b3 = document.getElementById("btn3").innerText;
    document.getElementById("btn4").innerText == '' ? b4 = "d" : b4 = document.getElementById("btn4").innerText;
    document.getElementById("btn5").innerText == '' ? b5 = "e" : b5 = document.getElementById("btn5").innerText;
    document.getElementById("btn6").innerText == '' ? b6 = "f" : b6 = document.getElementById("btn6").innerText;
    document.getElementById("btn7").innerText == '' ? b7 = "g" : b7 = document.getElementById("btn7").innerText;
    document.getElementById("btn8").innerText == '' ? b8 = "h" : b8 = document.getElementById("btn8").innerText;
    document.getElementById("btn9").innerText == '' ? b9 = "i" : b9 = document.getElementById("btn9").innerText;

    // Kontrola vítězství podle herních pravidel
    if ((b1 == b2 && b2 == b3) || (b4 == b5 && b5 == b6) || (b7 == b8 && b8 == b9) || 
        (b1 == b4 && b4 == b7) || (b2 == b5 && b5 == b8) || (b3 == b6 && b6 == b9) || 
        (b1 == b5 && b5 == b9) || (b3 == b5 && b5 == b7)) {

        socket.emit("gameOver", { name: name })  // Odeslání události "gameOver" na server
        setTimeout(() => {
            sum % 2 == 0 ? alert("X WON !!") : alert("O WON !!")  // Zobrazení upozornění o vítězství
            setTimeout(() => {
                location.reload()  // Obnovení stránky
            }, 2000)
        }, 100)
    } else if (sum == 10) {  // Kontrola remízy
        socket.emit("gameOver", { name: name })  // Odeslání události "gameOver" na server
        setTimeout(() => {
            alert("DRAW!!")  // Zobrazení upozornění o remíze
            setTimeout(() => {
                location.reload()  // Obnovení stránky
            }, 2000)
        }, 100)
    }
}