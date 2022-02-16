(function () {

  const FPS = 50;
  const TAMX = 300;
  const TAMY = 400;
  const PROB_ARVORE = 2;

  let montanha;
  let skier;

  const arvores = [];
  
  function init() {
    montanha = new Montanha();
    skier = new Skier();
    setInterval(run, 1000/FPS);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') skier.mudarDirecao(-1)
    else if (e.key === 'ArrowRight') skier.mudarDirecao(+1);
  })

  class Montanha {
    constructor() {
      this.element = document.getElementById('montanha');
      this.element.style.width = `${TAMX}px`;
      this.element.style.height = `${TAMY}px`;
    }
  }

  class Skier {
    constructor() {
      this.element = document.getElementById('skier');
      this.direcoes = ['para-esquerda', 'para-frente', 'para-direita'];
      this.direcao = 1;
      this.velocidadeHorizontal = 0;
      this.element.className = this.direcoes[this.direcao];
      this.element.style.top = '20px';
      this.element.style.left = parseInt(TAMX/2)-8 + 'px';
    }
    mudarDirecao(giro) {
      if (this.direcao + giro >= 0 && this.direcao + giro <= 2) {
        this.direcao += giro;
        this.element.className = this.direcoes[this.direcao];
      }
    }
    andar() {
      const atrito = 0.1;
      const velocidadeMaxima = 3;
      const aceleracaoNormal = 0.5;
      
      let velocidadeHorizontal = this.velocidadeHorizontal;
      const orientacao = this.direcao -1 ;

      // desaceleração o skier horizontalmente
      if(orientacao===0 && velocidadeHorizontal !== 0) {
        // verifica se o skier está indo para esquerda ou para direita
        const sinal = velocidadeHorizontal / Math.abs(velocidadeHorizontal);
        // cria atrito no chão
        velocidadeHorizontal -= atrito*sinal;
        // se a velocidade for pequena, freia
        if(Math.abs(velocidadeHorizontal) < 0.1) {
          velocidadeHorizontal = 0;
        }
      }
      // aceleração do skier horizontalmente
      else{
        // arranque inicial
        if(velocidadeHorizontal === 0){
          velocidadeHorizontal = orientacao;
        }
        // aceleração normal
        else{
          velocidadeHorizontal += aceleracaoNormal*orientacao;
          if(Math.abs(velocidadeMaxima) < Math.abs(velocidadeHorizontal)){
            velocidadeHorizontal = velocidadeMaxima*orientacao;
          }
        }
      }
      // atualiza velocidade do skier
      this.velocidadeHorizontal = velocidadeHorizontal;
      // calcula nova posição do skier
      const novaPosicao = parseInt(this.element.style.left) + velocidadeHorizontal;
      // verifica se a nova posição é válida
      if((novaPosicao > 0 && velocidadeHorizontal<0) || (novaPosicao < TAMX - this.element.clientWidth && velocidadeHorizontal>0)) {
        this.element.style.left = novaPosicao + 'px';
      }

    }
  }

  class Arvore {
    constructor() {
      this.element = document.createElement('div');
      this.element.className = 'arvore';
      montanha.element.appendChild(this.element);
      this.element.style.top = `${TAMY}px`;
      this.element.style.left = Math.floor(Math.random() * TAMX) + 'px';
    }
  }

  function run() {
    const random = Math.random() * 100;
    if (random <= PROB_ARVORE) {
      const arvore = new Arvore();
      arvores.push(arvore);
    }
    arvores.forEach(a => {
      a.element.style.top = parseInt(a.element.style.top)-1 + 'px';
    })
    skier.andar();
  }

  init();

})()