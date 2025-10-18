import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveImage } from "@/lib/upload";

export const metadata = { title: "Donaciones | Admin" };

// helpers
function clean(v: FormDataEntryValue | null): string | null {
  return (typeof v === "string" ? v.trim() : "") || null;
}
function getFile(fd: FormData, name: string): File | null {
  const v = fd.get(name);
  return v instanceof File && v.size > 0 ? v : null;
}

// Server Action
async function createDonation(formData: FormData) {
  "use server";

  const bankName = clean(formData.get("bankName")) || "";
  const account = clean(formData.get("account")) || "";
  const cci = clean(formData.get("cci"));

  const logo = getFile(formData, "logo");
  const yape = getFile(formData, "yapeQr");
  const plin = getFile(formData, "plinQr");

  const yapeHolder = clean(formData.get("yapeHolder"));
  const plinHolder = clean(formData.get("plinHolder"));

  if (!bankName || !account) return;

  const [logoUrl, yapeQrUrl, plinQrUrl] = await Promise.all([
    saveImage(logo, "donations"),
    saveImage(yape, "donations"),
    saveImage(plin, "donations"),
  ]);

  await prisma.donationMethod.create({
    data: {
      bankName,
      account,
      cci,
      logoUrl,
      yapeQrUrl,
      plinQrUrl,
      yapeHolder,
      plinHolder,
    },
  });

  // revalida admin y la pública "Cómo donar"
  revalidatePath("/admin/donations");
  revalidatePath("/como-donar");
}

export default async function AdminDonationsPage() {
  const methods = await prisma.donationMethod.findMany({
    orderBy: { createdAt: "desc" },
  });
  type Method = (typeof methods)[number];

  return (
    <section className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold mb-8">Métodos de donación</h1>

      {/* FORM */}
      <form
        action={createDonation}
        encType="multipart/form-data"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Nombre del banco
          </label>
          <input
            name="bankName"
            required
            className="w-full rounded border p-2"
            placeholder="BCP, Interbank, BBVA, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Número de cuenta
          </label>
          <input
            name="account"
            required
            className="w-full rounded border p-2"
            placeholder="XXXXXXXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Número de CCI
          </label>
          <input
            name="cci"
            className="w-full rounded border p-2"
            placeholder="XXXXXXXXXXXXXXXXXXXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Logo del banco (JPG/PNG)
          </label>
          <input
            name="logo"
            type="file"
            accept=".jpg,.jpeg,.png"
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Yape QR (JPG/PNG)
          </label>
          <input
            name="yapeQr"
            type="file"
            accept=".jpg,.jpeg,.png"
            className="w-full rounded border p-2"
          />
          <label className="block text-sm font-medium mt-3 mb-1">
            Titular (Yape)
          </label>
          <input
            name="yapeHolder"
            className="w-full rounded border p-2"
            placeholder="Nombre del titular"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Plin QR (JPG/PNG)
          </label>
          <input
            name="plinQr"
            type="file"
            accept=".jpg,.jpeg,.png"
            className="w-full rounded border p-2"
          />
          <label className="block text-sm font-medium mt-3 mb-1">
            Titular (Plin)
          </label>
          <input
            name="plinHolder"
            className="w-full rounded border p-2"
            placeholder="Nombre del titular"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </form>

      {/* LISTA */}
      <ul className="space-y-3">
        {methods.map((m: Method) => (
          <li key={m.id} className="rounded border p-4">
            <div className="flex flex-wrap items-center gap-4">
              {m.logoUrl ? (
                <img src={m.logoUrl} alt="logo" className="h-10 w-auto" />
              ) : (
                <div className="h-10 w-10 rounded bg-slate-200" />
              )}
              <div className="min-w-0">
                <div className="font-semibold">{m.bankName}</div>
                <div className="text-sm text-slate-600">
                  Cuenta: {m.account}
                </div>
                {m.cci && (
                  <div className="text-sm text-slate-600">CCI: {m.cci}</div>
                )}

                {(m.yapeQrUrl || m.yapeHolder) && (
                  <div className="text-sm text-slate-600">
                    Yape: {m.yapeHolder || "—"}
                    {m.yapeQrUrl && (
                      <>
                        {" "}
                        —{" "}
                        <a
                          href={m.yapeQrUrl}
                          target="_blank"
                          className="underline"
                        >
                          Ver QR
                        </a>
                      </>
                    )}
                  </div>
                )}

                {(m.plinQrUrl || m.plinHolder) && (
                  <div className="text-sm text-slate-600">
                    Plin: {m.plinHolder || "—"}
                    {m.plinQrUrl && (
                      <>
                        {" "}
                        —{" "}
                        <a
                          href={m.plinQrUrl}
                          target="_blank"
                          className="underline"
                        >
                          Ver QR
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
