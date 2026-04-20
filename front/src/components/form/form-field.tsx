'use client';

import React from 'react';
import { useFormContext, Controller, FieldValues, ControllerProps, Path } from 'react-hook-form';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps<T extends FieldValues> {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  multiline?: boolean;
  rows?: number;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  type = 'text',
  multiline = false,
  rows = 4,
}: FormFieldProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name as Path<T>}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {multiline ? (
              <Textarea {...field} placeholder={placeholder} rows={rows} />
            ) : (
              <Input {...field} type={type} placeholder={placeholder} />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
