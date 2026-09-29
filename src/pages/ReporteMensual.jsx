import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

function ReporteMensual({ cambiarPantalla }) {
  const ahora = new Date();

  const [anio, setAnio] = useState(
    ahora.getFullYear()
  );

  const [mes, setMes] = useState(
    ahora.getMonth() + 1
  );

  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);

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
          "No se pudo cargar el reporte."
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

  function imprimir() {
    window.print();
  }

  return (
    <div className="pantalla">

      <button
        className="btn-volver no-print"
        onClick={() =>
          cambiarPantalla("admin")
        }
      >
        ← Volver a administración
      </button>

      <div className="titulo-pantalla">
        <span>📊</span>

        <div>
          <h2>Reporte mensual</h2>
          <p>
            Resumen completo de Mundo Cremoso.
          </p>
        </div>
      </div>

      <div className="formulario no-print">

        <label>Año</label>

        <input
          type="number"
          value={anio}
          onChange={(e) =>
            setAnio(e.target.value)
          }
        />

        <label>Mes</label>

        <select
          value={mes}
          onChange={(e) =>
            setMes(e.target.value)
          }
        >
          {meses.map((nombre, index) => (
            <option
              key={nombre}
              value={index + 1}
            >
              {nombre}
            </option>
          ))}
        </select>

        <button
          className="btn-principal"
          onClick={cargarReporte}
        >
          Generar reporte
        </button>

        <button
          className="btn-secundario"
          onClick={imprimir}
        >
          🖨️ Imprimir / Guardar PDF
        </button>

      </div>

      {reporte && (
        <div className="reporte">

          <div className="reporte-encabezado">
            <h2>
              🍦 Mundo Cremoso de Pao G
            </h2>

            <h3>
              {meses[Number(mes) - 1]} {anio}
            </h3>
          </div>

          <div className="resumen-grid">

            <div className="resumen-card">
              <span>🧊</span>
              <p>Producciones</p>
              <strong>
                {reporte.producciones}
              </strong>
            </div>

            <div className="resumen-card">
              <span>🥛</span>
              <p>Litros producidos</p>
              <strong>
                {reporte.litros_producidos}
              </strong>
            </div>

            <div className="resumen-card">
              <span>🍦</span>
              <p>Helados producidos</p>
              <strong>
                {reporte.helados_producidos}
              </strong>
            </div>

            <div className="resumen-card">
              <span>🛒</span>
              <p>Ventas</p>
              <strong>
                {reporte.ventas}
              </strong>
            </div>

            <div className="resumen-card">
              <span>🍨</span>
              <p>Helados vendidos</p>
              <strong>
                {reporte.helados_vendidos}
              </strong>
            </div>

            <div className="resumen-card">
              <span>💰</span>
              <p>Ingresos</p>
              <strong>
                $
                {Number(
                  reporte.ingresos
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="resumen-card">
              <span>💸</span>
              <p>Gastos</p>
              <strong>
                $
                {Number(
                  reporte.gastos
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="resumen-card">
              <span>📈</span>
              <p>Utilidad</p>
              <strong>
                $
                {Number(
                  reporte.utilidad
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="resumen-card">
              <span>📦</span>
              <p>Inventario actual</p>
              <strong>
                {reporte.inventario_actual}
              </strong>
            </div>

            <div className="resumen-card">
              <span>👤</span>
              <p>Deuda registrada</p>
              <strong>
                $
                {Number(
                  reporte.deuda_total
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="resumen-card">
              <span>💳</span>
              <p>Deuda abonada</p>
              <strong>
                $
                {Number(
                  reporte.deuda_abonada
                ).toLocaleString("es-CO")}
              </strong>
            </div>

            <div className="resumen-card">
              <span>⚠️</span>
              <p>Deuda pendiente</p>
              <strong>
                $
                {Number(
                  reporte.deuda_pendiente
                ).toLocaleString("es-CO")}
              </strong>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ReporteMensual;