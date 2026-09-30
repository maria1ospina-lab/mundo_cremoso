import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

function Resumen({ cambiarPantalla }) {
  const ahora = new Date();

  const [anio, setAnio] = useState(
    ahora.getFullYear()
  );

  const [mes, setMes] = useState(
    ahora.getMonth() + 1
  );

  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(false);

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  async function cargarReporte() {
    setCargando(true);

    const { data, error } =
      await supabase.rpc(
        "obtener_reporte_mensual",
        {
          p_anio: Number(anio),
          p_mes: Number(mes)
        }
      );

    if (error) {
      console.error(error);

      alert(
        error.message ||
          "No se pudo cargar el resumen."
      );

      setCargando(false);
      return;
    }

    setReporte(data);
    setCargando(false);
  }

  useEffect(() => {
    cargarReporte();
  }, []);

  function imprimirRecibo() {
    window.print();
  }

  return (
    <div className="pantalla resumen-mensual">

      <button
        className="btn-volver no-print"
        onClick={() =>
          cambiarPantalla("inicio")
        }
      >
        ← Volver al inicio
      </button>

      <div className="titulo-pantalla">

        <span>💰</span>

        <div>
          <h2>Resumen mensual</h2>

          <p>
            Consulta las cuentas del negocio por mes.
          </p>
        </div>

      </div>

      {/* SELECCIÓN DEL MES */}

      <div className="formulario selector-mes no-print">

        <h3>
          📅 Seleccionar periodo
        </h3>

        <div className="selector-mes-grid">

          <div>
            <label>
              Año
            </label>

            <input
              type="number"
              value={anio}
              onChange={(e) =>
                setAnio(e.target.value)
              }
            />
          </div>

          <div>
            <label>
              Mes
            </label>

            <select
              value={mes}
              onChange={(e) =>
                setMes(e.target.value)
              }
            >
              {meses.map(
                (nombre, index) => (
                  <option
                    key={nombre}
                    value={index + 1}
                  >
                    {nombre}
                  </option>
                )
              )}
            </select>
          </div>

        </div>

        <button
          className="btn-principal"
          onClick={cargarReporte}
        >
          📊 Consultar mes
        </button>

      </div>

      {/* CARGANDO */}

      {cargando && (
        <div className="formulario">
          <p>
            Cargando información...
          </p>
        </div>
      )}

      {/* REPORTE */}

      {reporte && !cargando && (

        <div className="reporte-mensual">

          <div className="reporte-encabezado">

            <h2>
              🍦 Mundo Cremoso de Pao G
            </h2>

            <h3>
              Resumen de{" "}
              {meses[Number(mes) - 1]}{" "}
              {anio}
            </h3>

            <p>
              Reporte mensual del negocio
            </p>

          </div>

          <div className="resumen-grid">

            <div className="resumen-card">
              <span>🧊</span>

              <p>
                Producciones
              </p>

              <strong>
                {reporte.producciones}
              </strong>
            </div>

            <div className="resumen-card">
              <span>🥛</span>

              <p>
                Litros producidos
              </p>

              <strong>
                {reporte.litros_producidos}
              </strong>
            </div>

            <div className="resumen-card">
              <span>🍦</span>

              <p>
                Helados producidos
              </p>

              <strong>
                {reporte.helados_producidos}
              </strong>
            </div>

            <div className="resumen-card">
              <span>🛒</span>

              <p>
                Ventas realizadas
              </p>

              <strong>
                {reporte.ventas}
              </strong>
            </div>

            <div className="resumen-card">
              <span>🍨</span>

              <p>
                Helados vendidos
              </p>

              <strong>
                {reporte.helados_vendidos}
              </strong>
            </div>

            <div className="resumen-card">
              <span>💰</span>

              <p>
                Dinero generado
              </p>

              <strong>
                $
                {Number(
                  reporte.ingresos
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="resumen-card">
              <span>💸</span>

              <p>
                Gastos
              </p>

              <strong>
                $
                {Number(
                  reporte.gastos
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="resumen-card utilidad-card">
              <span>📈</span>

              <p>
                Ganancia del mes
              </p>

              <strong>
                $
                {Number(
                  reporte.utilidad
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="resumen-card">
              <span>👤</span>

              <p>
                Deudas registradas
              </p>

              <strong>
                $
                {Number(
                  reporte.deuda_total
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="resumen-card">
              <span>💳</span>

              <p>
                Deudas abonadas
              </p>

              <strong>
                $
                {Number(
                  reporte.deuda_abonada
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="resumen-card">
              <span>⚠️</span>

              <p>
                Deuda pendiente
              </p>

              <strong>
                $
                {Number(
                  reporte.deuda_pendiente
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="resumen-card">
              <span>📦</span>

              <p>
                Inventario actual
              </p>

              <strong>
                {reporte.inventario_actual}
              </strong>
            </div>

          </div>

          {/* RECIBO */}

          <div className="recibo-mensual">

            <div className="recibo-linea"></div>

            <h3>
              🧾 RECIBO MENSUAL
            </h3>

            <p>
              <strong>
                Mundo Cremoso de Pao G
              </strong>
            </p>

            <p>
              Periodo:{" "}
              {meses[Number(mes) - 1]}{" "}
              {anio}
            </p>

            <div className="recibo-linea"></div>

            <div className="recibo-fila">
              <span>
                Producciones
              </span>

              <strong>
                {reporte.producciones}
              </strong>
            </div>

            <div className="recibo-fila">
              <span>
                Helados producidos
              </span>

              <strong>
                {reporte.helados_producidos}
              </strong>
            </div>

            <div className="recibo-fila">
              <span>
                Helados vendidos
              </span>

              <strong>
                {reporte.helados_vendidos}
              </strong>
            </div>

            <div className="recibo-fila">
              <span>
                Ingresos
              </span>

              <strong>
                $
                {Number(
                  reporte.ingresos
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="recibo-fila">
              <span>
                Gastos
              </span>

              <strong>
                $
                {Number(
                  reporte.gastos
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="recibo-linea"></div>

            <div className="recibo-total">
              <span>
                GANANCIA DEL MES
              </span>

              <strong>
                $
                {Number(
                  reporte.utilidad
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="recibo-linea"></div>

            <p className="recibo-final">
              Gracias por confiar en
              <br />
              Mundo Cremoso de Pao G 🍦
            </p>

          </div>

          <div className="acciones-reporte no-print">

            <button
              className="btn-principal"
              onClick={imprimirRecibo}
            >
              🖨️ Sacar recibo / Guardar PDF
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Resumen;