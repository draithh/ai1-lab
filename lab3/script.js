let map = L.map('map').setView([53.430127, 14.564802], 18);
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");
//     • mapa rastrowa zostaje podzielona na N elementów i wymieszana; elementy rozrzucone na „stole”
// • użycie mechanizmu drag & drop do przemieszczania elementów na „stole”
// • w tle weryfikacja czy element ustawiony na swoim miejscu
//     • w momencie ustawienia wszystkich elementów na swoim miejscu – wyświetlenie notyfikacji systemowej (https://developer.mozilla.org/en-US/docs/Web/API/Notification)

let correctPieces = 0;

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        // here we have the canvas
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");
        rasterMap.width = canvas.width;
        rasterMap.height = canvas.height;
        //rasterContext.drawImage(canvas, 0, 0);
        //podziel rasterContext na N elementow i stworz z nich draggable elementy ktore pojawia sie pod mapa (na dole), narysuj pola na klocki na rasterMap
        let N = 2; // liczba elementow
        let rows = 2; // liczba wierszy
        let cols = 1; // liczba kolumn
        let pieceWidth = canvas.width / cols;
        let pieceHeight = canvas.height / rows;

        let pieces = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let pieceCanvas = document.createElement("canvas");
                pieceCanvas.width = pieceWidth;
                pieceCanvas.height = pieceHeight;
                let pieceContext = pieceCanvas.getContext("2d");
                pieceContext.drawImage(canvas, j * pieceWidth, i * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
                pieces.push(pieceCanvas);
            }
        }

        // Dodaj elementy do dokumentu
        let piecesContainer = document.getElementById("piecesContainer");
        piecesContainer.innerHTML = " "; // wyczysc poprzednie elementy
        pieces.forEach((piece, index) => {
            piece.id = index;
            piece.draggable = true;
            piece.addEventListener("dragstart", function (e) {
                e.dataTransfer.setData("text/plain", e.target.id);
            });
            piecesContainer.appendChild(piece);
        });

        //wymieszaj elementy
        for (let i = piecesContainer.children.length; i >= 0; i--) {
            piecesContainer.appendChild(piecesContainer.children[Math.random() * i | 0]);
        }

        // narysuj pola na rasterMap

        rasterContext.fillStyle = "red";;
        rasterContext.fillRect(0, 0, rasterMap.width, rasterMap.height);

        rasterContext.strokeStyle = "black";
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rasterContext.strokeRect(j * pieceWidth, i * pieceHeight, pieceWidth, pieceHeight);
            }
        }

        rasterMap.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        // obsługa upuszczania elementów na rasterMap sprawdza czy element jest na swoim miejscu i wyswietla w konsoli ile na ile elementow jest na swoim miejscu
        // mozna przesuwac w rasterMap elementy i maksymalnie 1 element moze byc na jednym polu, jak sie przesunie na rasterMape to powinno zniknac z dolu.
        rasterMap.addEventListener("drop", function (e) {
            e.preventDefault();

            let id = e.dataTransfer.getData("text/plain");
            let piece = document.getElementById(id);
            let rect = rasterMap.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            let col = Math.floor(x / pieceWidth);
            let row = Math.floor(y / pieceHeight);
            let index = row * cols + col;

            //przenies element na rasterMap czyli add child do rasterMap
            let pieceContext = rasterMap.getContext("2d");
            pieceContext.drawImage(piece, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight);

            //usun element z dolu
            piece.parentNode.removeChild(piece);

           //dodaj sprawdzanie czy element jest na swoim miejscu
            if (index == id) {
                correctPieces++;
            }


            console.log("Liczba elementow na swoim miejscu: " + correctPieces);
            if (correctPieces === N) {
                // wyswietl notyfikacje
                if (Notification.permission === "granted") {
                    let notification = new Notification("Puzzle completed!", {
                        body: "Congratulations! You have completed the puzzle.",
                        icon: "icon.png"
                    });
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission().then(permission => {
                        if (permission === "granted") {
                            let notification = new Notification("Puzzle completed!", {
                                body: "Congratulations! You have completed the puzzle.",
                                icon: "icon.png"
                            });
                        }
                    });
                }
            }
        });


    });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
        marker.setLatLng([lat, lon]);
        marker.bindPopup("<strong>Your location</strong><br>Latitude: " + lat + "<br>Longitude: " + lon).openPopup();

        if (Notification.permission === "granted") {
            let notification = new Notification("Location found", {
                body: "Latitude: " + lat + "\nLongitude: " + lon,
                icon: "icon.png"
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    let notification = new Notification("Location found", {
                        body: "Latitude: " + lat + "\nLongitude: " + lon,
                        icon: "icon.png"
                    });
                }
            });
        }
    }, positionError => {
        console.error(positionError);
    });
});

