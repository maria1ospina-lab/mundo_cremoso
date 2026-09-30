import { useState } from "react";
import saboresLista from "../data/sabores";

function Venta({
  cambiarPantalla,
  inventario,
  registrarVenta,
  sabores
}) {
  const [cantidades, setCantidades] = useState({});

  function cambiarCantidad(sabor, cantidad) {
    const valor =
      cantidad === ""
        ? 0
        : Number(cantidad);

    setCantidades((anteriores) => ({
      ...anteriores,
      [sabor]: valor
    }));
  }

  function obtenerPrecio(saborNombre) {
    const sabor = sabores.find(
      (item) =>
        item.nombre === saborNombre
    );

    return sabor?.precio || 0;
  }

  const totalHelados =
    Object.values(cantidades).reduce(
      (total, cantidad) =>
        total + Number(cantidad),
      0
    );

  const totalVenta =
    saboresLista.reduce(
      (total, sabor) => {
        const cantidad =
          cantidades[sabor] || 0;

        const precio =
          obtenerPrecio(sabor);

        return (
          total +
          Number(cantidad) *
            Number(precio)
        );
      },
      0
    );

  async function guardarVenta() {
    if (totalHelados === 0) {
      alert(
        "Debes colocar la cantidad de al menos un sabor."
      );
      return;
    }

    for (const sabor of saboresLista) {
      const cantidadVenta =
        cantidades[sabor] || 0;

      const disponible =
        inventario[sabor] || 0;

      if (cantidadVenta > disponible) {
        alert(
          `No hay suficientes helados de ${sabor}.\n\n` +
          `Disponibles: ${disponible}\n` +
          `Solicitados: ${cantidadVenta}`
        );

        return;
      }
    }

    const ventaCorrecta =
      await registrarVenta(cantidades);

    if (!ventaCorrecta) {
      return;
    }

    setCantidades({});
  }

  return (
    <div className="pantalla">

      <button
        className="btn-volver"
        onClick={() =>
          cambiarPantalla("inicio")
        }
      >
        ← Volver al inicio
      </button>

      <div className="titulo-pantalla">

        <span>🍦</span>

        <div>
          <h2>Vender helado</h2>

          <p>
            Coloca la cantidad de cada sabor vendido.
          </p>
        </div>

      </div>

      <div className="formulario">

        <label>
          Cantidad vendida por sabor
        </label>

        <div className="sabores-venta">

          {saboresLista.map((sabor) => {

            const disponible =
              inventario[sabor] || 0;

            const precio =
              obtenerPrecio(sabor);

            return (

              <div
                className="sabor-venta"
                key={sabor}
              >

                <div className="nombre-sabor">
                  <span>{sabor}</span>
                </div>

                <div>

                  <input
                    className="cantidad-venta"
                    type="number"
                    min="0"
                    max={disponible}
                    placeholder={
                      disponible === 0
                        ? "Agotado"
                        : "Cantidad"
                    }
                    value={
                      cantidades[sabor] || ""
                    }
                    disabled={
                      disponible === 0
                    }
                    onChange={(e) =>
                      cambiarCantidad(
                        sabor,
                        e.target.value
                      )
                    }
                  />

                  <small className="disponibles">
                    {disponible === 0
                      ? "AGOTADO"
                      : `Disponibles: ${disponible}`}
                  </small>

                  <small className="disponibles">
                    Precio: $
                    {precio.toLocaleString(
                      "es-CO"
                    )}
                  </small>

                </div>

              </div>

            );
          })}

        </div>

        <div className="resumen-venta">

          <div>
            <span>
              Total de helados
            </span>

            <strong>
              {totalHelados}
            </strong>
          </div>

          <div className="total-final">

            <span>
              Total de la venta
            </span>

            <strong>
              $
              {totalVenta.toLocaleString(
                "es-CO"
              )}
            </strong>

          </div>

        </div>

        <button
          className="btn-principal"
          onClick={guardarVenta}
        >
          Registrar venta
        </button>

      </div>

    </div>
  );
}

export default Venta;