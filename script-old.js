const numberRegex = /^\d+$/;
const inputFields = document.querySelectorAll(".input__numerico");
const clearInputs = document.getElementById("clearInputs");
const calcularMMIK = document.getElementById("calcularMMIK");

document.addEventListener("DOMContentLoaded", (event) => {
  inputFields.forEach((inputField) => {
    let commaPressed = false;
    inputField.addEventListener("keydown", function (event) {
      if (
        (event.key >= "0" && event.key <= "9") ||
        event.key === "Backspace" ||
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
    let valor_capacidad = document.getElementById('input-capacidad').value;
    let valor_lambda = document.getElementById('input-tasa-llegada').value;
    let valor_mu = document.getElementById('input-tasa-servicio').value;
    console.log(`valores: ${valor_capacidad}, ${valor_lambda}, ${valor_mu}`);

    let rho = parseInt(valor_lambda) / parseInt(valor_mu);

    document.getElementById('p-result').innerHTML = rho;
}
