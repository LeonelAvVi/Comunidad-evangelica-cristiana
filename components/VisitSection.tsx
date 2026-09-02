import { Reveal } from "./Reveal";

export function VisitSection() {
  return (
    <section id="visita">
      <div className="wrap">
        <Reveal>
          <div className="visit">
            <div className="visit-grid">
              <div className="visit-copy">
                <span className="eyebrow" style={{ color: "#9FB3AA" }}>
                  Visitanos
                </span>
                <h2 style={{ marginTop: 14 }}>Te esperamos esta semana</h2>
                <p>
                  La puerta está abierta para vos y tu familia, sea cual sea el sector al que quieras
                  sumarte primero.
                </p>
                <ul className="visit-list">
                  <li>
                    <span>Domingos</span>
                    <span>10:00 · Culto general</span>
                  </li>
                  <li>
                    <span>Miércoles</span>
                    <span>19:00 · Oración</span>
                  </li>
                  <li>
                    <span>Sábados</span>
                    <span>19:00 · Comunidad Juvenil</span>
                  </li>
                </ul>
              </div>
              <a
                className="visit-map"
                href="https://www.google.com/maps/search/Comunidad+Cristiana+Sucre"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir mapa de Sucre"
              >
                <div className="pin" />
                <div className="map-label">Sucre · Bolivia</div>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
