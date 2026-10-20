
const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");
const botaoReiniciar = document.getElementById("reiniciar");

const LARGURA = canvas.width;
const ALTURA = canvas.height;
const CHAO = 205;

let dinossauro;
let obstaculos;
let nuvens;
let pontos;
let recorde = 0;
let velocidade;
let quadro;
let jogoAtivo;
let agachado = false;
let ultimoTempo = 0;

// Reinicia o jogo
function reiniciarJogo() {
    dinossauro = {
        x: 55,
        y: CHAO - 44,
        largura: 44,
        altura: 44,
        velocidadeY: 0,
        noChao: true,
        animacao: 0
    };

    obstaculos = [];
    nuvens = [
        { x: 150, y: 45 },
        { x: 430, y: 70 },
        { x: 700, y: 38 }
    ];

    pontos = 0;
    velocidade = 6;
    quadro = 0;
    jogoAtivo = true;
    agachado = false;
    ultimoTempo = 0;

    requestAnimationFrame(loop);
}

// Faz o dinossauro pular
function pular() {
    if (!jogoAtivo) {
        reiniciarJogo();
        return;
    }

    if (dinossauro.noChao && !agachado) {
        dinossauro.velocidadeY = -12;
        dinossauro.noChao = false;
    }
}

// Desenha o dinossauro
function desenharDinossauro() {
    const d = dinossauro;
    const x = Math.round(d.x);
    const y = Math.round(d.y);

    ctx.fillStyle = "#535353";

    if (agachado && d.noChao) {
        // Corpo abaixado
        ctx.fillRect(x + 3, y + 20, 35, 18);
        ctx.fillRect(x + 27, y + 4, 18, 19);
        ctx.fillRect(x + 39, y + 12, 9, 5);

        // Olho
        ctx.fillStyle = "#fff";
        ctx.fillRect(x + 38, y + 8, 3, 3);
        ctx.fillStyle = "#535353";

        // Cauda
        ctx.fillRect(x - 5, y + 24, 10, 5);

        // Pernas animadas
        if (Math.floor(d.animacao / 6) % 2 === 0) {
            ctx.fillRect(x + 8, y + 35, 6, 9);
            ctx.fillRect(x + 29, y + 35, 6, 9);
        } else {
            ctx.fillRect(x + 15, y + 35, 6, 9);
            ctx.fillRect(x + 35, y + 35, 6, 9);
        }
    } else {
        // Corpo
        ctx.fillRect(x + 8, y + 15, 25, 25);

        // Cabeça
        ctx.fillRect(x + 22, y + 2, 22, 21);
        ctx.fillRect(x + 37, y + 13, 11, 8);

        // Olho
        ctx.fillStyle = "#fff";
        ctx.fillRect(x + 36, y + 6, 4, 4);
        ctx.fillStyle = "#535353";

        // Cauda
        ctx.fillRect(x + 1, y + 18, 9, 6);
        ctx.fillRect(x - 3, y + 14, 7, 6);

        // Braço
        ctx.fillRect(x + 27, y + 24, 7, 4);

        // Pernas
        if (!d.noChao || Math.floor(d.animacao / 6) % 2 === 0) {
            ctx.fillRect(x + 11, y + 36, 6, 9);
            ctx.fillRect(x + 24, y + 36, 6, 5);
        } else {
            ctx.fillRect(x + 11, y + 36, 6, 5);
            ctx.fillRect(x + 24, y + 36, 6, 9);
        }
    }
}

// Desenha os cactos
function desenharCacto(o) {
    const x = Math.round(o.x);
    const y = CHAO - o.altura;

    ctx.fillStyle = "#535353";

    ctx.fillRect(
        x + o.largura * 0.3,
        y,
        o.largura * 0.4,
        o.altura
    );

    if (o.tipo === 1) {
        ctx.fillRect(x, y + o.altura * 0.4, o.largura * 0.4, 5);
        ctx.fillRect(x, y + o.altura * 0.25, 5, o.altura * 0.2);

        ctx.fillRect(
            x + o.largura * 0.6,
            y + o.altura * 0.55,
            o.largura * 0.4,
            5
        );

        ctx.fillRect(
            x + o.largura * 0.6,
            y + o.altura * 0.4,
            5,
            o.altura * 0.2
        );
    }
}

// Desenha o chão
function desenharChao() {
    ctx.fillStyle = "#535353";
    ctx.fillRect(0, CHAO, LARGURA, 2);

    for (let i = 0; i < 12; i++) {
        const x =
            ((i * 83 - quadro * velocidade * 0.7) % LARGURA + LARGURA)
            % LARGURA;

        ctx.fillRect(x, CHAO + 8 + (i % 3) * 4, 4, 1);
    }
}

