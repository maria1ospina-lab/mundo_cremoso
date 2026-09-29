import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

function Resumen({ cambiarPantalla }) {
  const [resumen, setResumen] = useState({
    helados_vendidos: 0,
    dinero_generado: 0,
    helados_disponibles: 0,
    producciones: 0,
    litros_producidos: 0
  });

  const [cargando, setCargando] =
    useState(true);

  useEffect(() => {
    async function cargarResumen() {
      const { data, error } =
        await supabase.rpc(
          "obtener_resumen_hoy"
        );

      if (error) {
        console.error(error);
        setCargando(false);
        return;
      }

      setResumen(data);
      setCargando(false);
    }

    cargarResumen();
  }, []);

  if (cargando) {
    return (
      <div className="pantalla">

        <div className="titulo-pantalla">

          <span>💰</span>

          <div>
            <h2>
              Cargando resumen...
            </h2>
          </div>

        </div>

      </div>
    );
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

        <span>💰</span>

        <div>

          <h2>Resumen de hoy</h2>

          <p>
            Información actual del negocio.
          </p>

        </div>

      </div>

      <div className="resumen-grid">

        <div className="resumen-card">

          <span>🍦</span>

          <p>
            Helados vendidos
          </p>

          <strong>
            {resumen.helados_vendidos}
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
              resumen.dinero_generado
            ).toLocaleString("es-CO")}
          </strong>

        </div>

        <div className="resumen-card">

          <span>📦</span>

          <p>
            Helados disponibles
          </p>

          <strong>
            {resumen.helados_disponibles}
          </strong>

        </div>

        <div className="resumen-card">

          <span>🧊</span>

          <p>
            Producciones de hoy
          </p>

          <strong>
            {resumen.producciones}
          </strong>

        </div>

        <div className="resumen-card">

          <span>🥛</span>

          <p>
            Litros producidos
          </p>

          <strong>
            {resumen.litros_producidos}
          </strong>

        </div>

      </div>

    </div>
  );
}

export default Resumen;