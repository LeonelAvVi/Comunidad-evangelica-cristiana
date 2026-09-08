import { Reveal } from "./Reveal";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8495.346926850938!2d-65.26612288867058!3d-19.04857361139448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93fbcf115961069d%3A0x69204b96c937c53b!2sComunidad%20Cristiana%20Evang%C3%A9lica!5e0!3m2!1ses-419!2sbo!4v1788901368685!5m2!1ses-419!2sbo";

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
              <div className="visit-map">
                <iframe
                  src={MAP_EMBED_SRC}
                  title="Ubicación de Comunidad Cristiana Evangélica"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
