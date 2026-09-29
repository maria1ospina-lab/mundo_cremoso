function MenuCard({ icono, titulo, descripcion, onClick }) {
  return (
    <button className="menu-card" onClick={onClick}>
      <span className="icono">{icono}</span>

      <span className="titulo-card">
        {titulo}
      </span>

      <span className="descripcion">
        {descripcion}
      </span>
    </button>
  );
}

export default MenuCard;