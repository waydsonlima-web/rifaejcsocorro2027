function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Rifa Online')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getNumerosOcupados() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return [];

  let ocupados = [];
  for (let i = 1; i < data.length; i++) {
    ocupados.push(String(data[i][0]).padStart(4, '0'));
  }
  return ocupados;
}

// NOVA FUNÇÃO: Processa a compra de vários números de uma vez
function salvarReservaMultipla(numerosArray, nome, telefone) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const ocupados = getNumerosOcupados();

  // 1. Verifica se algum dos números escolhidos já foi pego por outra pessoa nesse meio tempo
  for (let i = 0; i < numerosArray.length; i++) {
    let numFormatado = String(numerosArray[i]).padStart(4, '0');
    if (ocupados.includes(numFormatado)) {
      return { sucesso: false, mensagem: `O número ${numFormatado} acabou de ser reservado por outra pessoa. Atualize a página e tente novamente.` };
    }
  }

  // 2. Se todos estiverem livres, salva todos na planilha
  const dataAtual = new Date();
  for (let i = 0; i < numerosArray.length; i++) {
    sheet.appendRow([String(numerosArray[i]).padStart(4, '0'), nome, telefone, dataAtual]);
  }
  
  return { sucesso: true };
}

function sortear() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return { sucesso: false, mensagem: 'Nenhum número foi reservado ainda.' };
  }

  const participantes = data.slice(1);
  const indexSorteado = Math.floor(Math.random() * participantes.length);
  const vencedor = participantes[indexSorteado];

  return {
    sucesso: true,
    numero: String(vencedor[0]).padStart(4, '0'),
    nome: vencedor[1],
    telefone: vencedor[2]
  };
}
