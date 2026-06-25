import Link from "next/link";
import SignOutButton from "./SignOutButton";

interface NavbarProps {
  /** Right-side subtitle text. Defaults to "Onboarding Portal". */
  subtitle?: string;
  /** Show the sign-out button. Only true on the homepage. */
  showSignOut?: boolean;
  /** If true, logo is not a link (for the homepage). */
  isHome?: boolean;
}

export default function Navbar({
  subtitle = "Onboarding Portal",
  showSignOut = false,
  isHome = false,
}: NavbarProps) {
  const logo = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/9fin-logo.png`}
        alt="9fin"
        width={80}
        height={32}
        className="object-contain rounded-lg"
        style={{ height: "auto" }}
      />
    </>
  );

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b"
      style={{
        backgroundColor: "rgba(10, 22, 40, 0.75)",
        borderColor: "rgba(30, 144, 255, 0.2)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {isHome ? logo : <Link href="/">{logo}</Link>}

      <div className="flex items-center gap-6">
        <span
          className="text-xs tracking-[0.2em] uppercase hidden sm:block"
          style={{
            fontFamily: "var(--font-space-mono)",
            color: "rgba(204,204,204,0.55)",
          }}
        >
          {subtitle}
        </span>
        {showSignOut && <SignOutButton />}
      </div>
    </nav>
  );
}
