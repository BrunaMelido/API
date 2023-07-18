function validarAgencia(agencia) {
  //agencia
  const agenciaNumeros = agencia.length
  if (agenciaNumeros = 2) {
    return "oi"
  }
}
function validarCPF(cpf) {
  const cpfNumeros = cpf.replace(/[^\d]/g, '');
  console.log("foi")
  if (cpfNumeros.length === 11) {
    return "errado"
  }else {
    return "CPF ERRADOOOO"
  }
  //return cpfNumeros.length === 11;
}

function nomeCartao(nomeCompleto) {
  const partesNome = nomeCompleto.trim().split(' ');
  const primeiroNome = partesNome[0];
  const ultimoSobrenome = partesNome[partesNome.length - 1];
  let abreviacoesNomesMeio = '';
  if (partesNome.length > 2) {
    for (let i = 1; i < partesNome.length - 1; i++) {
      const nomeMeio = partesNome[i];
      abreviacoesNomesMeio += nomeMeio.charAt(0).toUpperCase() + ' ';
    }
  }

  console.log(`Primeiro nome: ${primeiroNome} ${abreviacoesNomesMeio}${ultimoSobrenome}`);
  alert(`Primeiro nome: ${primeiroNome} ${abreviacoesNomesMeio}${ultimoSobrenome}`);

  // Retorna o nome do cartão formatado
  return `${primeiroNome} ${abreviacoesNomesMeio}${ultimoSobrenome}`;
}
