//Creación de variable constante. tendrá la URL de la API
const API_URL = "https://retoolapi.dev/SjC1H1/data";

//Función que llama al JSON
//La palabra async indica que la función es asíncrona, es decir, puede contener operaciones que esperan resultados que tardan un poco
async function obtenerPersonas(){
    //Respuesta del servidor
    const res = await fetch(API_URL); //Se hace una llamada al endpoint

    //Convertimos a JSON la respuesta del servidor. La tabla (API) opera con JSON
    const data = await res.json(); //Esto es un JSON

    //Enviamos el JSON que nos manda la API a la función que crea la tabla en HTML
    mostrarDatos(data);
}
//La función contiene un parámetro "datos" que representa al archivo JSON
function mostrarDatos(datos){
    //Constante tabla. Se instancia la tabla en el index.html, con el contenido (tbody). Se debe de poner '#' antes del nombre
    //para denotar el tipo de dato (clase).
const tabla = document.querySelector('#tabla tbody')
    //Para inyectar código HTML se usa innerHTML
    tabla.innerHTML = ''; //Vaciamos el contenido de la tabla usando ''
        datos.forEach(persona => {
        tabla.innerHTML += `
            <tr> 
                <td>${persona.id}</td>
                <td>${persona.nombre}</td>
                <td>${persona.apellido}</td>
                <td>${persona.email}</td>
                <td>${persona.edad}</td>
                <td>
                    <button>Editar</button>
                    <button onClick="EliminarPersona(${persona.id})">Eliminar</button>
                </td>
            </tr>
            `


        });

}

//Llamada inicial para que se carguen los datos que vienen al servidor
obtenerPersonas();


//Agregar un nuevo registro
const modal = document.getElementById("modal-agregar"); // Cuadro de diálogo
const btnAbrirModal = document.getElementById("btn-abrirModal"); // + para abrir
const btnCerrarModal = document.getElementById("btn-cerrarModal"); // x para cerrar

btnAbrirModal.addEventListener("click", () => {
    modal.showModal();
});

btnCerrarModal.addEventListener("click", () => {
    modal.close();
});

//Agregar nuevo integrante desde formulario
document.getElementById("frm-agregar").addEventListener("submit", async e => {
    e.preventDefault(); // "e" representa el evento submit. Evita que el formulario se envíe de golpe
    // Capturar los valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("correo").value.trim();
    const edad = document.getElementById("edad").value.trim();

    // Validación básica
    if (!nombre || !apellido || !email || !edad) {
        alert("Por favor, rellene todos los campos");
        return; // Evita que el formulario se envíe
    }

    // Llamar a la API para enviar datos
    const respuesta = await fetch(API_URL, {
        method: "POST", // Método HTTP POST para enviar datos 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({nombre, apellido, correo, edad})
    });
    
    if (respuesta.ok){
        alert("El registro fue agregado correctamente");
        document.getElementById("frm-agregar").reset(); // Se limpia el formulario
        modal.close(); // Se cierra el formulario
        obtenerPersonas(); // Se manda a llamar el método para cargar datos del servidor 
    } else {
        alert("Hubo un error al agregar");
    }

});

//Función para borrar registros

async function EliminarPersona(id){
    const confirmacion = confirm("¿real quieres eliminar a la persona?");

    //validamos si el usuario dijo que si desea borrar
    if(confirmacion){
        await fetch(`${API_URL}/${id}`, {method: "DELETE"});

        //Recargamos la tabla para ver la eliminacion
        obtenerPersonas();
    }
}