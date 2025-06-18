import Princesa from './princesa.js';
import iniciarFase3 from './fase3.js';

const canvas = document.getElementById('jogo');
const ctx = canvas.getContext('2d');

const spritesheet = new Image();
spritesheet.src = './IMG/spritesheet_princesa.png';
const fundo = new Image();
fundo.src = './IMG/fase2.png';
const obstaculoImg = new Image();
obstaculoImg.src = './IMG/obstaculo.png';
const moedaImg = new Image();
moedaImg.src = './IMG/moeda.png';

let princesa;
let obstaculos = [];
let moedas = [];
let tempo = 120;
let coletadas = 0;
let loopId, obstaculoId, moedaId, tempoId;

function gerarObstaculo() {
  const y = Math.random() * (canvas.height - 100);
  obstaculos.push({ x: canvas.width, y, largura: 70, altura: 100 });
}

function gerarMoeda() {
  let y, tentativa = 0;
  do {
    y = Math.random() * (canvas.height - 45);
    tentativa++;
  } while (
    obstaculos.some(obs => Math.abs(obs.y - y) < 100) &&
    tentativa < 20
  );
  moedas.push({ x: canvas.width, y, largura: 45, altura: 45 });
}

function atualizar() {
  princesa.atualizar();

  obstaculos.forEach((obs, i) => {
    obs.x -= 4;
    if (obs.x + obs.largura < 0) obstaculos.splice(i, 1);
    if (princesa.colidiu(obs)) {
      princesa.vidas--;
      obstaculos.splice(i, 1);
      if (princesa.vidas <= 0) morrer('Você perdeu!');
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
  ctx.fillText(`Vidas: ${princesa.vidas}`, 350, 30);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  atualizar();
  desenhar();
}

function morrer(mensagem) {
  parar();
  exibirReinicio(mensagem);
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
    iniciarFase2();
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

function iniciarFase2() {
  princesa = new Princesa(100, 200, spritesheet);
  obstaculos = [];
  moedas = [];
  tempo = 45;
  coletadas = 0;

  obstaculoId = setInterval(gerarObstaculo, 1300);
  moedaId = setInterval(gerarMoeda, 1000);
  tempoId = setInterval(() => {
    tempo--;
    if (tempo <= 0) {
      parar();
      iniciarFase3();
    }
  }, 1000);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') princesa.voar();
  });

  loopId = setInterval(loop, 30);
}

export default iniciarFase2;
