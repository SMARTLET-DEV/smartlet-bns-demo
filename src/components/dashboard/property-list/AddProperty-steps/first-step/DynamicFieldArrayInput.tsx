"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Control, useFieldArray, useWatch } from "react-hook-form";

interface DynamicFieldArrayInputProps {
  control: Control<any>;
  name: string;
  placeholderPrefix?: string;
  label?: string;
}

export default function DynamicFieldArrayInput({
  control,
  name,
  placeholderPrefix = "Item",
  label,
}: DynamicFieldArrayInputProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const values = useWatch({ control, name });

  return (
    <div className="col-span-2 space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input
            {...control.register(`${name}.${index}`)}
            placeholder={`${placeholderPrefix} ${index + 1}`}
            className="flex-1 py-5 mb-2"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
          >
            <Trash2Icon className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="-mt-2"
        onClick={() => append("")}
      >
        <PlusIcon className="w-4 h-4 mr-0" />
        Add
      </Button>
    </div>
  );
}
