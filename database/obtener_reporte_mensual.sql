UPDATE public.sabores
SET precio_mayorista = CASE
  WHEN lower(nombre) = lower('Arándanos') THEN 3500
  ELSE 3000
END
WHERE activo = true;

CREATE OR REPLACE FUNCTION public.obtener_reporte_mensual(
  p_anio integer,
  p_mes integer
)
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  WITH periodo AS (
    SELECT
      make_date(p_anio, p_mes, 1)::timestamp
        AT TIME ZONE 'America/Bogota' AS inicio,
      (make_date(p_anio, p_mes, 1) + interval '1 month')::timestamp
        AT TIME ZONE 'America/Bogota' AS fin
  )
  SELECT json_build_object(
    'producciones', (
      SELECT count(*)
      FROM public.producciones, periodo
      WHERE fecha >= periodo.inicio AND fecha < periodo.fin
    ),
    'litros_producidos', (
      SELECT coalesce(sum(litros), 0)
      FROM public.producciones, periodo
      WHERE fecha >= periodo.inicio AND fecha < periodo.fin
    ),
    'helados_producidos', (
      SELECT coalesce(sum(detalle.cantidad), 0)
      FROM public.produccion_detalle AS detalle
      JOIN public.producciones AS produccion
        ON produccion.id = detalle.produccion_id
      CROSS JOIN periodo
      WHERE produccion.fecha >= periodo.inicio
        AND produccion.fecha < periodo.fin
    ),
    'ventas', (
      SELECT count(*)
      FROM public.ventas, periodo
      WHERE fecha >= periodo.inicio AND fecha < periodo.fin
    ),
    'helados_vendidos', (
      SELECT coalesce(sum(total_helados), 0)
      FROM public.ventas, periodo
      WHERE fecha >= periodo.inicio AND fecha < periodo.fin
    ),
    'ingresos', (
      SELECT coalesce(sum(total), 0)
      FROM public.ventas, periodo
      WHERE fecha >= periodo.inicio AND fecha < periodo.fin
    ),
    'gastos', (
      SELECT coalesce(sum(valor), 0)
      FROM public.gastos, periodo
      WHERE fecha >= periodo.inicio AND fecha < periodo.fin
    ),
    'utilidad', (
      SELECT coalesce(sum(total), 0)
      FROM public.ventas, periodo
      WHERE fecha >= periodo.inicio AND fecha < periodo.fin
    ) - (
      SELECT coalesce(sum(valor), 0)
      FROM public.gastos, periodo
      WHERE fecha >= periodo.inicio AND fecha < periodo.fin
    ),
    'inventario_actual', (
      SELECT coalesce(sum(cantidad), 0)
      FROM public.inventario
    ),
    'deuda_total', (
      SELECT coalesce(sum(valor), 0)
      FROM public.deudas
    ),
    'deuda_abonada', (
      SELECT coalesce(sum(abonado), 0)
      FROM public.deudas
    ),
    'deuda_pendiente', (
      SELECT coalesce(sum(valor - abonado), 0)
      FROM public.deudas
    )
  );
$$;

REVOKE ALL ON FUNCTION public.obtener_reporte_mensual(integer, integer)
  FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.obtener_reporte_mensual(integer, integer)
  TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
