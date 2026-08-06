import Image from "next/image";
import { Text } from "frosted-ui";

export function SiteHeader() {
  return (
    <header className="flex items-center gap-2.5 border-b border-gray-a5 px-6 py-3">
      <Image src="/whop-logo.svg" alt="Whop" width={26} height={13} className="block" />
      <Text size="3" weight="bold" className="leading-none">
        Whop Workforce
      </Text>
    </header>
  );
}
