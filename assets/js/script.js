
async function getConversion(input) {
    const res = await fetch(`https://mindicador.cl/api/`);
    const data = await res.json();
    const conv = parseFloat(data[input].valor)
    console.log(conv);
    return conv
};

async function getSeriemoneda(moneda) {
    const res = await fetch(`https://mindicador.cl/api/${moneda}`);
    const data_moneda = await res.json();
    console.log(data_moneda);
    return data_moneda
};

let myChart;

const buscar = document.getElementById("buscar");

buscar.addEventListener("click", (event) => {

    let input_clp = Number(document.getElementById("input-clp").value);

    console.log(input_clp)

    let input_moneda = document.getElementById("select-moneda").value;

    getConversion(input_moneda).then(
        resultado => {
            if (input_clp < 0) {

                alert("Monto en CLP debe ser positivo")

            } else if (input_clp === 0) {

                alert("Completar monto en CLP")

            }
            else {

                let valorConversion = resultado;

                let pesosAmoneda = (input_clp / valorConversion).toFixed(2);

                let resultadosConv = document.getElementById("resultados-conv");

                templateResultado = `Resultado: $ ${pesosAmoneda}`;

                resultadosConv.innerHTML = templateResultado;

            }
        }
    ).catch(error => {
        console.error(error);
    });

    getSeriemoneda(input_moneda).then(
        resultado => {

            let serieMoneda = resultado.serie.slice(0, 10).reverse();

            console.log(serieMoneda);

            let serieMonedafecha = serieMoneda.map(elemento => elemento.fecha.slice(0, 10));

            console.log(serieMonedafecha);

            let serieMonedavalor = serieMoneda.map(elemento => elemento.valor);

            console.log(serieMonedavalor);     

            if (typeof myChart !== 'undefined') {
                // Si existe un gráfico anterior, destrúyelo
                myChart.destroy();
            }

            var chart = document.getElementById('grafico');

            var ctx = chart.getContext('2d');

            var nuevoGrafico = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: serieMonedafecha,
                    datasets: [{
                        label: `Valores últimos 10 días del ${input_moneda}`,
                        data: serieMonedavalor,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            min: 790
                        }
                    }
                }
            });

            myChart = nuevoGrafico;
        }

    ).catch(error => {
        console.error(error);
    });

});