class Provincia {

    constructor(nombre, distancia, valorHotel, datoProvincia) {
        this.nombre = nombre;
        this.distancia = distancia;
        this.valorHotel = valorHotel;
        this.datoProvincia = datoProvincia;
    }

}

let provinciasAgregadas1 = [];
let destinos;
let lugar;
let data;

let formulario;
let nombreIngresado;
let distaHotelIngresado;
let datoProvinciaIngresado;
let provinciaAgregada;
let costoTotal;

let formCalculadora;
let destino;
let presupuestoOtorgado;
let cantidadDias;

let btnEnvio;
let btnCalcular;
let btnHistorial; 

async function obtenerProvincias() {

    const res = await fetch("/infoProvincias.json");
    data = await res.json();
    return data;

}

function inicializarElementos() {

    formulario = document.getElementById("formulario");
    nombreIngresado = document.getElementById("nombre");
    distanciaIngresada = document.getElementById("distancia");
    valorHotelIngresado = document.getElementById("valorhotel");
    datoProvinciaIngresado = document.getElementById("datocurioso");
    provinciaAgregada = document.getElementById("provinciaAgregada");

    formCalculadora = document.getElementById("formCalculadora");
    destino = document.getElementById("destino");
    presupuestoOtorgado = document.getElementById("presupuesto");
    cantidadDias = document.getElementById("dias");
    btnEnvio = document.getElementById("btnEnvio");
    btnCalcular = document.getElementById("btnCalcular");
    btnHistorial = document.getElementById("btnHistorial");
}

function inicializarPropiedades() {

    btnEnvio.addEventListener("click", (event) => validarFormulario(event));
    btnCalcular.addEventListener("click", calculadora);
    btnHistorial.addEventListener("click", (event) => mostrarEnDomProvinciasAgregadas(event));
}

function traslado(kilometros, valor) {

    let valorKilometro = kilometros * valor;
    return valorKilometro;
}

function hospedaje(dias, valor) {

    let valorHospedaje = dias * valor;
    return valorHospedaje;
}

function costoViaje(valorHospedaje, valorKilometro) {

    costo = valorHospedaje + valorKilometro;
    return costo;
}

function destinoPosible(presupuesto, costoTotal) {

    if (parseFloat(presupuesto) > parseFloat(costoTotal)) {
        viajePosible.innerHTML =
            "Con el presupuesto dado podras darte unas buenas vacaciones!"
        return true;
    } else {
        viajePosible.innerHTML =
            "Con el presupuesto dado quizas puedas probar con otro destino o ir menos dias"
        return false;
    }
}

function verDato(provincia) {

    let datoCheck = document.getElementById("verDato").checked;

    if (datoCheck === true) {
        let dato = provincia['datoProvincia'];
        datoConteiner.innerHTML =
            `<p><strong>Aqui mas info : </strong> ${dato}</p>`
        return dato = provincia['datoProvincia'];
    }
}

function calculadora(event) {

    resultados.innerHTML = ``
    viajePosible.innerHTML = ``
    datoConteiner.innerHTML = ``

    let destinoSeleccionado = destino.value;

    let presupuesto = presupuestoOtorgado.value;

    let dias = cantidadDias.value;

    const provinciaEncontrada = data.find(provincia => provincia.nombre === destinoSeleccionado.toLowerCase());

    if (provinciaEncontrada !== "", presupuesto !== "", dias !== "") {

        const valorKilometro = 50;
        let costoHotel = provinciaEncontrada['valorHotel'];
        let costoTraslado = traslado(provinciaEncontrada['distancia'], valorKilometro);
        let costoHospedaje = hospedaje(dias, costoHotel);
        let costoTotal = costoViaje(costoTraslado, costoHospedaje);

        destinoPosible(presupuesto, costoTotal);
        verDato(provinciaEncontrada);
        mostrarAlert(costoTotal);
    } else {

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, completa todos los campos',
        })
    }

    formCalculadora.reset();
}

function mostrarAlert(costoTotal) {

    Swal.fire({
        
        title: 'Aqui tiene el resultado de tu calculo!',
        icon: 'info',
        text: `Costo aproximado:$ ${costoTotal}`,
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
    })
}

function validarFormulario(event) {

    provinciaAgregada.innerHTML = '';
    event.preventDefault();

    let nombre = nombreIngresado.value;
    let distancia = parseFloat(distanciaIngresada.value);
    let valorHotel = parseFloat(valorHotelIngresado.value);
    let datoProvincia = datoProvinciaIngresado.value;

    if (nombre == "" || distancia == NaN || valorHotel == NaN) {
        
        mostrarToastNoAprobado();
    } 
    else {

        let provincia = new Provincia(
            nombre,
            distancia,
            valorHotel,
            datoProvincia
        );
        console.log(provincia);
        provinciasAgregadas1.push(provincia)
        formulario.reset();
        almacenarProvinciasLS();
        mostrarToastAprobado();
    }
}

function almacenarProvinciasLS() {

    localStorage.setItem("provincias", JSON.stringify(provinciasAgregadas1));
}

function obtenerProvinciasAgregadas() {

    let destinosGuardados = localStorage.getItem("provincias");
    if (destinosGuardados !== null) {

        lugar = JSON.parse(destinosGuardados);
    }
    return lugar
}

function mostrarEnDomProvinciasAgregadas(event) {

    destinos2 = obtenerProvinciasAgregadas();
    event.preventDefault();
    for (i=0; i<destinos2.length; i++){

        let individual = destinos2[i];
        let nombreAgregado = individual["nombre"];
        listaProvincias.innerHTML =
            `<h2>Ultimo destino agregado: </h2>
            <p><strong>Nombre: </strong> ${nombreAgregado}</p>
            <p><strong>Distancia: </strong> ${individual["distancia"]}</p>
            <p><strong>Valor del Hotel: </strong> ${individual['valorHotel']}</p>
            <p><strong>Dato curioso: </strong> ${individual['datoProvincia']}</p>`
    }       
}

function mostrarToastAprobado() {
    
    Toastify({
        text: "Gracias por tu recomendacion!",
        duration: 3000,
        close: true,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true, 
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
    
}

function mostrarToastNoAprobado () {

    Toastify({
        text: "Error, faltan campos obligatorios",
        className: "info",
        gravity: "bottom",
        position: "right",
        style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
    }).showToast();
}

function main() {

    inicializarElementos();
    inicializarPropiedades();
    obtenerProvincias();
}

main();