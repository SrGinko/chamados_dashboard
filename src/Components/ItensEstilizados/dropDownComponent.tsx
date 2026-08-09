import { useState, useRef, useEffect } from "react";
import { ChevronDown } from 'lucide-react'

type Option = {
  label: string;
  value: string;
  description?: string
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  buttonStyle?: any
  selectBoxStyle?: any
  style?: any
};

export default function CustomSelect({ value, onChange, options, buttonStyle, selectBoxStyle }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="customSelect" style={buttonStyle} ref={ref}>

      <div className="selectBox" style={selectBoxStyle} onClick={() => setOpen(!open)}>
        <span style={selectBoxStyle}> {selected?.label || "Selecionar"} </span>
        <span className={`arrow ${open ? "open" : ""}`}><ChevronDown size={16} /></span>
      </div>

      {open && (
        <div className="selectDropdown">
          {options.map(option => (
            <div
              key={option.value}
              data-type={option.value}
              className={`selectItem ${value === option.value ? "active" : ""}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <div className="optionContent">
                <span className="optionLabel">{option.label}</span>

                {option.description && (
                  <span className="optionDescription">
                    {option.description}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}