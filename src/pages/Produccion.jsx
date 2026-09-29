import { useState } from "react";
import sabores from "../data/sabores";

function Produccion({
  cambiarPantalla,
  agregarProduccion
}) {
  const [cantidades, setCantidades] = useState({});
  const [litros, setLitros] = useState("");

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

  const totalHelados =
    Object.values(cantidades).reduce(
      (total, cantidad) =>
        total + Number(cantidad),
      0
    );

  async function guardarProduccion() {
    if (totalHelados === 0) {
      alert(
        "Debes colocar la cantidad de al menos un sabor."
      );
      return;
    }

    const produccionReal = {};

    Object.entries(cantidades).forEach(
      ([sabor, cantidad]) => {
        if (Number(cantidad) > 0) {
          produccionReal[sabor] =
            Number(cantidad);
        }
      }
    );

    const guardado =
      await agregarProduccion(
        produccionReal,
        litros
      );

    if (!guardado) {
      return;
    }

    alert(
      `Producción registrada correctamente.\n\n` +
      `Litros preparados: ${litros || 0}\n` +
      `Total de helados: ${totalHelados}`
    );

    setCantidades({});
    setLitros("");
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
        <span>🧊</span>

        <div>
          <h2>Registrar producción</h2>
          <p>
            Registra los helados preparados hoy.
          </p>
        </div>
      </div>

      <div className="formulario">
        <label>
          ¿Cuántos litros preparaste?
        </label>

        <input
          type="number"
          min="0"
          step="0.1"
          placeholder="Ejemplo: 10"
          value={litros}
          onChange={(e) =>
            setLitros(e.target.value)
          }
        />

        <label>
          Cantidad preparada por sabor
        </label>

        <div className="sabores-produccion">
          {sabores.map((sabor) => (
            <div
              className="sabor-produccion"
              key={sabor}
            >
              <span>{sabor}</span>

              <input
                className="cantidad-sabor"
                type="number"
                min="0"
                placeholder="Cantidad"
                value={
                  cantidades[sabor] || ""
                }
                onChange={(e) =>
                  cambiarCantidad(
                    sabor,
                    e.target.value
                  )
                }
              />
            </div>
          ))}
        </div>

        <div className="total-venta">
          <span>
            Total de helados preparados
          </span>

          <strong>{totalHelados}</strong>
        </div>

        <button
          className="btn-principal"
          onClick={guardarProduccion}
        >
          Guardar producción
        </button>
      </div>
    </div>
  );
}

export default Produccion;