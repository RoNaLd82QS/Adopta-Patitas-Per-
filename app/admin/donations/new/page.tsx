import { createDonation } from "../actions";

export default function NewDonationPage() {
  return (
    <form
      action={createDonation}
      encType="multipart/form-data"
      className="max-w-xl space-y-3"
    >
      <h3 className="text-lg font-semibold mb-2">Nuevo método</h3>

      <input
        name="bankName"
        placeholder="Banco"
        className="border rounded w-full p-2"
        required
      />
      <input
        name="account"
        placeholder="Número de cuenta"
        className="border rounded w-full p-2"
        required
      />
      <input
        name="cci"
        placeholder="CCI (opcional)"
        className="border rounded w-full p-2"
      />

      <div className="grid gap-2">
        <label className="text-sm font-medium">Logo del banco</label>
        <input type="file" name="logo" accept="image/*" className="block" />
        <input
          name="logoUrl"
          placeholder="o URL del logo"
          className="border rounded w-full p-2"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">QR Yape</label>
          <input type="file" name="yapeQr" accept="image/*" className="block" />
          <input
            name="yapeQrUrl"
            placeholder="o URL del QR Yape"
            className="border rounded w-full p-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">QR Plin</label>
          <input type="file" name="plinQr" accept="image/*" className="block" />
          <input
            name="plinQrUrl"
            placeholder="o URL del QR Plin"
            className="border rounded w-full p-2 mt-1"
          />
        </div>
      </div>

      <button className="rounded px-3 py-2 bg-green-600 text-white">
        Guardar
      </button>
    </form>
  );
}
