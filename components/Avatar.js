import { initials } from "@/lib/utils";

export default function Avatar({ user, size = "h-9 w-9", text = "text-sm" }) {
  if (user?.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.image} alt={user.name || "Profile"} className={`${size} rounded-full object-cover`} />;
  }
  return (
    <span className={`${size} ${text} flex items-center justify-center rounded-full bg-ink font-semibold text-white`}>
      {initials(user?.name)}
    </span>
  );
}
