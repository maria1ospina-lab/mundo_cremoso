import { useEffect, useState } from "react";

import "./App.css";

import Inicio from "./pages/Inicio";
import Venta from "./pages/Venta";
import Produccion from "./pages/Produccion";
import Inventario from "./pages/Inventario";
import Resumen from "./pages/Resumen";
import Admin from "./pages/Admin";
import ReporteMensual from "./pages/ReporteMensual";

import { supabase } from "./supabase/supabaseClient";

function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [inventario, setInventario] = useState({});
  const [sabores, setSabores] = useState([]);
  const [cargando, setCargando] = useState(true);

  async function cargarDatos() {
    setCargando(true);

    const { data: saboresData, error: saboresError } =
      await supabase
        .from("sabores")
        .select("id, nombre, precio")
        .eq("activo", true)
        .order("id");

    if (saboresError) {
      console.error(saboresError);
      alert("No se pudieron cargar los sabores.");
      setCargando(false);
      return;
    }

    const { data: inventarioData, error: inventarioError } =
      await supabase
        .from("inventario")
        .select("sabor_id, cantidad");

    if (inventarioError) {
      console.error(inventarioError);
      alert("No se pudo cargar el inventario.");
      setCargando(false);
      return;
    }

    const nuevoInventario = {};

    saboresData.forEach((sabor) => {
      const registro = inventarioData.find(
        (item) => item.sabor_id === sabor.id
      );

      nuevoInventario[sabor.nombre] =
        registro?.cantidad ?? 0;
    });

    setSabores(saboresData);
    setInventario(nuevoInventario);
    setCargando(false);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function cambiarPantalla(nombrePantalla) {
    setPantalla(nombrePantalla);
  }

  async function agregarProduccion(produccion, litros) {
    const items = Object.entries(produccion)
      .filter(([, cantidad]) => Number(cantidad) > 0)
      .map(([nombre, cantidad]) => {
        const sabor = sabores.find(
          (item) => item.nombre === nombre
        );

        return {
          sabor_id: sabor.id,
          cantidad: Number(cantidad)
        };
      });

    const { error } = await supabase.rpc(
      "registrar_produccion",
      {
        p_litros: Number(litros) || 0,
        p_items: items
      }
    );

    if (error) {
      console.error(error);
      alert(
        error.message ||
          "No se pudo registrar la producción."
      );
      return false;
    }

    await cargarDatos();

    setPantalla("inventario");

    return true;
  }

  async function registrarVenta(venta) {
    const items = Object.entries(venta)
      .filter(([, cantidad]) => Number(cantidad) > 0)
      .map(([nombre, cantidad]) => {
        const sabor = sabores.find(
          (item) => item.nombre === nombre
        );

        return {
          sabor_id: sabor.id,
          cantidad: Number(cantidad)
        };
      });

    const { error } = await supabase.rpc(
      "registrar_venta",
      {
        p_items: items
      }
    );

    if (error) {
      console.error(error);

      alert(
        error.message ||
          "No se pudo registrar la venta."
      );

      return false;
    }

    await cargarDatos();

    return true;
  }

  if (cargando) {
    return (
      <div className="pantalla">
        <div className="titulo-pantalla">
          <span>🍦</span>

          <div>
            <h2>Cargando...</h2>
            <p>
              Conectando con Mundo Cremoso.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (pantalla === "venta") {
    return (
      <Venta
        cambiarPantalla={cambiarPantalla}
        inventario={inventario}
        registrarVenta={registrarVenta}
        sabores={sabores}
      />
    );
  }

  if (pantalla === "produccion") {
    return (
      <Produccion
        cambiarPantalla={cambiarPantalla}
        agregarProduccion={agregarProduccion}
      />
    );
  }

  if (pantalla === "inventario") {
    return (
      <Inventario
        cambiarPantalla={cambiarPantalla}
        inventario={inventario}
      />
    );
  }

  if (pantalla === "resumen") {
    return (
      <Resumen
        cambiarPantalla={cambiarPantalla}
      />
    );
  }

  if (pantalla === "admin") {
    return (
      <Admin
        cambiarPantalla={cambiarPantalla}
      />
    );
  }

  if (pantalla === "reporte") {
    return (
      <ReporteMensual
        cambiarPantalla={cambiarPantalla}
      />
    );
  }

  return (
    <Inicio
      cambiarPantalla={cambiarPantalla}
    />
  );
}

export default App;