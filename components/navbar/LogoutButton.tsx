"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    // Redirect after logout
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left cursor-pointer px-2"
    >
      Sign out
    </button>
  );
}
