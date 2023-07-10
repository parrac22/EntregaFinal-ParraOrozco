class Ledger {
    constructor(listadoGastos) {
        this.gastos = listadoGastos
    }
    calcularGastoPorCategoria() {
        if (this.gastos.length > 0) {
            return this.gastos.reduce((acc, objetoTransaccion)=> {
               const {categoria,monto} = objetoTransaccion

               if (acc[categoria]) {
                   acc[categoria] += parseFloat(monto)
               } else {
                   acc[categoria] = parseFloat(monto)
               }

               return acc
            }, {})
        } else {
            return null
        }
    }
    calcularGastoTotal() {
        if (this.gastos.length > 0) {
            return this.gastos.reduce((acc,objetoTransaccion)=> acc + parseFloat(objetoTransaccion.monto),0)
        } else {
            return null
        }
    }
}

class Transaccion {
    constructor(id,categoria,monto) {
        this.id = id
        this.categoria = categoria
        this.monto = parseFloat(monto)
    }
}