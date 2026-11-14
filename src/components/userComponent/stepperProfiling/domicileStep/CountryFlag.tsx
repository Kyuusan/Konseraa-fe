import Image from "next/image";

// Dummy flag source. Swap for the flag URL returned by the countries API later.
export function CountryFlag({ code }: { code: string }) {
  return (
    <Image
      src={`https://flagcdn.com/w40/${code}.png`}
      alt=""
      width={20}
      height={15}
      className="h-3.75 w-5 shrink-0 rounded-xs object-cover"
    />
  );
}
