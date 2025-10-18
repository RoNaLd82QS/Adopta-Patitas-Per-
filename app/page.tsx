import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ImageFallback from "@/components/ImageFallback";

export default function Page() {
  const adoptaThumbs = ["/a1.jpg", "/a2.jpg", "/a3.jpg", "/a4.jpg"];
  const aliadoLogos = ["/ally1.png", "/ally2.png", "/ally3.png", "/ally4.png"];
  const team = [
    { n: "Micaela", r: "Fundadora", f: "/team1.jpg" },
    { n: "Yoel", r: "Fundador", f: "/team2.jpg" },
    { n: "Claudia", r: "Fundadora", f: "/team3.jpg" },
  ];

  return (
    <div className="space-y-16">
      {/* HERO */}
      <HeroSlider />

      {/* QUIÉNES SOMOS */}
      <section className="rounded-3xl bg-[#163A6F] text-white px-6 py-12 border">
        <h2 className="title-script text-center text-4xl mb-8">
          Quiénes somos y por qué existimos
        </h2>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="rounded-2xl overflow-hidden border bg-white/10">
              <ImageFallback
                src="/quienes-somos.jpg"
                alt="Nuestro equipo"
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-lg/7">
              Somos una asociación sin fines de lucro que busca construir un
              mundo mejor para los animales a través de iniciativas sostenibles.
            </p>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-white/10 p-4">
                <div className="text-3xl">🏠</div>
                <p className="text-sm mt-1">Adopción responsable</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <div className="text-3xl">🍲</div>
                <p className="text-sm mt-1">Donaciones: agua y comida</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <div className="text-3xl">🩺</div>
                <p className="text-sm mt-1">Salud y esterilización</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <div className="text-3xl">📚</div>
                <p className="text-sm mt-1">Educación y cuidados</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/donar"
                className="rounded-full bg-yellow-400 px-6 py-2 font-semibold text-slate-900 hover:bg-yellow-500"
              >
                DONAR
              </Link>
              <Link
                href="/voluntariado"
                className="rounded-full border px-6 py-2 font-semibold hover:bg-white/10"
              >
                SER VOLUNTARIO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ADOPTA */}
      <section className="rounded-3xl bg-[#163A6F] text-white px-6 py-12 border">
        <h2 className="title-script text-center text-4xl">Adopta</h2>
        <p className="text-center text-white/90 mt-2">
          ¡Cientos esperan por un hogar!
        </p>

        <div className="mt-8 flex items-center justify-center gap-6">
          {adoptaThumbs.map((src, i) => (
            <ImageFallback
              key={i}
              src={src}
              alt=""
              className="h-28 w-28 rounded-full object-cover ring-4 ring-white/20"
              fallback="https://placehold.co/160x160"
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/adopta"
            className="rounded-full bg-yellow-400 px-6 py-2 font-semibold text-slate-900 hover:bg-yellow-500"
          >
            QUIERO ADOPTAR
          </Link>
          <Link
            href="/apadrina"
            className="rounded-full border px-6 py-2 font-semibold hover:bg-white/10"
          >
            QUIERO APADRINAR
          </Link>
        </div>
      </section>

      {/* APADRINA */}
      <section className="rounded-3xl bg-[#163A6F] text-white px-6 py-12 border">
        <h2 className="title-script text-center text-4xl">Apadrina</h2>
        <p className="text-center text-white/90 mt-2">
          ¡Ayúdanos a llevar alimento a los albergues y recibe beneficios de
          aliados!
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-8 items-center">
          <ImageFallback
            src="/apadrina.jpg"
            alt=""
            className="rounded-2xl w-full aspect-[4/3] object-cover border"
          />
          <div className="grid grid-cols-4 gap-4 *:rounded-full *:border *:bg-white">
            {aliadoLogos.map((src, i) => (
              <ImageFallback
                key={i}
                src={src}
                alt=""
                className="aspect-square object-contain p-3 rounded-full border bg-white"
                fallback="https://placehold.co/120x120"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/apadrina"
            className="rounded-full bg-yellow-400 px-6 py-2 font-semibold text-slate-900 hover:bg-yellow-500"
          >
            SER PARTE DEL CLUB
          </Link>
        </div>
      </section>

      {/* AYUDA ENTREGADA */}
      <section className="rounded-3xl bg-[#163A6F] text-white px-6 py-12 border">
        <h2 className="title-script text-center text-4xl">Ayuda entregada</h2>
        <p className="text-center text-white/90 mt-2">
          Gracias a nuestros aliados hemos logrado:
        </p>

        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="rounded-2xl bg-white/10 p-6">
            <div className="text-4xl">✂️</div>
            <p className="mt-2 text-lg font-bold">14,000+</p>
            <p className="text-sm">esterilizaciones</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-6">
            <div className="text-4xl">🍚</div>
            <p className="mt-2 text-lg font-bold">71 TN</p>
            <p className="text-sm">alimento entregado</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-6">
            <div className="text-4xl">🏡</div>
            <p className="mt-2 text-lg font-bold">300+</p>
            <p className="text-sm">adopciones</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-6">
            <div className="text-4xl">👩‍⚕️</div>
            <p className="mt-2 text-lg font-bold">520+</p>
            <p className="text-sm">atenciones</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/adopta"
            className="rounded-full bg-yellow-400 px-6 py-2 font-semibold text-slate-900 hover:bg-yellow-500"
          >
            QUIERO ADOPTAR
          </Link>
          <Link
            href="/apadrina"
            className="rounded-full border px-6 py-2 font-semibold hover:bg-white/10"
          >
            QUIERO APADRINAR
          </Link>
          <Link
            href="/donar"
            className="rounded-full border px-6 py-2 font-semibold hover:bg-white/10"
          >
            REPORTE DE AYUDA
          </Link>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="rounded-3xl bg-[#163A6F] text-white px-6 py-12 border">
        <h2 className="title-script text-center text-4xl">
          Los humanos detrás
        </h2>
        <p className="text-center text-white/80 uppercase tracking-wider text-sm mt-1">
          NUESTRO EQUIPO
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {team.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border bg-white/5"
            >
              <ImageFallback
                src={p.f}
                alt={p.n}
                className="h-48 w-full object-cover"
                fallback="https://placehold.co/800x400"
              />
              <div className="p-4">
                <p className="font-semibold">{p.n}</p>
                <p className="text-sm text-white/80">{p.r}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
