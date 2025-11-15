import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <>
      <Link href="/">
        <Image
          src="/logo_light.png"
          width={90}
          height={90}
          alt="AmerBazar"
          className="block dark:hidden"
        />
        <Image
          src="/logo_dark.png"
          width={90}
          height={90}
          alt="AmerBazar"
          className="hidden dark:block"
        />
      </Link>
    </>
  );
};

export default Logo;
