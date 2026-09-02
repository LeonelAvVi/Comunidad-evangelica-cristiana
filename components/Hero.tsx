import { RainbowMark } from "./BrandMark";
import { TicketStack } from "./TicketStack";

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <RainbowMark />
          <span className="eyebrow" style={{ marginTop: 14, display: "inline-flex" }}>
            Sucre · abierta toda la semana
          </span>
          <h1 style={{ marginTop: 16 }}>
            Una iglesia,
            <br />
            <em>cuatro caminos</em> para encontrarla.
          </h1>
          <p className="lead">
            Niños, adolescentes, jóvenes y matrimonios: cada sector con su propio ritmo y espacio — y
            un solo lugar para enterarte de todo lo que se viene.
          </p>
          <div className="hero-ctas">
            <a href="#eventos" className="btn btn-primary">
              Ver próximos eventos
            </a>
            <a href="#sectores" className="btn btn-ghost">
              Conocer los sectores
            </a>
          </div>
        </div>
        <TicketStack />
      </div>
    </section>
  );
}
