"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface MetricInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const METRICS = ['px', '%', 'em', 'rem', 'vh', 'vw', 'auto', 'none']

export function MetricInput({
  label,
  value,
  onChange,
  placeholder,
  className,
}: MetricInputProps) {
  // Parse value into number and metric
  const parseValue = (val: string) => {
    if (!val || val === 'auto' || val === 'none') {
      return { number: '', metric: val || 'px' }
    }
    const match = val.match(/^([\d.]+)?(px|%|em|rem|vh|vw|auto|none)?$/)
    if (match) {
      return { number: match[1] || '', metric: match[2] || 'px' }
    }
    // Try to extract number and metric
    const numMatch = val.match(/^([\d.]+)/)
    const metricMatch = val.match(/(px|%|em|rem|vh|vw|auto|none)$/)
    return {
      number: numMatch ? numMatch[1] : val,
      metric: metricMatch ? metricMatch[1] : 'px'
    }
  }

  const { number, metric } = parseValue(value)

  const handleNumberChange = (num: string) => {
    if (num === '') {
      onChange('')
    } else {
      onChange(`${num}${metric}`)
    }
  }

  const handleMetricChange = (newMetric: string) => {
    if (newMetric === 'auto' || newMetric === 'none') {
      onChange(newMetric)
    } else if (number === '') {
      onChange('')
    } else {
      onChange(`${number}${newMetric}`)
    }
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs text-muted-foreground mb-1.5 block">
        {label}
      </Label>
      <div className="flex gap-1">
        <Input
          type="text"
          value={number}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder={placeholder}
          className="h-9 text-xs flex-1"
        />
        <select
          value={metric}
          onChange={(e) => handleMetricChange(e.target.value)}
          className="h-9 px-2 text-xs border border-border rounded-md bg-background min-w-[60px]"
        >
          {METRICS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
