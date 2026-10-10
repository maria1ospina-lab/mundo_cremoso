import { useState } from "react";
import saboresLista from "../data/sabores";

function Venta({
  cambiarPantalla,
  inventario,
  registrarVenta,
  sabores
}) {
  const [cantidades, setCantidades] = useState({});
  const [modalidad, setModalidad] = useState("normal");
  const [guardando, setGuardando] = useState(false);

  function cambiarCantidad(sabor, cantidad) {
    const valor = cantidad === "" ? "" : Math.max(0, Number(cantidad));

    setCantidades((anteriores) => ({
      ...anteriores,
      [sabor]: valor
    }));
  }

  function obtenerSabor(nombre) {
    return sabores.find((item) => item.nombre === nombre);
  }

  function obtenerPrecio(nombre) {
    const sabor = obtenerSabor(nombre);

    if (!sabor) return 0;

    if (modalidad === "mayorista") {
      return Number(
        sabor.precio_mayorista ?? sabor.precio ?? 0
      );
    }

    return Number(sabor.precio ?? 0);
  }

  const totalHelados = Object.values(cantidades).reduce(
    (total, cantidad) => total + (Number(cantidad) || 0),
    0
  );

  const totalVenta = saboresLista.reduce((total, nombre) => {
    const cantidad = Number(cantidades[nombre]) || 0;

    return total + cantidad * obtenerPrecio(nombre);
  }, 0);

  async function guardarVenta() {
    if (guardando) return;

    if (totalHelados <= 0) {
      alert("Debes colocar la cantidad de al menos un sabor.");
      return;
    }

    for (const nombre of saboresLista) {
      const cantidad = Number(cantidades[nombre]) || 0;
      const disponible = Number(inventario[nombre]) || 0;

      if (!Number.isInteger(cantidad) || cantidad < 0) {
        alert(`La cantidad de ${nombre} no es válida.`);
        return;
      }

      if (cantidad > disponible) {
        alert(
          `No hay suficientes helados de ${nombre}.\n\n` +
          `Disponibles: ${disponible}\n` +
          `Solicitados: ${cantidad}`
        );
        return;
      }
    }

    setGuardando(true);

    try {
      const ventaCorrecta = await registrarVenta(
        cantidades,
        modalidad
      );

      if (!ventaCorrecta) return;

      setCantidades({});
      setModalidad("normal");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="pantalla">
      <button
        className="btn-volver"
        onClick={() => cambiarPantalla("inicio")}
      >
        ← Volver al inicio
      </button>

      <div className="titulo-pantalla">
        <span>🍦</span>

        <div>
          <h2>Vender helado</h2>
          <p>Selecciona el tipo de venta y las cantidades.</p>
        </div>
      </div>

      <div className="formulario">
        <label htmlFor="modalidad-venta">
          Tipo de venta
        </label>

        <select
          id="modalidad-venta"
          value={modalidad}
          onChange={(e) => setModalidad(e.target.value)}
          disabled={guardando}
        >
          <option value="normal">Venta normal</option>
          <option value="mayorista">Venta al por mayor</option>
        </select>

        <p>
          {modalidad === "normal"
            ? "Se aplicarán los precios normales."
            : "Se aplicarán los precios mayoristas configurados."}
        </p>

        <label>
          Cantidad vendida por sabor
        </label>

        <div className="sabores-venta">
          {saboresLista.map((nombre) => {
            const disponible = Number(inventario[nombre]) || 0;
            const precio = obtenerPrecio(nombre);
            const cantidad = Number(cantidades[nombre]) || 0;

            return (
              <div className="sabor-venta" key={nombre}>
                <div className="nombre-sabor">
                  <span>{nombre}</span>
                </div>

                <div>
                  <input
                    className="cantidad-venta"
                    type="number"
                    min="0"
                    max={disponible}
                    step="1"
                    placeholder={
                      disponible === 0 ? "Agotado" : "Cantidad"
                    }
                    value={cantidades[nombre] ?? ""}
                    disabled={disponible === 0 || guardando}
                    onChange={(e) =>
                      cambiarCantidad(nombre, e.target.value)
                    }
                  />

                  <small className="disponibles">
                    {disponible === 0
                      ? "AGOTADO"
                      : `Disponibles: ${disponible}`}
                  </small>

                  <small className="disponibles">
                    Precio unitario: ${precio.toLocaleString("es-CO")}
                  </small>

                  {cantidad > 0 && (
                    <small className="disponibles">
                      Subtotal: ${(cantidad * precio).toLocaleString("es-CO")}
                    </small>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="resumen-venta">
          <div>
            <span>Total de helados</span>
            <strong>{totalHelados}</strong>
          </div>

          <div className="total-final">
            <span>Total de la venta</span>
            <strong>
              ${totalVenta.toLocaleString("es-CO")}
            </strong>
          </div>
        </div>

        <button
          className="btn-principal"
          onClick={guardarVenta}
          disabled={guardando || totalHelados <= 0}
        >
          {guardando ? "Guardando venta..." : "Registrar venta"}
        </button>
      </div>
    </div>
  );
}

export default Venta;