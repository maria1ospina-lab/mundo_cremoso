import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

function Admin({ cambiarPantalla }) {
  const [sabores, setSabores] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [deudas, setDeudas] = useState([]);

  const [concepto, setConcepto] = useState("");
  const [valorGasto, setValorGasto] = useState("");

  const [nombreDeuda, setNombreDeuda] = useState("");
  const [telefonoDeuda, setTelefonoDeuda] =
    useState("");
  const [valorDeuda, setValorDeuda] = useState("");

  const [cargando, setCargando] = useState(true);

  async function cargarDatos() {
    setCargando(true);

    const { data: saboresData } =
      await supabase
        .from("sabores")
        .select("id, nombre, precio")
        .eq("activo", true)
        .order("id");

    const { data: gastosData } =
      await supabase
        .from("gastos")
        .select("*")
        .order("fecha", {
          ascending: false
        })
        .limit(20);

    const { data: deudasData } =
      await supabase
        .from("deudas")
        .select("*")
        .order("fecha", {
          ascending: false
        });

    setSabores(saboresData || []);
    setGastos(gastosData || []);
    setDeudas(deudasData || []);

    setCargando(false);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cambiarPrecio(id, precioActual) {
    const nuevoPrecio = prompt(
      "Escribe el nuevo precio:",
      precioActual
    );

    if (nuevoPrecio === null) {
      return;
    }

    const precio = Number(nuevoPrecio);

    if (precio < 0 || Number.isNaN(precio)) {
      alert("Ingresa un precio válido.");
      return;
    }

    const { error } =
      await supabase.rpc(
        "actualizar_precio",
        {
          p_sabor_id: id,
          p_precio: precio
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    await cargarDatos();

    alert("Precio actualizado correctamente.");
  }

  async function guardarGasto() {
    if (
      !concepto.trim() ||
      !valorGasto ||
      Number(valorGasto) <= 0
    ) {
      alert("Completa correctamente los datos.");
      return;
    }

    const { error } =
      await supabase.rpc(
        "registrar_gasto",
        {
          p_concepto: concepto,
          p_valor: Number(valorGasto)
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    setConcepto("");
    setValorGasto("");

    await cargarDatos();

    alert("Gasto registrado correctamente.");
  }

  async function guardarDeuda() {
    if (
      !nombreDeuda.trim() ||
      !valorDeuda ||
      Number(valorDeuda) <= 0
    ) {
      alert("Completa correctamente los datos.");
      return;
    }

    const { error } =
      await supabase.rpc(
        "registrar_deuda",
        {
          p_nombre: nombreDeuda,
          p_telefono: telefonoDeuda,
          p_valor: Number(valorDeuda)
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    setNombreDeuda("");
    setTelefonoDeuda("");
    setValorDeuda("");

    await cargarDatos();

    alert("Deuda registrada correctamente.");
  }

  async function registrarAbono(deuda) {
    const pendiente =
      deuda.valor - deuda.abonado;

    const respuesta = prompt(
      `Pendiente: $${pendiente.toLocaleString(
        "es-CO"
      )}\n\n¿Cuánto abonó?`
    );

    if (respuesta === null) {
      return;
    }

    const abono = Number(respuesta);

    if (
      !abono ||
      abono <= 0 ||
      abono > pendiente
    ) {
      alert(
        "El valor del abono no es válido."
      );
      return;
    }

    const { error } =
      await supabase.rpc(
        "registrar_abono_deuda",
        {
          p_deuda_id: deuda.id,
          p_abono: abono
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    await cargarDatos();

    alert("Abono registrado correctamente.");
  }

  if (cargando) {
    return (
      <div className="pantalla">
        <div className="titulo-pantalla">
          <span>⚙️</span>
          <div>
            <h2>Cargando...</h2>
            <p>
              Cargando administración.
            </p>
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
        <span>⚙️</span>

        <div>
          <h2>Administración</h2>
          <p>
            Control general del negocio.
          </p>
        </div>
      </div>

      <button
        className="btn-principal"
        onClick={() =>
          cambiarPantalla("reporte")
        }
      >
        📊 Ver reporte mensual
      </button>

      <div className="formulario">

        <h3>💵 Precios</h3>

        {sabores.map((sabor) => (
          <div
            className="sabor-produccion"
            key={sabor.id}
          >
            <span>
              {sabor.nombre}
            </span>

            <button
              className="btn-secundario"
              onClick={() =>
                cambiarPrecio(
                  sabor.id,
                  sabor.precio
                )
              }
            >
              $
              {Number(
                sabor.precio
              ).toLocaleString("es-CO")}
            </button>
          </div>
        ))}

      </div>

      <div className="formulario">

        <h3>💸 Registrar gasto</h3>

        <label>Concepto</label>

        <input
          type="text"
          placeholder="Ejemplo: Leche"
          value={concepto}
          onChange={(e) =>
            setConcepto(e.target.value)
          }
        />

        <label>Valor</label>

        <input
          type="number"
          min="0"
          placeholder="$0"
          value={valorGasto}
          onChange={(e) =>
            setValorGasto(e.target.value)
          }
        />

        <button
          className="btn-principal"
          onClick={guardarGasto}
        >
          Guardar gasto
        </button>

      </div>

      <div className="formulario">

        <h3>📋 Últimos gastos</h3>

        {gastos.length === 0 ? (
          <p>
            No hay gastos registrados.
          </p>
        ) : (
          gastos.map((gasto) => (
            <div
              className="helado"
              key={gasto.id}
            >
              <span>
                {gasto.concepto}
              </span>

              <strong>
                $
                {Number(
                  gasto.valor
                ).toLocaleString("es-CO")}
              </strong>
            </div>
          ))
        )}

      </div>

      <div className="formulario">

        <h3>
          👤 Registrar persona que debe
        </h3>

        <label>Nombre</label>

        <input
          type="text"
          placeholder="Nombre"
          value={nombreDeuda}
          onChange={(e) =>
            setNombreDeuda(e.target.value)
          }
        />

        <label>Teléfono</label>

        <input
          type="text"
          placeholder="Opcional"
          value={telefonoDeuda}
          onChange={(e) =>
            setTelefonoDeuda(e.target.value)
          }
        />

        <label>
          Valor de la deuda
        </label>

        <input
          type="number"
          min="0"
          placeholder="$0"
          value={valorDeuda}
          onChange={(e) =>
            setValorDeuda(e.target.value)
          }
        />

        <button
          className="btn-principal"
          onClick={guardarDeuda}
        >
          Registrar deuda
        </button>

      </div>

      <div className="formulario">

        <h3>
          📋 Personas que deben
        </h3>

        {deudas.length === 0 ? (
          <p>
            No hay deudas registradas.
          </p>
        ) : (
          deudas.map((deuda) => {
            const pendiente =
              deuda.valor -
              deuda.abonado;

            return (
              <div
                className="deuda-card"
                key={deuda.id}
              >
                <strong>
                  {deuda.nombre_persona}
                </strong>

                {deuda.telefono && (
                  <small>
                    📱 {deuda.telefono}
                  </small>
                )}

                <span>
                  Deuda: $
                  {Number(
                    deuda.valor
                  ).toLocaleString("es-CO")}
                </span>

                <span>
                  Abonado: $
                  {Number(
                    deuda.abonado
                  ).toLocaleString("es-CO")}
                </span>

                <strong>
                  Pendiente: $
                  {Number(
                    pendiente
                  ).toLocaleString("es-CO")}
                </strong>

                {pendiente > 0 ? (
                  <button
                    className="btn-secundario"
                    onClick={() =>
                      registrarAbono(deuda)
                    }
                  >
                    Registrar abono
                  </button>
                ) : (
                  <span>
                    ✅ Pagada
                  </span>
                )}
              </div>
            );
          })
        )}

      </div>

    </div>
  );
}

export default Admin;