const $cuadro = document.querySelector('.container');
const $buttonIniciar = document.querySelector('.button-iniciar');
const $buttonDetener = document.querySelector('.button-detener');
const $divContador = document.querySelector('.div-contador');
const $input = document.getElementById('inputID');

//Cuadro
const anchoCuadro = 850;
const altoDeCuadro = 550;

//Usuario
const anchoUsuario = 50;
const altoUsuario = 50;

//altura de caja
const alturaCaja = 50;

//pocision inicial de usuario
const pocisionInicialUsuario = [380, 10];
let pocisionActualUsuario = pocisionInicialUsuario;

//musica
const $musica = document.getElementById('musica');
$musica.volume = 0.2;

//Comienzo de contador
$divContador.innerHTML = `<p>Timer : 0s</p><p>Record : 0s`;

//Record
let record = localStorage.getItem('record') || 0;

$buttonIniciar.addEventListener('click', () => {
  if ($input.value > 10 || $input.value < 0.1) {
    $cuadro.innerHTML = '<p>UN NUMERO ENTRE 0.1 Y 10</P>';
  } else {
    $musica.play();
    $cuadro.innerHTML = '';

    function definirUsuario() {
      usuario.style.left = pocisionActualUsuario[0] + 'px';
      usuario.style.bottom = pocisionActualUsuario[1] + 'px';
    }

    const usuario = document.createElement('div');
    usuario.classList.add('usuario');
    $cuadro.appendChild(usuario);

    definirUsuario();

    let contador = 0;

    let contadorInterval = setInterval(() => {
      contador = contador + 1;
      $divContador.innerHTML = `<p>Timer: ${contador}s</p>
      <p>Record : ${record}s</p>`;
    }, 1000);

    function moverUsuario(e) {
      switch (e.key) {
        case 'ArrowLeft':
          if (pocisionActualUsuario[0] > 0) {
            pocisionActualUsuario[0] -= 10;
            definirUsuario();
            return pocisionActualUsuario;
          }
          break;
        case 'ArrowRight':
          if (pocisionActualUsuario[0] < anchoCuadro - anchoUsuario - 10) {
            pocisionActualUsuario[0] += 10;
            definirUsuario();
            return pocisionActualUsuario;
          }
      }
    }

    document.addEventListener('keydown', moverUsuario);

    function createCajas() {
      const cajas = document.createElement('div');
      cajas.classList.add('cajas');
      $cuadro.appendChild(cajas);

      let xCord = Math.random() * 780;

      cajas.style.left = xCord + 'px';
      cajas.style.top = 0;

      const coordenadas = {
        x: xCord,
        y: 0,
      };

      function moveCajas() {
        coordenadas.y += 12;

        cajas.style.top = coordenadas.y + 'px';

        if (coordenadas.y > altoDeCuadro - altoUsuario) {
          $cuadro.removeChild(cajas);
          clearInterval(intervalId);
        }

        const cajaTop = cajas.offsetTop;
        const cajaBottom = cajaTop + cajas.clientHeight;
        const usuarioTop = usuario.offsetTop + 7;
        const usuarioBottom = usuarioTop + usuario.clientHeight;

        if (
          usuarioBottom > cajaTop &&
          usuarioTop < cajaBottom &&
          pocisionActualUsuario[0] + anchoUsuario > xCord &&
          pocisionActualUsuario[0] < xCord + cajas.clientWidth
        ) {
          $musica.pause();
          document.removeEventListener('keydown', moverUsuario);
          $cuadro.innerHTML = '<p>HAZ COLISIONADO</p>';

          if (record < contador) {
            record = contador;
            localStorage.setItem('record', record);
            $divContador.innerHTML = `<p>Timer : 0</p>
            <p>Record : ${record}`;
          } else {
            $divContador.innerHTML = `<p>Timer : 0</p>
            <p>Record : ${record}</p>`;
          }

          clearInterval(createInterval);
          clearInterval(intervalId);
          clearInterval(contadorInterval);
        }
      }

      const intervalId = setInterval(moveCajas, 80);
    }
  }

  let createInterval;
  if (!createInterval) {
    createInterval = setInterval(createCajas, $input.value * 1000);
  }
});

$buttonDetener.addEventListener('click', detenerJuego);
function detenerJuego() {
  location.reload();
}