// Desenha as nuvens
function desenharNuvens() {
    ctx.fillStyle = "#d8d8d8";

    for (const nuvem of nuvens) {
        ctx.fillRect(nuvem.x, nuvem.y + 5, 42, 8);
        ctx.fillRect(nuvem.x + 8, nuvem.y, 17, 12);
        ctx.fillRect(nuvem.x + 22, nuvem.y + 2, 12, 10);

        if (jogoAtivo) {
            nuvem.x -= velocidade * 0.25;
        }

        if (nuvem.x < -50) {
            nuvem.x = LARGURA + Math.random() * 150;
            nuvem.y = 25 + Math.random() * 55;
        }
    }
}

// Cria obstáculos
function criarObstaculo() {
    const tipo = Math.random() < 0.7 ? 0 : 1;

    obstaculos.push({
        x: LARGURA + 10,
        largura: tipo === 0 ? 17 : 28,
        altura: tipo === 0 ? 35 + Math.random() * 8 : 42,
        tipo
    });
}

// Mostra a pontuação
function desenharPontuacao() {
    ctx.fillStyle = "#535353";
    ctx.font = "16px monospace";
    ctx.textAlign = "right";

    ctx.fillText(
        "HI " + String(recorde).padStart(5, "0"),
        LARGURA - 125,
        25
    );

    ctx.fillText(
        String(Math.floor(pontos)).padStart(5, "0"),
        LARGURA - 20,
        25
    );

    ctx.textAlign = "left";
}

// Verifica colisões
function verificarColisao(d, o) {
    const alturaDino = agachado && d.noChao ? 25 : 39;

    const esquerdaDino = d.x + 7;
    const direitaDino = d.x + d.largura - 4;
    const topoDino = d.y + d.altura - alturaDino;

    const esquerdaCacto = o.x + 2;
    const direitaCacto = o.x + o.largura - 2;
    const topoCacto = CHAO - o.altura + 3;

    return (
        direitaDino > esquerdaCacto &&
        esquerdaDino < direitaCacto &&
        d.y + d.altura - 3 > topoCacto &&
        topoDino < CHAO
    );
}

// Atualiza a lógica do jogo
function atualizar() {
    quadro++;
    dinossauro.animacao++;

    pontos += velocidade / 100;
    velocidade = 6 + Math.min(pontos / 100, 7);

    // Gravidade
    dinossauro.velocidadeY += 0.65;
    dinossauro.y += dinossauro.velocidadeY;

    // Faz o dinossauro pousar no chão
    if (dinossauro.y >= CHAO - dinossauro.altura) {
        dinossauro.y = CHAO - dinossauro.altura;
        dinossauro.velocidadeY = 0;
        dinossauro.noChao = true;
    } else {
        dinossauro.noChao = false;
    }

    // Cria obstáculos
    if (quadro % Math.max(35, Math.floor(95 - velocidade * 3)) === 0) {
        criarObstaculo();
    }

    // Move e verifica os obstáculos
    for (const obstaculo of obstaculos) {
        obstaculo.x -= velocidade;

        if (verificarColisao(dinossauro, obstaculo)) {
            jogoAtivo = false;
            recorde = Math.max(recorde, Math.floor(pontos));
        }
    }

    // Remove obstáculos que saíram da tela
    obstaculos = obstaculos.filter(
        obstaculo => obstaculo.x + obstaculo.largura > 0
    );
}

// Desenha todos os elementos
function desenhar() {
    ctx.clearRect(0, 0, LARGURA, ALTURA);

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    desenharNuvens();
    desenharChao();

    for (const obstaculo of obstaculos) {
        desenharCacto(obstaculo);
    }

    desenharDinossauro();
    desenharPontuacao();

    if (!jogoAtivo) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(0, 0, LARGURA, ALTURA);

        ctx.fillStyle = "#535353";
        ctx.textAlign = "center";
        ctx.font = "bold 22px monospace";
        ctx.fillText("FIM DE JOGO", LARGURA / 2, 105);

        ctx.font = "14px monospace";
        ctx.fillText(
            "Pressione ESPAÇO para tentar novamente",
            LARGURA / 2,
            135
        );

        ctx.textAlign = "left";
    }
}

// Loop principal
function loop(tempo) {
    if (tempo - ultimoTempo >= 16 || ultimoTempo === 0) {
        if (jogoAtivo) {
            atualizar();
        }

        desenhar();
        ultimoTempo = tempo;
    }

    if (jogoAtivo) {
        requestAnimationFrame(loop);
    }
}

// Controles do teclado
document.addEventListener("keydown", function(evento) {
    if (
        evento.code === "Space" ||
        evento.code === "ArrowUp" ||
        evento.code === "ArrowDown"
    ) {
        evento.preventDefault();
    }

    if (
        (evento.code === "Space" || evento.code === "ArrowUp") &&
        !evento.repeat
    ) {
        pular();
    }

    if (evento.code === "ArrowDown") {
        agachado = true;
    }
});

document.addEventListener("keyup", function(evento) {
    if (evento.code === "ArrowDown") {
        agachado = false;
    }
});

// Permite pular clicando na tela
canvas.addEventListener("pointerdown", pular);

// Botão para reiniciar
botaoReiniciar.addEventListener("click", reiniciarJogo);

// Inicia o jogo
reiniciarJogo();
