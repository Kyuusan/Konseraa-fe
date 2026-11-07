"use client";

import { COUNTRIES } from "../data/locations";
import { CountryFlag } from "./CountryFlag";
import { SelectDropdown } from "./SelectDropdown";

export interface Domicile {
  country: string;
  province: string;
  city: string;
}

interface DomicileStepProps {
  value: Domicile;
  onChange: (value: Domicile) => void;
}

const toOptions = (items: string[]) => items.map((item) => ({ value: item, label: item }));

export function DomicileStep({ value, onChange }: DomicileStepProps) {
  const country = COUNTRIES.find((item) => item.code === value.country);
  const province = country?.provinces.find((item) => item.name === value.province);

  const countryOptions = COUNTRIES.map((item) => ({
    value: item.code,
    label: item.name,
    icon: <CountryFlag code={item.code} />,
  }));

  return (
    <div className="grid gap-5 md:grid-cols-3">
      <SelectDropdown
        id="domicile-country"
        label="Country"
        placeholder="Select country"
        options={countryOptions}
        value={value.country}
        // A new country invalidates the province and city picked under the old one.
        onChange={(code) => onChange({ country: code, province: "", city: "" })}
      />
      <SelectDropdown
        id="domicile-province"
        label="Province / State"
        placeholder={country ? "Select province" : "Pick a country first"}
        options={toOptions(country?.provinces.map((item) => item.name) ?? [])}
        value={value.province}
        onChange={(name) => onChange({ ...value, province: name, city: "" })}
        disabled={!country}
      />
      <SelectDropdown
        id="domicile-city"
        label="City"
        placeholder={province ? "Select city" : "Pick a province first"}
        options={toOptions(province?.cities ?? [])}
        value={value.city}
        onChange={(city) => onChange({ ...value, city })}
        disabled={!province}
      />
    </div>
  );
}
