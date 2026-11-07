/* eslint-disable @next/next/no-img-element */

// Dummy flag source. Swap for the flag URL returned by the countries API later.
export function CountryFlag({ code }: { code: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt=""
      width={20}
      height={15}
      loading="lazy"
      className="h-[15px] w-5 shrink-0 rounded-[2px] object-cover"
    />
  );
}
