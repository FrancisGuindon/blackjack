/*
    Nom : Francis Guindon
    Date : 07/03/2019
    Code permanent : GUIF04049903
    But : Programmer un jeu BlackJack.
    test git
*/

// #region Initialisation
var btnJouer = document.getElementById("btnJouer");
var miser = document.getElementById("miser");
var btnRester = document.getElementById("btnRester");
var btnTirer = document.getElementById("btnTirer");
var miseSpan = document.getElementById("miseSpan");
var nomSPAN = document.getElementById("nom");

var argent = 1000;
var argentMise = 0;

miser.style.visibility = "hidden";
btnRester.style.visibility = "hidden";
btnTirer.style.visibility = "hidden";

var argentH2 = document.getElementById("argent");


argentH2.innerText = "ARGENT : " + argent + " $";

var tabCartes = new Array();
var cartesJoueurs = new Array();
var cartesCroupier = new Array();

var carteTireesJ = 0;
var carteTireesC = 0;

var blackjackJ = false; // 2 Booléens pour déterminer si le joueur ou le croupier
var blackjackC = false; // ont des blackjack.

var pointsJ = 0;
var pointsC = 0;


// #endregion



// #region Fonction initialiserJeu
function initialiserJeu() {
    nom = GetCookie("nom"); // Lire cookie Nom.
    argent = GetCookie("argent"); // Lire cookie Argent.
    if (argent == null && nom == null) {
        setCookie(); // Écrire cookie, si nécessaire.
    }

    initialiserCartes();

    nomSPAN.innerText = nom;
    argentH2.innerText = "ARGENT : " + argent + " $";
}

function initialiserCartes() {
    for (var i = 1; i <= 51; i++) {
        tabCartes[i] = i;
    }
    return tabCartes;
}
// #endregion

function Jouer() {
    // #region Remise à zero
    document.getElementById("zoneCroupier").remove();
    document.getElementById("zoneJoueur").remove();

    var divJoueur = document.createElement("div");
    divJoueur.setAttribute("id", "zoneJoueur");
    document.getElementById("fdsJoueur").appendChild(divJoueur);

    var divCroupier = document.createElement("div");
    divCroupier.setAttribute("id", "zoneCroupier");
    document.getElementById("fdsCroupier").appendChild(divCroupier);

    miseSpan.innerText = "- $";

    pointsJ = 0;
    pointsC = 0;

    document.getElementById("pointsC").innerText = "";
    document.getElementById("pointsJ").innerText = "";

    carteTireesC = 0;
    carteTireesJ = 0;

    blackjackC = false;
    blackjackJ = false;

    document.getElementById("btnTirer").removeAttribute("disabled");

    // #endregion

    argent = CalculerArgent(argent);

    if (argent > 5) {
        miser.style.visibility = "visible";
        btnJouer.style.visibility = "hidden";
    }
    else {
        document.getElementById("msg-erreur").style.color = "red";
        document.getElementById("msg-erreur").innerText = "Désolé, vous n'avez plus assez $$";
    }
}

function CalculerArgent(argent, argentMise) {
    if (argentMise == undefined) {
        argentMise = 0;
    }
    argent -= argentMise;

    var date_exp = new Date();
    date_exp.setTime(date_exp.getTime() + (45 * 24 * 3600 * 1000));
    SetCookie("argent", argent, date_exp);

    return argent;
}

function Miser() {
    miser.style.visibility = "hidden";
    btnRester.style.visibility = "visible";
    btnTirer.style.visibility = "visible";

    argentMise = parseInt($('input[name=mise]:checked').val());

    miseSpan.innerText = " " + argentMise + " $";
    argent = CalculerArgent(argent, argentMise);
    argentH2.innerText = "ARGENT : " + argent + " $";

    var date_exp = new Date();
    date_exp.setTime(date_exp.getTime() + (45 * 24 * 3600 * 1000));
    SetCookie("argent", argent, date_exp);

    BrasserCartes();

    ChoisirCartesCroupier();
    ChoisirCarteJoueur();

    Afficher1CarteCroupier();
    Afficher2CartesJoueur();

    CalculerMainJoueur(); // SEULEMENT QUE LES 2 PREMIÈRES CARTES.
    CalculerMainCroupier(); // SEULEMENT QUE LA PREMIÈRE CARTE.
}


