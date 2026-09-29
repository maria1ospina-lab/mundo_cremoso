function Inventario({
  cambiarPantalla,
  inventario
}) {
  const listaInventario = Object.entries(
    inventario
  ).map(([sabor, cantidad]) => ({
    sabor,
    cantidad
  }));

  const total = listaInventario.reduce(
    (suma, helado) =>
      suma + Number(helado.cantidad),
    0
  );

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

        <span>📦</span>

        <div>
          <h2>Mis helados</h2>

          <p>
            Helados disponibles actualmente.
          </p>
        </div>

      </div>

      <div className="inventario-lista">

        {listaInventario.map((helado) => (

          <div
            className="helado"
            key={helado.sabor}
          >

            <span>
              🍦 {helado.sabor}
            </span>

            <strong
              style={{
                backgroundColor:
                  helado.cantidad === 0
                    ? "#f5b5b5"
                    : "#f7b6c8"
              }}
            >
              {helado.cantidad}
            </strong>

          </div>

        ))}

      </div>

      <div className="total-inventario">

        <span>
          Total de helados
        </span>

        <strong>
          {total}
        </strong>

      </div>

    </div>
  );
}

export default Inventario;