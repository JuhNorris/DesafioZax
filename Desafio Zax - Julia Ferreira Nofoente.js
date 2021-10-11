(() => {
  const motoboy1 = { nome: "motoca1", custo: 2, entregas: { exclusividade: false, lojas: ["loja1", "loja2", "loja3"] }, jornada: { pedidosEntregues: [], faturamento: 0 } }
  const motoboy2 = { nome: "motoca2", custo: 2, entregas: { exclusividade: false, lojas: ["loja1", "loja2", "loja3"] }, jornada: { pedidosEntregues: [], faturamento: 0 } }
  const motoboy3 = { nome: "motoca3", custo: 2, entregas: { exclusividade: false, lojas: ["loja1", "loja2", "loja3"] }, jornada: { pedidosEntregues: [], faturamento: 0 } }
  const motoboy4 = { nome: "motoca4", custo: 2, entregas: { exclusividade: true, lojas: ["loja2"] }, jornada: { pedidosEntregues: [], faturamento: 0 } }
  const motoboy5 = { nome: "motoca5", custo: 3, entregas: { exclusividade: false, lojas: ["loja1", "loja2", "loja3"] }, jornada: { pedidosEntregues: [], faturamento: 0 } }
  // const motoboys = [motoboy4]
  const motoboys = [motoboy1, motoboy2, motoboy3, motoboy4, motoboy5]

  const loja1 = { nome: "loja1", comissão: 0.05, pedidos: [50, 50, 50]}
  const loja2 = { nome: "loja2", comissão: 0.05, pedidos: [50, 50, 50]}
  const loja3 = { nome: "loja3", comissão: 0.15, pedidos: [50, 50, 50]}
  const lojas = [loja1, loja2, loja3]
  // const lojas = [loja1]

  let lojaAtual = 0
  while (pedidosEmAberto(lojas) && motoboysPodemAtenderLojas(motoboys, lojas)) {
    for (let i = 0; i < motoboys.length; i++) {
      if (motoboys[i].entregas.exclusividade) {
        const lojaExclusiva = lojas.findIndex(loja => loja.nome == motoboys[i].entregas.lojas[0])
        if (lojaExclusiva != -1) {
          const loja = lojas[lojaExclusiva]
          if (lojaPossuiPedidos(loja)) {
            pedido = retiraPedido(loja)
            motoboys[i].jornada.pedidosEntregues.push(pedido)
            motoboys[i].jornada.faturamento += recebePagamento(loja.comissão, pedido.valor, motoboys[i].custo)
          }
          if (!existemPedidosNaLoja(loja)) {
            lojas.splice(lojaExclusiva, 1)
            if (!pedidosEmAberto(lojas)) {
              break
            }
          }
        }
      } else {
        const loja = lojas[lojaAtual]
        pedido = retiraPedido(loja)
        motoboys[i].jornada.pedidosEntregues.push(pedido)
        motoboys[i].jornada.faturamento += recebePagamento(loja.comissão, pedido.valor, motoboys[i].custo)
        if (!existemPedidosNaLoja(loja)) {
          lojas.splice(lojaAtual, 1)
          lojaAtual--
          if (!pedidosEmAberto(lojas)) {
            break
          }
        }
        lojaAtual = identificaProximaLoja(lojas, lojaAtual)
      }
    }
  }
  imprimeResultados(motoboys)
})()

function imprimeResultados(motoboys) {
  motoboys.forEach(motoboy => {
    console.log(`Motoboy: ${motoboy.nome} | QuantosPedidos: ${motoboy.jornada.pedidosEntregues.length} | LojasAtendidas: ${motoboy.jornada.pedidosEntregues.map(loja => loja.nomeDaLoja)} | FaturamentoDoDia: ${motoboy.jornada.faturamento}`)
  })
}

function motoboysPodemAtenderLojas(motoboys, lojas) {
  motoboysExclusivos = motoboys.filter(motoboy => motoboy.entregas.exclusividade)

  if (motoboysExclusivos.length == motoboys.length) {
    lojasAtivas = lojas.map(loja => loja.nome)
    return lojasAtivas.every(nomeDaloja => motoboysExclusivosAtendemALoja(nomeDaloja, motoboysExclusivos))
  }
  return true
}

function motoboysExclusivosAtendemALoja(nomeDaloja, motoboysExclusivos) {
  return motoboysExclusivos.some(motoboy => motoboy.entregas.lojas[0] == nomeDaloja)
}

function identificaProximaLoja(lojas, lojaAtual) {
  return lojaAtual >= lojas.length - 1 ? 0 : ++lojaAtual
}

function existemPedidosNaLoja(loja) {
  return loja.pedidos.length
}

function recebePagamento(comissão, pedido, taxaFixa) {
  return (pedido * comissão) + taxaFixa
}

function retiraPedido(loja) {
  return {
    nomeDaLoja: loja.nome,
    valor: loja.pedidos.shift()
  }
}

function lojaPossuiPedidos(loja) {
  return loja != undefined && loja.pedidos.length
}

function pedidosEmAberto(lojas) {
  return lojas.length != 0
}