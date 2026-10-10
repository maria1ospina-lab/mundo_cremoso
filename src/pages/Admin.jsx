import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

function Admin({ cambiarPantalla }) {
  const [sabores, setSabores] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [deudas, setDeudas] = useState([]);

  const [concepto, setConcepto] = useState("");
  const [valorGasto, setValorGasto] = useState("");

  const [nombreDeuda, setNombreDeuda] = useState("");
  const [telefonoDeuda, setTelefonoDeuda] = useState("");
  const [valorDeuda, setValorDeuda] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardandoPrecio, setGuardandoPrecio] = useState(null);

  async function cargarDatos() {
    setCargando(true);

    const { data: saboresData, error: saboresError } =
      await supabase
        .from("sabores")
        .select("id, nombre, precio, precio_mayorista")
        .eq("activo", true)
        .order("id");

    if (saboresError) {
      console.error(saboresError);
      alert("No se pudieron cargar los sabores.");
      setCargando(false);
      return;
    }

    const { data: gastosData, error: gastosError } =
      await supabase
        .from("gastos")
        .select("*")
        .order("fecha", { ascending: false })
        .limit(20);

    const { data: deudasData, error: deudasError } =
      await supabase
        .from("deudas")
        .select("*")
        .order("fecha", { ascending: false });

    if (gastosError) console.error(gastosError);
    if (deudasError) console.error(deudasError);

    setSabores(saboresData || []);
    setGastos(gastosData || []);
    setDeudas(deudasData || []);
    setCargando(false);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cambiarPrecio(sabor, campo) {
    const esMayorista = campo === "precio_mayorista";

    const precioActual = esMayorista
      ? sabor.precio_mayorista ?? sabor.precio
      : sabor.precio;

    const respuesta = prompt(
      `Nuevo precio ${esMayorista ? "mayorista" : "normal"} para ${sabor.nombre}:`,
      precioActual
    );

    if (respuesta === null) return;

    const precio = Number(respuesta);

    if (!Number.isSafeInteger(precio) || precio < 0) {
      alert("Ingresa un precio entero válido, igual o mayor que cero.");
      return;
    }

    setGuardandoPrecio(`${sabor.id}-${campo}`);

    const { error } = await supabase
      .from("sabores")
      .update({ [campo]: precio })
      .eq("id", sabor.id);

    setGuardandoPrecio(null);

    if (error) {
      console.error(error);
      alert("No se pudo actualizar el precio: " + error.message);
      return;
    }

    await cargarDatos();
    alert("Precio actualizado correctamente.");
  }

  async function guardarGasto() {
    if (!concepto.trim() || !valorGasto || Number(valorGasto) <= 0) {
      alert("Completa correctamente los datos del gasto.");
      return;
    }

    const { error } = await supabase.rpc("registrar_gasto", {
      p_concepto: concepto.trim(),
      p_valor: Number(valorGasto)
    });

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
    if (!nombreDeuda.trim() || !valorDeuda || Number(valorDeuda) <= 0) {
      alert("Completa correctamente los datos de la deuda.");
      return;
    }

    const { error } = await supabase.rpc("registrar_deuda", {
      p_nombre: nombreDeuda.trim(),
      p_telefono: telefonoDeuda.trim(),
      p_valor: Number(valorDeuda)
    });

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
    const pendiente = Number(deuda.valor) - Number(deuda.abonado);

    const respuesta = prompt(
      `Pendiente: $${pendiente.toLocaleString("es-CO")}\n¿Cuánto abonó?`
    );

    if (respuesta === null) return;

    const abono = Number(respuesta);

    if (!Number.isSafeInteger(abono) || abono <= 0 || abono > pendiente) {
      alert("El abono no es válido.");
      return;
    }

    const { error } = await supabase.rpc("registrar_abono_deuda", {
      p_deuda_id: deuda.id,
      p_abono: abono
    });

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
            <h2>Cargando administración...</h2>
          </div>
        </div>
      </div>
    );
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
        <span>⚙️</span>
        <div>
          <h2>Administración</h2>
          <p>Precios, gastos, deudas y reportes del negocio.</p>
        </div>
      </div>

      <button
        className="btn-principal"
        onClick={() => cambiarPantalla("reporte")}
      >
        📊 Ver reporte mensual
      </button>

      <div className="formulario">
        <h3>💵 Precios de los helados</h3>
        <p>Modifica los precios normales y mayoristas cuando lo necesites.</p>

        {sabores.map((sabor) => (
          <div className="sabor-produccion" key={sabor.id}>
            <div style={{ flex: 1 }}>
              <strong>{sabor.nombre}</strong>

              <p>
                Normal: $
                {Number(sabor.precio).toLocaleString("es-CO")}
              </p>

              <p>
                Mayorista: $
                {Number(
                  sabor.precio_mayorista ?? sabor.precio
                ).toLocaleString("es-CO")}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                className="btn-secundario"
                disabled={guardandoPrecio !== null}
                onClick={() => cambiarPrecio(sabor, "precio")}
              >
                {guardandoPrecio === `${sabor.id}-precio`
                  ? "Guardando..."
                  : "Editar normal"}
              </button>

              <button
                className="btn-secundario"
                disabled={guardandoPrecio !== null}
                onClick={() => cambiarPrecio(sabor, "precio_mayorista")}
              >
                {guardandoPrecio === `${sabor.id}-precio_mayorista`
                  ? "Guardando..."
                  : "Editar mayorista"}
              </button>
            </div>
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
          onChange={(e) => setConcepto(e.target.value)}
        />

        <label>Valor</label>
        <input
          type="number"
          min="1"
          placeholder="$0"
          value={valorGasto}
          onChange={(e) => setValorGasto(e.target.value)}
        />

        <button className="btn-principal" onClick={guardarGasto}>
          Guardar gasto
        </button>
      </div>

      <div className="formulario">
        <h3>📋 Últimos gastos</h3>

        {gastos.length === 0 ? (
          <p>No hay gastos registrados.</p>
        ) : (
          gastos.map((gasto) => (
            <div className="helado" key={gasto.id}>
              <span>{gasto.concepto}</span>
              <strong>
                ${Number(gasto.valor).toLocaleString("es-CO")}
              </strong>
            </div>
          ))
        )}
      </div>

      <div className="formulario">
        <h3>👤 Registrar persona que debe</h3>

        <label>Nombre</label>
        <input
          type="text"
          placeholder="Nombre"
          value={nombreDeuda}
          onChange={(e) => setNombreDeuda(e.target.value)}
        />

        <label>Teléfono</label>
        <input
          type="text"
          placeholder="Opcional"
          value={telefonoDeuda}
          onChange={(e) => setTelefonoDeuda(e.target.value)}
        />

        <label>Valor de la deuda</label>
        <input
          type="number"
          min="1"
          placeholder="$0"
          value={valorDeuda}
          onChange={(e) => setValorDeuda(e.target.value)}
        />

        <button className="btn-principal" onClick={guardarDeuda}>
          Registrar deuda
        </button>
      </div>

      <div className="formulario">
        <h3>📋 Personas que deben</h3>

        {deudas.length === 0 ? (
          <p>No hay deudas registradas.</p>
        ) : (
          deudas.map((deuda) => {
            const pendiente = Number(deuda.valor) - Number(deuda.abonado);

            return (
              <div className="deuda-card" key={deuda.id}>
                <strong>{deuda.nombre_persona}</strong>

                {deuda.telefono && (
                  <small>📱 {deuda.telefono}</small>
                )}

                <span>
                  Deuda: ${Number(deuda.valor).toLocaleString("es-CO")}
                </span>

                <span>
                  Abonado: ${Number(deuda.abonado).toLocaleString("es-CO")}
                </span>

                <strong>
                  Pendiente: ${pendiente.toLocaleString("es-CO")}
                </strong>

                {pendiente > 0 ? (
                  <button
                    className="btn-secundario"
                    onClick={() => registrarAbono(deuda)}
                  >
                    Registrar abono
                  </button>
                ) : (
                  <span>✅ Pagada</span>
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