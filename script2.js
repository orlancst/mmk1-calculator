const numberRegex = /^\d+$/;
const inputFields = document.querySelectorAll(".input__numerico");
const clearInputs = document.getElementById("clearInputs");
const calcularMMIK = document.getElementById("calcularMMIK");
const no__valido = document.querySelector(".no__valido");
const resultado = document.querySelectorAll(".resultado");
const tabla_datos = document.getElementById("tabla_datos");

document.addEventListener("DOMContentLoaded", (event) => {
  inputFields.forEach((inputField) => {
    let commaPressed = false;
    inputField.addEventListener("keydown", function (event) {
      if (
        (event.key >= "0" && event.key <= "9") ||
        event.key === "Backspace" ||
        event.key === "Tab" ||
        (event.key === "," &&
          !commaPressed &&
          inputField.value.length > 0 &&
          inputField.value.length < 5)
      ) {
        if (event.key === ",") {
          commaPressed = true;
        }
      } else {
        event.preventDefault();
      }
    });

    inputField.addEventListener("keyup", function (event) {
      if (event.key === ",") {
        commaPressed = false;
      }
    });
  });

  clearInputs.addEventListener("click", function () {
    clearInputFields();
  });

  calcularMMIK.addEventListener("click", function () {
    calcular();
  });
});

function clearInputFields() {
  inputFields.forEach((inputField) => {
    inputField.value = "";
  });
}

function calcular() {
  let valorCapacidadMaxima = document.getElementById('input-capacidad').value;
  let valorTasaLlegada = document.getElementById('input-tasa-llegada').value;
  let valorTasaServicio = document.getElementById('input-tasa-servicio').value;

  console.log(`valores: ${valorCapacidadMaxima}, ${valorTasaLlegada}, ${valorTasaServicio}`);

  if (valorCapacidadMaxima == '' || valorTasaLlegada == '' || valorTasaServicio == '') {
    no__valido.classList.remove('d-none');
    return false;
  }

  if (!no__valido.classList.contains('d-none')) {
    no__valido.classList.add('d-none');
  }

  resultado.forEach(function(ele) {
    ele.classList.remove('d-none');
  });

  const lambda = Number(valorTasaLlegada);
  const mu = Number(valorTasaServicio);
  const k = Number(valorCapacidadMaxima);

  const rho = lambda / mu;

  const probabilidadesEstados = [];

  for (let n = 0, acumulador = 0; n <= k + 6; n++) {
    const probabilidad = getProbabilidadEstado(n);
    acumulador += probabilidad;
    probabilidadesEstados.push(
      [n, probabilidad, acumulador > 1 ? 1 : acumulador]
    );
  }

  //console.log(probabilidadesEstados);

  let str = '';
  let cond2 = false;
  probabilidadesEstados.forEach(function(arr) {
    let cond = '';
    if (!cond2 && parseInt(arr[2]) == 1) {
      cond = 'resaltar-amarillo';
      cond2 = true;
    }

    str += `<tr class="${cond}">
                <td><span class="text-muted">${arr[0]}</span></td>
                <td>${arr[1]}</td>
                <td>${arr[2]}</td>
            </tr>`;
  })

  tabla_datos.innerHTML = str;

  const Ls = rho / (1 - rho) - ((k + 1) * rho ** (k + 1)) / (1 - rho ** (k + 1));
  const Lq = Ls - (1 - probabilidadesEstados[0][1]);
  const lambdaEfectiva = lambda * probabilidadesEstados[k - 1][2];
  const Ws = Ls / lambdaEfectiva;
  const Wq = Lq / lambdaEfectiva;

  console.log(`
   Ls: ${Math.round(Ls * 100) / 100}
   Lq: ${Math.round(Lq * 100) / 100}
   Ws: ${Math.round(Ws * 100) / 100}
   Wq: ${Math.round(Wq * 100) / 100}
  `);

  function getProbabilidadEstado(n) {
    return n > k ? 0 : (1 - rho) / (1 - rho ** (k + 1)) * rho ** n;
  }

  document.getElementById('p-result').innerHTML = rho.toFixed(3);
  document.getElementById('ls-result').innerHTML = Ls.toFixed(3);
  document.getElementById('lq-result').innerHTML = Lq.toFixed(3);
  document.getElementById('ws-result').innerHTML = (Ws * 60).toFixed(0) + ' minutos';
  document.getElementById('wq-result').innerHTML = (Wq * 60).toFixed(0) + ' minutos';
  document.getElementById('tef-result').innerHTML = lambdaEfectiva.toFixed(3);
  document.getElementById('p0-result').innerHTML = probabilidadesEstados[0][1];
}