function BrasserCartes() {
    for (var i = 1; i < tabCartes.length; i++) {
        var nombreAleatoire = Math.floor(Math.random() * (51 - 1) + 1);
        var temp = tabCartes[i];
        tabCartes[i] = tabCartes[nombreAleatoire];
        tabCartes[nombreAleatoire] = temp;
    }
}

function ChoisirCartesCroupier() {
    for (var i = 1; i <= 9; i++) {
        cartesCroupier[i - 1] = tabCartes[i]; // 8 premières cartes vont au croupier
    }
}

function ChoisirCarteJoueur() {
    var x = 0; // On doit mettre le tableau cartesJoueurs à l'index 0
    for (var i = 10; i <= 18; i++) {
        cartesJoueurs[x] = tabCartes[i];
        x++; // 9e-17e cartes pour le joueur du paquet de cartes brassées 
    }
}

function Afficher1CarteCroupier() {
    var zoneCroupier = document.getElementById("zoneCroupier");

    // 1e Carte
    var carte = document.createElement("img");
    carte.setAttribute("src", "cartes/" + (cartesCroupier[0]) + ".bmp")
    zoneCroupier.appendChild(carte);

    // Carte cachée
    var carteCachée = document.createElement("img");
    carteCachée.setAttribute("src", "cartes/carte.bmp")
    carteCachée.setAttribute("id", "carteCachee");
    zoneCroupier.appendChild(carteCachée);
}

function Afficher2CartesJoueur() {
    var zoneJoueur = document.getElementById("zoneJoueur");
    for (var i = 0; i < 2; i++) {
        var carte = document.createElement("img");
        carte.setAttribute("src", "cartes/" + (cartesJoueurs[i]) + ".bmp");
        zoneJoueur.appendChild(carte);
    }
}

// Cette fonction sera seulement pour les DEUX (2) premières cartes.
// Les autres cartes seront calculées et affichées seulement lorsque le joueur appuiera sur Tirer (sortir cartes pour Joueur).
function CalculerMainJoueur() {
    for (var i = 0; i < 2; i++) {
        pointsJ = CalculerPointsJoueur(i);
    }
    document.getElementById("pointsJ").innerText += " (" + pointsJ + ")";
}

// Cette fonction sera seulement pour la PREMIÈRE carte.
// Les autres cartes seront calculées et affichées seulement lorsque le joueur appuiera sur Rester (sortir cartes pour Croupier).
function CalculerMainCroupier() {
    var i = 0;
    pointsC += CalculerPointsCroupier(i);
    document.getElementById("pointsC").innerText += " (" + pointsC + ")";
}

function CalculerPointsJoueur(i) {
    if (cartesJoueurs[i] % 13 == 0) // Roi
    {
        pointsJ += 10;
    }
    else if (cartesJoueurs[i] % 13 == 1) // As
    {
        if (pointsJ + 11 > 21) // Si un as peut donner 11 points mais cela dépasse 21 (blackjack), la valeur de l'as sera automatiquement de 1.
        {
            pointsJ += 1; // Valeur de l'as (1 point)
        }
        else {
            pointsJ += 11; // Valeur de l'as (11 points)
        }
    }
    else if (cartesJoueurs[i] % 13 > 10) // Valet, Dame.
    {
        pointsJ += 10;
    }
    else {
        pointsJ += (cartesJoueurs[i] % 13);
    }
    carteTireesJ++; // Suivre le nombre de cartes tirées par le Joueur.

    if (carteTireesJ == 2 && pointsJ == 21) // Vérification blackjack.
    {
        blackjackJ = true;
    }

    return pointsJ;
}

function CalculerPointsCroupier(i) {
    if (cartesCroupier[i] % 13 == 0 || cartesCroupier[i] % 13 > 10) // Roi, Valet ou Dame.
    {
        pointsC += 10;
    }
    else if (cartesCroupier[i] % 13 == 1) // As
    {
        if (pointsC + 11 > 21) // Un as peut donner 11 points mais si cela dépasse 21 (blackjack), la valeur de l'as sera automatiquement de 1.
        {
            pointsC += 1; // Valeur de l'as (1 point)
        }
        else {
            pointsC += 11; // Valeur de l'as (11 points)
        }
    }
    else // Valeur par défaut.
    {
        pointsC += (cartesCroupier[i] % 13);
    }

    if (carteTireesC == 2 && pointsC == 21) {
        blackjackC = true;
    }

    carteTireesC++; // Suivre le nombre de cartes tirées par le Croupier.

    return pointsC;
}

