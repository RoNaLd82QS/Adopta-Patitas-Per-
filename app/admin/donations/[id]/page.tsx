import { prisma } from "@/lib/prisma";
import { updateDonation, deleteDonation } from "../actions";

export default async function EditDonationPage({
  params,
}: {
  params: { id: string };
}) {
  const row = await prisma.donationMethod.findUnique({
    where: { id: params.id },
  });
  if (!row) return <p>No encontrado</p>;

  return (
    <div className="max-w-xl space-y-3">
      <h3 className="text-lg font-semibold mb-2">Editar método</h3>

      <form
        action={(form) => updateDonation(row.id, form)}
        encType="multipart/form-data"
        className="space-y-3"
      >
        <input
          name="bankName"
          defaultValue={row.bankName}
          className="border rounded w-full p-2"
          required
        />
        <input
          name="account"
          defaultValue={row.account}
          className="border rounded w-full p-2"
          required
        />
        <input
          name="cci"
          defaultValue={row.cci ?? ""}
          className="border rounded w-full p-2"
        />

        <div className="grid gap-2">
          <label className="text-sm font-medium">Logo del banco</label>
          <input type="file" name="logo" accept="image/*" className="block" />
          <input
            name="logoUrl"
            defaultValue={row.logoUrl ?? ""}
            className="border rounded w-full p-2"
            placeholder="o URL manual"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">QR Yape</label>
            <input
              type="file"
              name="yapeQr"
              accept="image/*"
              className="block"
            />
            <input
              name="yapeQrUrl"
              defaultValue={row.yapeQrUrl ?? ""}
              className="border rounded w-full p-2 mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">QR Plin</label>
            <input
              type="file"
              name="plinQr"
              accept="image/*"
              className="block"
            />
            <input
              name="plinQrUrl"
              defaultValue={row.plinQrUrl ?? ""}
              className="border rounded w-full p-2 mt-1"
            />
          </div>
        </div>

        <button className="rounded px-3 py-2 bg-blue-600 text-white">
          Guardar
        </button>
      </form>

      <form
        action={async () => {
          "use server";
          await deleteDonation(row.id);
        }}
        className="pt-2"
      >
        <button className="rounded px-3 py-2 bg-red-600 text-white">
          Eliminar
        </button>
      </form>
    </div>
  );
}
