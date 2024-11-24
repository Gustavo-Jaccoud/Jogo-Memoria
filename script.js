const gradeCartas = document.getElementById('grade-cartas');
const contadorTentativas = document.getElementById('contador-tentativas');
const contadorTentativasContainer = document.getElementById('contador-tentativas-container');
const mensagemVitoria = document.getElementById('mensagem-vitoria');
const historicoTentativas = document.getElementById('historico-tentativas');
const botaoReiniciar = document.getElementById('botao-reiniciar');


let tentativas = 0;
let cartasViradas = [];
let paresEncontrados = 0;


const imagens = [
  'img/image1.png', 'img/image2.png', 'img/image3.png',
  'img/image1.png', 'img/image2.png', 'img/image3.png'
];


function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}


function carregarHistorico() {
  const historico = JSON.parse(localStorage.getItem('historicoTentativas')) || [];
  historicoTentativas.innerHTML = `<ul>${historico.map(tentativa => `<li>${tentativa} tentativas</li>`).join('')}</ul>`;
}


function salvarTentativaNoHistorico(tentativas) {
  const historico = JSON.parse(localStorage.getItem('historicoTentativas')) || [];
  historico.unshift(tentativas); 
  localStorage.setItem('historicoTentativas', JSON.stringify(historico));
  carregarHistorico();
}


function criarCartas() {
  gradeCartas.innerHTML = '';
  paresEncontrados = 0;
  cartasViradas = [];
  tentativas = 0;
  contadorTentativas.textContent = tentativas;
  contadorTentativasContainer.style.display = 'block'; 
  mensagemVitoria.style.display = 'none'; 

  const imagensEmbaralhadas = embaralhar([...imagens]);
  imagensEmbaralhadas.forEach(imagem => {
    const carta = document.createElement('div');
    carta.className = 'carta';
    carta.dataset.imagem = imagem;

    const img = document.createElement('img');
    img.src = imagem;
    carta.appendChild(img);

    carta.addEventListener('click', () => virarCarta(carta));
    gradeCartas.appendChild(carta);
  });
}


function virarCarta(carta) {
  if (carta.classList.contains('virada') || cartasViradas.length === 2) return;

  carta.classList.add('virada');
  cartasViradas.push(carta);

  if (cartasViradas.length === 2) {
    tentativas++;
    contadorTentativas.textContent = tentativas;

    const [carta1, carta2] = cartasViradas;
    if (carta1.dataset.imagem === carta2.dataset.imagem) {
      paresEncontrados++;
      cartasViradas = [];
      if (paresEncontrados === imagens.length / 2) {
        mensagemVitoria.style.display = 'block';
        contadorTentativasContainer.style.display = 'none'; 
        salvarTentativaNoHistorico(tentativas);
      }
    } else {
      setTimeout(() => {
        carta1.classList.remove('virada');
        carta2.classList.remove('virada');
        cartasViradas = [];
      }, 1000);
    }
  }
}


botaoReiniciar.addEventListener('click', criarCartas);
document.addEventListener('DOMContentLoaded', () => {
  criarCartas();
  carregarHistorico();
});