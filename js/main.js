// js/main.js

const RACKS_KEY = 'cavaletes';
const ALLOCATIONS_KEY = 'alocacoesPecas';

/**
 * Processa o ID da peça lido do QR Code ou digitado.
 * Pega os últimos 14 caracteres, IGNORA OS 2 ÚLTIMOS (resultando em 12),
 * e substitui D por -, A por . e B por /.
 * @param {string} idOriginal - O ID da peça original.
 * @returns {string} O ID da peça processado.
 */
function processarIdPeca(idOriginal) {
    if (!idOriginal) {
        return ''; // Retorna vazio se a entrada for nula ou vazia
    }

    let idProcessado = idOriginal.trim().toUpperCase(); // Remove espaços e garante maiúsculas

    // 1. Pega os últimos 14 caracteres (se o ID for maior que 14)
    if (idProcessado.length > 14) {
        idProcessado = idProcessado.slice(-14);
    }

    // 2. *** NOVO: IGNORA os últimos 2 caracteres ***
    idProcessado = idProcessado.slice(0, -2);

    // 3. Faz as substituições (usando /g para substituir todas as ocorrências)
    idProcessado = idProcessado.replace(/D/g, '-')
                             .replace(/A/g, '.')
                             .replace(/B/g, '/');

    console.log(`ID Original: ${idOriginal} -> Processado (sem 2 ultimos): ${idProcessado}`);
    return idProcessado;
}


/**
 * Obtém a lista de cavaletes cadastrados.
 * @returns {string[]} Array com os IDs dos cavaletes.
 */
function obterCavaletes() {
    return JSON.parse(localStorage.getItem(RACKS_KEY)) || [];
}

/**
 * Adiciona um novo cavalete à lista, se não existir.
 * @param {string} idCavalete - O ID do cavalete a ser adicionado.
 */
function adicionarCavalete(idCavalete) {
    const cavaletes = obterCavaletes();
    if (!cavaletes.includes(idCavalete)) {
        cavaletes.push(idCavalete);
        localStorage.setItem(RACKS_KEY, JSON.stringify(cavaletes));
        console.log(`Cavalete ${idCavalete} adicionado.`);
    } else {
        alert('Este cavalete já está cadastrado.');
        console.warn(`Tentativa de adicionar cavalete duplicado: ${idCavalete}`);
    }
}

/**
 * Remove um cavalete da lista.
 * @param {string} idCavalete - O ID do cavalete a ser removido.
 */
function removerCavalete(idCavalete) {
    let cavaletes = obterCavaletes();
    cavaletes = cavaletes.filter(c => c !== idCavalete);
    localStorage.setItem(RACKS_KEY, JSON.stringify(cavaletes));
    console.log(`Cavalete ${idCavalete} removido.`);
    // AVISO: Idealmente, deveria verificar se há peças neste cavalete antes de remover.
}

/**
 * Obtém o objeto de alocações (peça -> cavalete).
 * @returns {object} Objeto onde a chave é o ID da peça e o valor é o ID do cavalete.
 */
function obterAlocacoes() {
    return JSON.parse(localStorage.getItem(ALLOCATIONS_KEY)) || {};
}

/**
 * Aloca uma peça a um cavalete.
 * @param {string} idPeca - O ID da peça (JÁ PROCESSADO).
 * @param {string} idCavalete - O ID do cavalete.
 */
function alocarPeca(idPeca, idCavalete) {
    const alocacoes = obterAlocacoes();
    alocacoes[idPeca] = idCavalete;
    localStorage.setItem(ALLOCATIONS_KEY, JSON.stringify(alocacoes));
    console.log(`Peça ${idPeca} alocada no cavalete ${idCavalete}.`);
}

/**
 * Remove a alocação de uma peça.
 * @param {string} idPeca - O ID da peça a ser removida (JÁ PROCESSADO).
 * @returns {boolean} True se a peça foi removida, false caso contrário.
 */
function removerPeca(idPeca) {
    const alocacoes = obterAlocacoes();
    if (alocacoes[idPeca]) {
        delete alocacoes[idPeca];
        localStorage.setItem(ALLOCATIONS_KEY, JSON.stringify(alocacoes));
        console.log(`Peça ${idPeca} removida.`);
        return true;
    }
    console.warn(`Peça ${idPeca} não encontrada para remoção.`);
    return false;
}

/**
 * Consulta a localização de uma peça.
 * @param {string} idPeca - O ID da peça (JÁ PROCESSADO).
 * @returns {string | null} O ID do cavalete ou null se não encontrada.
 */
function consultarLocalizacaoPeca(idPeca) {
    const alocacoes = obterAlocacoes();
    return alocacoes[idPeca] || null;
}
