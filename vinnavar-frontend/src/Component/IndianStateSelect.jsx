import React, { useState, useEffect, useRef } from "react";
import { INDIAN_STATES } from "../utils/indianStates";

/**
 * Searchable Indian States Combobox / Dropdown Component
 *
 * Allows users to:
 * - View a dropdown of all Indian States and Union Territories.
 * - Select a state by typing any character(s) to filter the list in real-time.
 * - Navigate and select via keyboard (Arrow keys, Enter, Escape).
 * - Click the chevron to open/close the dropdown.
 */
const IndianStateSelect = ({
  value = "",
  onChange,
  name = "state",
  id,
  placeholder = "Search or select state...",
  required = false,
  className = "",
  isBootstrap = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Sync internal search term when external value changes
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  const commitRef = useRef();

  // Filter states based on user typing (matches any substring, case-insensitive)
  const filteredStates = INDIAN_STATES.filter((state) =>
    state.toLowerCase().includes((searchTerm || "").trim().toLowerCase())
  );

  const handleCloseAndCommit = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);

    const trimmed = (searchTerm || "").trim().toLowerCase();
    // If user typed an exact match or partial match that matches a known state
    const exactMatch = INDIAN_STATES.find((s) => s.toLowerCase() === trimmed);
    if (exactMatch) {
      if (exactMatch !== value) {
        emitChange(exactMatch);
      }
      setSearchTerm(exactMatch);
    } else if (trimmed === "") {
      // If cleared and field required, fallback to previous value or empty
      if (required && value) {
        setSearchTerm(value);
      } else {
        emitChange("");
        setSearchTerm("");
      }
    } else {
      // If typing doesn't match, check if there is a single close match in filtered results
      if (filteredStates.length === 1) {
        emitChange(filteredStates[0]);
        setSearchTerm(filteredStates[0]);
      } else {
        // Revert back to the last valid value
        setSearchTerm(value || "");
      }
    }
  };

  useEffect(() => {
    commitRef.current = handleCloseAndCommit;
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (commitRef.current) {
          commitRef.current();
        }
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const emitChange = (selectedState) => {
    if (onChange) {
      // Support both event-style onChange(e) and direct value onChange(val)
      onChange({
        target: {
          name,
          value: selectedState
        }
      });
    }
  };

  const handleSelectState = (state) => {
    setSearchTerm(state);
    emitChange(state);
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setSearchTerm(text);
    setHighlightedIndex(0);
    if (!isOpen) {
      setIsOpen(true);
    }

    // If typing matches a state exactly, trigger onChange
    const directMatch = INDIAN_STATES.find(
      (s) => s.toLowerCase() === text.trim().toLowerCase()
    );
    if (directMatch) {
      emitChange(directMatch);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) =>
          prev < filteredStates.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(filteredStates.length - 1);
      } else {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredStates.length - 1
        );
      }
    } else if (e.key === "Enter") {
      if (isOpen && filteredStates.length > 0) {
        e.preventDefault();
        const indexToPick = highlightedIndex >= 0 ? highlightedIndex : 0;
        handleSelectState(filteredStates[indexToPick]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCloseAndCommit();
    } else if (e.key === "Tab") {
      if (isOpen && highlightedIndex >= 0 && filteredStates[highlightedIndex]) {
        handleSelectState(filteredStates[highlightedIndex]);
      } else {
        handleCloseAndCommit();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const activeEl = listRef.current.children[highlightedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const defaultTailwindInputClass =
    "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all pr-10 text-xs sm:text-sm";

  const defaultBootstrapInputClass =
    "form-control form-control-sm pe-4";

  const appliedInputClass = className
    ? className
    : isBootstrap
    ? defaultBootstrapInputClass
    : defaultTailwindInputClass;

  const datalistId = id ? `${id}-datalist` : `indian-states-${name}-datalist`;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          list={datalistId}
          autoComplete="off"
          disabled={disabled}
          required={required}
          value={searchTerm}
          placeholder={placeholder}
          className={appliedInputClass}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            if (inputRef.current) {
              inputRef.current.select();
            }
          }}
          onKeyDown={handleKeyDown}
        />

        {/* Right Toggle Chevron */}
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            if (isOpen) {
              handleCloseAndCommit();
            } else {
              setIsOpen(true);
              if (inputRef.current) inputRef.current.focus();
            }
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-transform"
          aria-label="Toggle state list"
          style={{
            cursor: disabled ? "not-allowed" : "pointer"
          }}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-emerald-600" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Progressive native datalist support for mobile/voiceover */}
      <datalist id={datalistId}>
        {INDIAN_STATES.map((state) => (
          <option key={state} value={state} />
        ))}
      </datalist>

      {/* Custom Searchable Dropdown Popup */}
      {isOpen && !disabled && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200 z-50 py-1.5 text-xs sm:text-sm divide-y divide-slate-50"
          style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
        >
          {filteredStates.length === 0 ? (
            <div className="px-4 py-3 text-center text-slate-400 font-medium italic">
              No matching Indian state found
            </div>
          ) : (
            filteredStates.map((state, idx) => {
              const isSelected = state === value;
              const isHighlighted = idx === highlightedIndex;

              return (
                <div
                  key={state}
                  onMouseDown={(e) => {
                    // Prevent input blur before click registers
                    e.preventDefault();
                    handleSelectState(state);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`px-3.5 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                    isHighlighted
                      ? "bg-emerald-50 text-emerald-900 font-semibold"
                      : isSelected
                      ? "bg-slate-50 text-emerald-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{state}</span>
                  {isSelected && (
                    <span className="text-emerald-600 font-black text-xs ml-2">✓</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default IndianStateSelect;