function Tirer() {
    if (carteTireesJ < 8 && pointsJ < 21) {
        var zoneJoueur = document.getElementById("zoneJoueur");

        var carte = document.createElement("img");

        carte.setAttribute("src", "cartes/" + (cartesJoueurs[carteTireesJ]) + ".bmp"); // CarteTireeJ - 1 -> on veut l'élément de la carte selon le nombre de cartes déjà pigées.
        zoneJoueur.appendChild(carte);

        var i = carteTireesJ;
        pointsJ = CalculerPointsJoueur(i);

        carteTireesJ++;
        document.getElementById("pointsJ").innerText = " (" + pointsJ + ")";
    }

    if (carteTireesJ > 8 || pointsJ > 21) {
        document.getElementById("btnTirer").setAttribute("disabled", true);
    }
}

function Rester() {
    document.getElementById("btnRester").style.visibility = "hidden";
    document.getElementById("btnTirer").style.visibility = "hidden";

    document.getElementById("carteCachee").remove(); // Enlever carte cachée

    var zoneCroupier = document.getElementById("zoneCroupier");

    if (pointsC < 17 && pointsJ <= 21) {
        while (pointsC < 17 && pointsJ <= 21) {
            carteTireesC++;

            let carte = document.createElement("img");
            carte.setAttribute("src", "cartes/" + cartesCroupier[carteTireesC - 1] + ".bmp");
            zoneCroupier.appendChild(carte);

            var i = carteTireesC - 1;
            pointsC = CalculerPointsCroupier(i);

            document.getElementById("pointsC").innerText = "(" + pointsC + ")";
        }
    }
    else // Afficher la deuxième carte si le joueur dépasse 21.
    {
        carteTireesC++;
        let carte = document.createElement("img");
        carte.setAttribute("src", "cartes/" + cartesCroupier[1] + ".bmp");
        zoneCroupier.appendChild(carte);

        var i = carteTireesC - 1;
        pointsC = CalculerPointsCroupier(i);

        document.getElementById("pointsC").innerText = "(" + pointsC + ")";
    }

    VerifierGagnant();
    document.getElementById("btnJouer").style.visibility = "visible";
}

function VerifierGagnant() {
    if (pointsC <= 21 && pointsC > pointsJ || pointsJ > 21) {
        miseSpan.innerText = " PERDUE! (" + argentMise + " $)";
        argentMise = 0;
    }

   else if (pointsC == pointsJ && pointsC <= 21 && pointsJ <= 21 || blackjackJ && blackjackC) {
        miseSpan.innerText = " RÉCUPÉRÉE! (+" + argentMise + " $)";
        argent += argentMise;
        argentH2.innerText = "ARGENT : " + argent + "$";
    }

    else if ((pointsC < pointsJ && pointsC <= 21 && pointsJ <= 21 || pointsC > 21 && pointsJ <= 21) && !blackjackJ) {
        miseSpan.innerText = " RÉCUPÉRÉE ET GAGNÉE 1x! (+" + argentMise + " $)";
        argent += argentMise;
        argentH2.innerText = "ARGENT : " + argent + "$";
    }

    else if (blackjackJ && !blackjackC) {
        miseSpan.innerText = " RÉCUPÉRÉE ET GAGNÉE 1.5x! (+" + argentMise * 1.5 + " $)";
        argent += argentMise * 1.5;
        argentH2.innerText = "ARGENT : " + argent + "$";
    }
    var date_exp = new Date();
    date_exp.setTime(date_exp.getTime() + (45 * 24 * 3600 * 1000));
    SetCookie("argent", argent, date_exp);
}

// #region Fonctions Cookies
function SetCookie(name, value) {
    var argv = SetCookie.arguments;
    var argc = SetCookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : null;
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    document.cookie = name + "=" + escape(value) +
        ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
        ((path == null) ? "" : ("; path=" + path)) +
        ((domain == null) ? "" : ("; domain=" + domain)) +
        ((secure == true) ? "; secure" : "");
}

function setCookie() {
    var date_exp = new Date();
    date_exp.setTime(date_exp.getTime() + (45 * 24 * 3600 * 1000)); // Ici on définit 45 jours
    nom = prompt("Quel est votre nom?");
    argent = 1000;
    SetCookie("nom", nom, date_exp);
    SetCookie("argent", argent, date_exp);
}

function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

function GetCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) return getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

// #endregion