import Header from "../components/Header";
import MenuCard from "../components/MenuCard";

function Inicio({ cambiarPantalla }) {
  return (
    <div className="app">

      <Header />

      <main className="contenido">

        <div className="saludo">
          <h2>¡Hola! 👋</h2>
          <p>¿Qué deseas hacer?</p>
        </div>

        <div className="menu-grid">

          <MenuCard
            icono="📦"
            titulo="Mis helados"
            descripcion="Ver cuántos helados quedan"
            onClick={() =>
              cambiarPantalla("inventario")
            }
          />

          <MenuCard
            icono="🧊"
            titulo="Producción"
            descripcion="Registrar los helados preparados"
            onClick={() =>
              cambiarPantalla("produccion")
            }
          />

          <MenuCard
            icono="🍦"
            titulo="Vender helado"
            descripcion="Registrar una venta"
            onClick={() =>
              cambiarPantalla("venta")
            }
          />

          <MenuCard
            icono="💰"
            titulo="Resumen"
            descripcion="Ver las ventas del día"
            onClick={() =>
              cambiarPantalla("resumen")
            }
          />

          <MenuCard
            icono="⚙️"
            titulo="Administración"
            descripcion="Precios, gastos, deudas y reportes"
            onClick={() =>
              cambiarPantalla("admin")
            }
          />

        </div>

      </main>

      <footer>
        🍦 Mundo Cremoso de Pao G
      </footer>

    </div>
  );
}

export default Inicio;