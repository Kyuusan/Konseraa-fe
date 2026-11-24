// Dummy stand-in for GET /admin/users (users + user_profiles + user_roles).
import { AdminUserSchema } from "@/types/admin";
import { fixtureId } from "./ids";

let next = 2800;
const user = (
  full_name: string,
  email: string,
  roles: string[],
  status: string,
  created_at: string,
  last_login_at: string | null,
  extra: { phone?: string; city?: string } = {},
) => ({
  id: fixtureId(next++),
  full_name,
  email,
  phone: extra.phone ?? null,
  city: extra.city ?? null,
  status,
  roles,
  created_at,
  last_login_at,
});

export const ADMIN_USERS = AdminUserSchema.array().parse([
  user("Demo User", "user@konsera.test", ["customer", "organizer"], "active", "2026-09-01T10:00:00+07:00", "2026-11-24T08:10:00+07:00", { phone: "+6281234567890", city: "Jakarta" }),
  user("Rizky Aditya", "rizky.a@gmail.com", ["customer"], "active", "2026-03-14T19:20:00+07:00", "2026-11-23T21:45:00+07:00", { city: "Jakarta" }),
  user("Sinta Maharani", "sinta.m@yahoo.com", ["customer"], "active", "2026-05-02T08:00:00+07:00", "2026-11-22T12:30:00+07:00", { city: "Bandung" }),
  user("Hendra Sitompul", "hendra@rimbasound.id", ["customer", "organizer"], "active", "2026-10-30T09:15:00+07:00", "2026-11-16T13:00:00+07:00", { phone: "+6281361234455", city: "Medan" }),
  user("Naya Putri", "naya.putri@gmail.com", ["customer", "organizer"], "active", "2026-11-10T14:00:00+07:00", "2026-11-18T11:25:00+07:00", { city: "Malang" }),
  user("Bima Saputra", "bima.gate@konsera.test", ["gatekeeper"], "active", "2026-11-02T10:00:00+07:00", "2026-11-18T19:40:00+07:00"),
  user("Yoga Pratama", "yoga.gate@konsera.test", ["gatekeeper"], "suspended", "2026-09-20T09:00:00+07:00", "2026-10-17T22:10:00+07:00"),
  user("Kevin Halim", "kevin.h@outlook.com", ["customer"], "active", "2026-07-21T16:40:00+07:00", "2026-11-22T19:20:00+07:00", { city: "Surabaya" }),
  user("Dewi Lestari", "dewi.lestari@gmail.com", ["customer"], "pending_verification", "2026-11-23T22:05:00+07:00", null),
  user("Arga Wibisono", "arga.w@proton.me", ["customer"], "pending_verification", "2026-11-24T07:30:00+07:00", null),
  user("Tiket Murah Official", "tiketmurah.official@mail.ru", ["customer"], "banned", "2026-08-11T03:12:00+07:00", "2026-08-12T02:50:00+07:00"),
  user("Bayu Saputra", "bayu.s@yahoo.com", ["customer"], "suspended", "2026-06-05T20:10:00+07:00", "2026-10-29T08:55:00+07:00", { city: "Denpasar" }),
  user("Laras Wening", "laras.w@gmail.com", ["customer"], "active", "2026-04-18T11:00:00+07:00", "2026-11-20T09:15:00+07:00", { city: "Yogyakarta" }),
  user("Admin Event", "events@konsera.test", ["admin_event"], "active", "2026-01-05T09:00:00+07:00", "2026-11-24T07:55:00+07:00"),
  user("Super Admin", "superadmin@konsera.test", ["super_admin"], "active", "2026-01-05T09:00:00+07:00", "2026-11-24T08:00:00+07:00"),
]);
