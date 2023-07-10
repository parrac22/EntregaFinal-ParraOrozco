const crearId = () => Math.random().toString(36).substr(2, 9)

const numberInput = document.querySelector('#numberInput')
const dropDownMenu = document.querySelector('#dropDownMenu')

const scorecardTotalExpenditure = document.querySelector('#totalGastado')



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



const activarClickEnBotonGuardar = ()=> {
    const saveButton = document.querySelector('.saveButton')
    saveButton.addEventListener('click', ()=> {
        guardarEnLocalStorage()
        arrayLedger = obtenerLedgerLocalStorage()
        totalGasto = calcularTotalGastos(arrayLedger)
        scorecardTotalExpenditure.textContent = `Total gastado: $${totalGasto}`
        dropDownMenu.value = 'Selecciona la categoria de gasto'
        numberInput.value = ''
    }) 
}

const llenarTotalGastadoScorecard = () => {
    arrayLedger = obtenerLedgerLocalStorage()
    totalGasto = calcularTotalGastos(arrayLedger)
    scorecardTotalExpenditure.textContent = `Total gastado: $${totalGasto}` 
}

llenarDropDown()
llenarTotalGastadoScorecard()

const realizarCargaInicialApp = () => {
    activarClickEnBotonGuardar()
}

realizarCargaInicialApp()

