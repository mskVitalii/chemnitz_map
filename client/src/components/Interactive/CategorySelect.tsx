import { useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { ICategoryUI } from "@app/interfaces/places";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CategotySelect({
  categories,
  selected,
  setSelected,
}: {
  categories: any;
  selected: ICategoryUI[];
  setSelected: (data: ICategoryUI[]) => void;
}) {
  return (
    <Listbox value={selected} onChange={setSelected} multiple>
      {({ open }) => (
        <>
          <Label className="block text-sm font-medium leading-6 text-gray-600">
            Category:
          </Label>
          <div className="relative w-full">
            <ListboxButton className="relative w-full cursor-default max-h-[38px] overflow-hidden rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6">
              <span className="inline-flex w-full">
                {selected.length === 0 && "Select category"}
                {selected.map(
                  (sel, index) =>
                    `${sel.name}${index < selected.length - 1 ? ", " : ""}`
                )}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <Transition
              show={open}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {categories.map((category: ICategoryUI) => (
                  <ListboxOption
                    key={category.secondary}
                    className={({ focus }) =>
                      classNames(
                        focus ? "bg-blue-500 text-white" : "",
                        !focus ? "text-gray-900" : "",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={category}
                  >
                    {({ selected, focus }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className="h-2 w-2 min-h-2 min-w-2 mt-1 mr-1 md:mr-2 rounded-full"
                            style={{
                              backgroundColor: category.color,
                            }}
                          ></span>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "truncate"
                            )}
                          >
                            {category.name}
                          </span>
                          <span
                            className={classNames(
                              focus ? "text-blue-200" : "text-gray-500",
                              "ml-2 truncate"
                            )}
                          >
                            {category.secondary}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              focus ? "text-white" : "text-blue-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
