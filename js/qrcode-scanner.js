// js/qrcode-scanner.js
let html5QrcodeScannerInstance;
let currentReaderDivId = null;

/**
 * Inicia o scanner de QR code na div especificada.
 * @param {string} divId - O ID do elemento HTML onde o scanner será renderizado.
 * @param {function} callbackSucesso - Função a ser chamada em caso de leitura bem-sucedida.
 * @param {function} callbackErro - Função a ser chamada em caso de erro.
 */
function iniciarScanner(divId, callbackSucesso, callbackErro) {
    const qrReaderDiv = document.getElementById(divId);
    if (!qrReaderDiv) {
        console.error("Div do leitor QR não encontrada:", divId);
        if (callbackErro) callbackErro("Div do leitor QR não encontrada.");
        return;
    }

    // Para qualquer scanner anterior antes de iniciar um novo.
    pararScanner();
    currentReaderDivId = divId; // Armazena o ID da div atual

    try {
        // Assegura que Html5QrcodeScanner e Html5QrcodeScanType estão disponíveis.
        // Eles vêm da biblioteca incluída via CDN.
        html5QrcodeScannerInstance = new Html5QrcodeScanner(
            divId,
            {
                fps: 10, // Quadros por segundo
                qrbox: { width: 250, height: 250 }, // Tamanho da caixa de scan
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] // Usa apenas a câmera
            },
            /* verbose= */ false // Desativa logs detalhados da biblioteca
        );
        html5QrcodeScannerInstance.render(callbackSucesso, callbackErro);
        console.log("Scanner iniciado na div:", divId);
    } catch (e) {
        console.error("Erro ao iniciar o scanner:", e);
        alert("Erro ao iniciar a câmera. Verifique as permissões e se está usando HTTPS ou localhost.");
        if (callbackErro) callbackErro(e);
        // Tenta limpar a div em caso de erro na inicialização
        qrReaderDiv.innerHTML = "Falha ao iniciar a câmera.";
        qrReaderDiv.style.display = 'none';
    }
}

/**
 * Para o scanner de QR code e limpa a div.
 */
function pararScanner() {
    if (html5QrcodeScannerInstance) {
        try {
            // Usa getState() para verificar se está escaneando antes de parar.
            // O estado 2 geralmente significa 'SCANNING'.
            if (html5QrcodeScannerInstance.getState && html5QrcodeScannerInstance.getState() === 2) {
                html5QrcodeScannerInstance.clear()
                    .then(() => console.log("Scanner parado e limpo."))
                    .catch(err => console.error("Erro ao limpar scanner (durante parada):", err));
            } else {
                 // Se não estiver escaneando, apenas tenta limpar sem logar erro.
                 html5QrcodeScannerInstance.clear().catch(err => {});
            }
        } catch (e) {
            console.warn("Não foi possível parar o scanner (talvez já parado):", e);
        } finally {
            // Garante que a div seja limpa e a instância resetada
            if (currentReaderDivId) {
                const readerDiv = document.getElementById(currentReaderDivId);
                if (readerDiv) readerDiv.innerHTML = ""; // Limpa o conteúdo
            }
            html5QrcodeScannerInstance = null;
            currentReaderDivId = null;
        }
    }
}