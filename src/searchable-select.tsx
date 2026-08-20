import { useMemo, useState } from "react";

export interface SearchableOption {
  id: number;
  label: string;
}

interface SearchableSelectProps {
  label: string;
  options: SearchableOption[];
  value: number | null;
  disabled?: boolean;
  onChange: (option: SearchableOption | null) => void;
}

export function SearchableSelect({
  label,
  options,
  value,
  disabled = false,
  onChange,
}: SearchableSelectProps) {
  const selected = options.find((option) => option.id === value) ?? null;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return search
      ? options.filter((option) => option.label.toLowerCase().includes(search))
      : options;
  }, [options, query]);

  return (
    <div className="searchable-select">
      <label>
        {label}
        <input
          role="combobox"
          aria-expanded={open}
          aria-controls={`${label.toLowerCase()}-options`}
          value={open ? query : selected?.label ?? ""}
          placeholder={`Search ${label.toLowerCase()}s`}
          disabled={disabled}
          autoComplete="off"
          onFocus={() => { setQuery(""); setOpen(true); }}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); onChange(null); }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        />
      </label>
      {open && !disabled && (
        <ul id={`${label.toLowerCase()}-options`} className="select-options" role="listbox">
          {filtered.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={option.id === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option);
                  setQuery("");
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="no-options">No matches</li>}
        </ul>
      )}
    </div>
  );
}
