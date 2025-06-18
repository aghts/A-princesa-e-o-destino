export default class Princesa {
  constructor(x, y, imagem) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.largura = 50;
    this.altura = 70;
    this.gravidade = 0.5;
    this.pulo = -10;
    this.imagem = imagem;

    this.larguraSprite = 264;
    this.alturaSprite = 512;
    this.frameX = 0;
    this.frameY = 0;
    this.frames = 3;
    this.linhas = 1;
    this.contador = 0;
    this.vidas = 5;
  }

  atualizar() {
    this.vy += this.gravidade;
    this.y += this.vy;

    if (this.y + this.altura > 400) {
      this.y = 400 - this.altura;
      this.vy = 0;
    }
    if (this.y < 0) this.y = 0;

    this.contador++;
    if (this.contador % 5 === 0) {
      this.frameX = (this.frameX + 1) % this.frames;
      if (this.frameX === 0) {
        this.frameY = (this.frameY + 1) % this.linhas;
      }
    }
  }

  desenhar(ctx) {
    ctx.drawImage(
      this.imagem,
      this.frameX * this.larguraSprite,
      this.frameY * this.alturaSprite,
      this.larguraSprite,
      this.alturaSprite,
      this.x,
      this.y,
      this.largura,
      this.altura
    );
  }

  voar() {
    this.vy = this.pulo;
  }

   colidiu(obj) {
    // Hitbox precisa e centralizada
    const hitbox = {
      x: this.x + this.largura * 0.35,   // margem lateral maior
      y: this.y + this.altura * 0.4,     // margem superior maior
      largura: this.largura * 0.3,       // reduzida para 30% da largura
      altura: this.altura * 0.25         // reduzida para 25% da altura
    };

    return (
      hitbox.x < obj.x + obj.largura &&
      hitbox.x + hitbox.largura > obj.x &&
      hitbox.y < obj.y + obj.altura &&
      hitbox.y + hitbox.altura > obj.y
    );
  }

}
