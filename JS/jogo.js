import Princesa from './princesa.js';
import iniciarFase2 from './fase2.js';

const canvas = document.getElementById('jogo');
const ctx = canvas.getContext('2d');

const spritesheet = new Image();
spritesheet.src = './IMG/spritesheet_princesa.png';
const fundo = new Image();
fundo.src = './IMG/fase1.png';
const obstaculoImg = new Image();
obstaculoImg.src = './IMG/obstaculo.png';
const moedaImg = new Image();
moedaImg.src = './IMG/moeda.png';
const cutscene1 = new Image();
cutscene1.src = './IMG/cutscene1.png';
const cutscene2 = new Image();
cutscene2.src = './IMG/cutscene2.png';
const capa = new Image();
capa.src = './IMG/comeco.png';

let princesa, obstaculos, moedas, tempo, coletadas, vidas;
let loopId, obstaculoId, moedaId, tempoId;

function carregarImagens(callback) {
  let carregadas = 0;
  const total = 6;
  [spritesheet, fundo, obstaculoImg, moedaImg, cutscene1, cutscene2].forEach(img => {
    img.onload = () => {
      carregadas++;
      if (carregadas === total) callback();
    };
  });
}

function gerarObstaculo() {
  const y = Math.random() * (canvas.height - 60);
  obstaculos.push({ x: canvas.width, y, largura: 70, altura: 100 });
}

function gerarMoeda() {
  let y;
  let tentativa = 0;
  do {
    y = Math.random() * (canvas.height - 45);
    tentativa++;
  } while (obstaculos.some(obs => Math.abs(obs.y - y) < 250) && tentativa < 20);

  moedas.push({ x: canvas.width, y, largura: 45, altura: 45 });
}

function atualizar() {
  princesa.atualizar();

  obstaculos.forEach((obs, i) => {
    obs.x -= 4;
    if (obs.x + obs.largura < 0) obstaculos.splice(i, 1);
    if (princesa.colidiu(obs)) {
      vidas--;
      obstaculos.splice(i, 1);
      if (vidas <= 0) morrer();
    }
  });

  moedas.forEach((moeda, i) => {
    moeda.x -= 4;
    if (moeda.x + moeda.largura < 0) moedas.splice(i, 1);
    if (princesa.colidiu(moeda)) {
      coletadas++;
      moedas.splice(i, 1);
    }
  });
}

function desenhar() {
  ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height);
  princesa.desenhar(ctx);
  obstaculos.forEach(obs => ctx.drawImage(obstaculoImg, obs.x, obs.y, obs.largura, obs.altura));
  moedas.forEach(m => ctx.drawImage(moedaImg, m.x, m.y, m.largura, m.altura));

  ctx.fillStyle = '#fff';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Moedas: ${coletadas}`, 20, 30);
  ctx.fillText(`Tempo: ${tempo}s`, 680, 30);
  ctx.fillText(`Vidas: ${vidas}`, 350, 30);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  atualizar();
  desenhar();
}

function morrer() {
  parar();
  somprincesa.pause();           // Para a música
  somprincesa.currentTime = 0;   // Reinicia a música
  exibirReinicio('Você perdeu!');
}

function exibirReinicio(mensagem) {
  const container = document.createElement('div');
  const canvasRect = canvas.getBoundingClientRect();

  container.style.position = 'absolute';
  container.style.top = `${canvasRect.top + canvas.height / 2}px`;
  container.style.left = `${canvasRect.left + canvas.width / 2}px`;
  container.style.transform = 'translate(-50%, -50%)';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.color = '#fff';
  container.style.fontSize = '28px';
  container.style.zIndex = '1000';
  container.style.fontFamily = 'sans-serif';
  container.style.textShadow = '2px 2px 5px #000';

  const msg = document.createElement('div');
  msg.textContent = mensagem;
  msg.style.marginBottom = '20px';

  const botao = document.createElement('button');
  botao.textContent = 'Jogar novamente';
  botao.style.fontSize = '20px';
  botao.style.padding = '10px 20px';
  botao.style.cursor = 'pointer';
  botao.onclick = () => {
    document.body.removeChild(container);
    iniciarJogo();
  };

  container.appendChild(msg);
  container.appendChild(botao);
  document.body.appendChild(container);
}

function parar() {
  clearInterval(loopId);
  clearInterval(obstaculoId);
  clearInterval(moedaId);
  clearInterval(tempoId);
}

function iniciarJogo() {
  princesa = new Princesa(100, 200, spritesheet);
  obstaculos = [];
  moedas = [];
  tempo = 30;
  coletadas = 0;
  vidas = 5;

  obstaculoId = setInterval(gerarObstaculo, 1500);
  moedaId = setInterval(gerarMoeda, 1200);
  tempoId = setInterval(() => {
    tempo--;
    if (tempo <= 0) {
      parar();
      iniciarFase2();
    }
  }, 1000);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') princesa.voar();
  });

  loopId = setInterval(loop, 30);
}

function iniciarCutscene() {
  ctx.drawImage(cutscene1, 0, 0, canvas.width, canvas.height);
  setTimeout(() => {
    ctx.drawImage(cutscene2, 0, 0, canvas.width, canvas.height);
    setTimeout(() => {
      exibirCapa();
    }, 5000);
  }, 5000);
}

const somprincesa = new Audio("./SND/super-pianos-200376.mp3");
somprincesa.loop = true;

function exibirCapa() {
  ctx.drawImage(capa, 0, 0, canvas.width, canvas.height);
  const botao = document.createElement('button');
  botao.textContent = 'Jogar';
  botao.style.position = 'absolute';
  const rect = canvas.getBoundingClientRect();
  botao.style.top = `${rect.top + canvas.height / 2}px`;
  botao.style.left = `${rect.left + canvas.width / 2}px`;
  botao.style.transform = 'translate(-50%, -50%)';
  botao.style.fontSize = '20px';
  botao.style.padding = '10px 20px';
  botao.style.cursor = 'pointer';
  botao.style.zIndex = '1000';
  botao.style.backgroundColor = '#e91e63';
  botao.style.color = '#fff';
  botao.style.border = 'none';
  botao.style.borderRadius = '5px';

  botao.onclick = () => {
    somprincesa.play(); // Música começa aqui
    document.body.removeChild(botao);
    iniciarJogo();
  };

  document.body.appendChild(botao);
}

carregarImagens(iniciarCutscene);
