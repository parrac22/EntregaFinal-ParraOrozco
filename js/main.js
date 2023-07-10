const crearId = () => Math.random().toString(36).substr(2, 9)

const numberInput = document.querySelector('#numberInput')
const dropDownMenu = document.querySelector('#dropDownMenu')
const tableContainer = document.querySelector('.tableContainer')
const scorecardTotalExpenditure = document.querySelector('#totalGastado')


const eliminarTransaccionButton = document.querySelectorAll('.eliminarTransaccion')

const construirCategoria = (categoria)=> {
    return `<option value=${categoria.nombre}>${categoria.nombre}</option>`
}

const llenarDropDown = async ()=> {
    const response = await fetch("js/categorias.json")
    const data = await response.json()
    data.forEach((categoria) => {
        dropDownMenu.innerHTML += construirCategoria(categoria)
    })
}

const construirTransaccion = () => {
    let id = crearId()
    let categoria = dropDownMenu.value 
    let monto = numberInput.value || 0
    const objetoTransaccion = new Transaccion(id,categoria,monto)
    return objetoTransaccion
}

const guardarEnLocalStorage = ()=> {
    objetoTransaccion = construirTransaccion()
    localStorage.setItem(objetoTransaccion.id, JSON.stringify(objetoTransaccion))
}

const eliminarDeLocalStorage = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Realmente deseas eliminar la transacción?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'Cancelar',
        customClass: {
            cancelButton: 'botonesAlerta',
            confirmButton: 'botonesAlerta',
          }
      })
  
      if (result.isConfirmed) {
        localStorage.removeItem(id);
        Swal.fire('Transaccion eliminada');
      }
    } catch (error) {
      Swal.fire('Ocurrio un error, intenta nuevamente.')
    }
  };

const obtenerLedgerLocalStorage = () => {
    ledger = []
    for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i)
        let objetoTransaccion = JSON.parse(localStorage.getItem(clave))
        ledger.push(objetoTransaccion)
    }

    return ledger
}

const calcularTotalGastos = (arrayLedger) => {
    ledger = new Ledger(arrayLedger)
    total = ledger.calcularGastoTotal()
    return total || 0
}

const obtenerObjetoGastoCategoria = (arrayLedger) => {
    ledger = new Ledger(arrayLedger)
    objetoGastoCategoria= ledger.calcularGastoPorCategoria() || undefined
    return objetoGastoCategoria
}


const activarClickEnBotonGuardar = ()=> {
    const saveButton = document.querySelector('.saveButton')
    saveButton.addEventListener('click', ()=> {
        guardarEnLocalStorage()
        arrayLedger = obtenerLedgerLocalStorage()
        totalGasto = calcularTotalGastos(arrayLedger)


        llenarTablaTransacciones(arrayLedger)
        dropDownMenu.value = 'Selecciona la categoria de gasto'
        numberInput.value = ''
    }) 
}

const activarClickEnBotonesEliminar = ()=> {
    const botonesEliminar = document.querySelectorAll('.eliminarTransaccion')
    for (let botonEliminar of botonesEliminar) {
        botonEliminar.addEventListener('click', ()=> {
            let idTransaccionEliminar = botonEliminar.id
            eliminarDeLocalStorage(idTransaccionEliminar).then( () => {
                arrayLedger = obtenerLedgerLocalStorage()
                llenarTablaTransacciones(arrayLedger)
            }
            )
        })
    }
}

const activarClickEnBotonCalcularGastoCategoria = ()=> {
    const calculateButton = document.querySelector('.calcularGastoCategoria')
    calculateButton.addEventListener('click', ()=> {
        arrayLedger = obtenerLedgerLocalStorage()
        objetoGastoCategoria = obtenerObjetoGastoCategoria(arrayLedger)
        llenarTablaGastoCategoria(objetoGastoCategoria)
    }) 
}

const activarClickEnBotonVolverListaTransacciones = () => {
    const returnButton = document.querySelector('.volverListaTransacciones')
    returnButton.addEventListener('click', ()=> {
        arrayLedger = obtenerLedgerLocalStorage()
        llenarTablaTransacciones(arrayLedger)
    })   
}


llenarDropDown()

const crearTablaTransacciones = () => {
    arrayLedger = obtenerLedgerLocalStorage()
    total = calcularTotalGastos(arrayLedger)
    return `<table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Categoria</th>
                            <th>Monto</th>
                            <th>Gestionar</th>
                        </tr>
                    </thead>
                    <tbody class = "tableBodyTransacciones">
                        <hr>
                    </tbody>
            </table>
            <hr>
            <p>Gasto Total: $${total.toLocaleString()}</p>
            <hr>
            <button class = "calcularGastoCategoria"> Calcular Gasto por Categoria </button>`

}

const construirFilaTransacciones = (transaccion) => {
    return `<tr>
                <td class="idTransaccion">${transaccion.id}</td>
                <td class="categoriaTransaccion">${transaccion.categoria}</td>
                <td class="montoTransaccion">$${transaccion.monto.toLocaleString()}</td>
                <td><button id="${transaccion.id}" class="eliminarTransaccion">Eliminar</button></td>
            </tr>`
}

const crearTablaGastoCategoria = () => {
    arrayLedger = obtenerLedgerLocalStorage()
    total = calcularTotalGastos(arrayLedger)
    return `<table>
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody class = "tableBodyGastoCategoria">
                    </tbody>
            </table>
            <hr>
            <p>Gasto Total: $${total.toLocaleString()}</p>
            <hr>
            <button class = "volverListaTransacciones"> Volver a Lista de Transacciones </button>`
            
}




const llenarTablaTransacciones = (arrayLedger) => {
    tableContainer.innerHTML = ""
    tableContainer.innerHTML = crearTablaTransacciones()
    const tableBodyTransacciones = document.querySelector('.tableBodyTransacciones')

    arrayLedger.forEach((transaccion) => {
        tableBodyTransacciones.innerHTML += construirFilaTransacciones(transaccion)
    })
    activarClickEnBotonesEliminar()
    activarClickEnBotonCalcularGastoCategoria()

}

const llenarTablaGastoCategoria = (objetoGastoCategoria) => {
    tableContainer.innerHTML = ""
    tableContainer.innerHTML = crearTablaGastoCategoria()
    const tableBodyGastoCategoria = document.querySelector('.tableBodyGastoCategoria')
    if (objetoGastoCategoria !== undefined){
        for (categoria in objetoGastoCategoria){
            monto = objetoGastoCategoria[categoria]
            tableBodyGastoCategoria.innerHTML += `<tr>
                                                    <td class="grupoCategoria">${categoria}</td>
                                                    <td class="totalCategoria">$${monto.toLocaleString()}</td>
                                                </tr>`
        }
        activarClickEnBotonVolverListaTransacciones()
    } else {
        tableBodyGastoCategoria.innerHTML += `<tr>
                                                <td colspan="2">No hay datos disponibles</td>
                                             </tr>`
        activarClickEnBotonVolverListaTransacciones()
    }
}



const realizarCargaInicialApp = () => {
    arrayLedger = obtenerLedgerLocalStorage()
    llenarTablaTransacciones(arrayLedger)
    activarClickEnBotonGuardar()
}

realizarCargaInicialApp()

