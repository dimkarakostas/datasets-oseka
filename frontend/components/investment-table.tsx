"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface InvestmentTableProps {
  data: {
    stock: Record<string, Array<[string, number]>>
    net_flow: Record<string, Array<[string, number]>>
  }
}

export function InvestmentTable({ data }: InvestmentTableProps) {
  const [showCategories, setShowCategories] = useState<Record<string, boolean>>({
    Equity: true,
    Bond: true,
    Mixed: true,
    Other: true,
    Total: true,
  })

  const [dataType, setDataType] = useState<"stock" | "net_flow">("stock")

  // Get all dates and sort them
  const dates = Object.keys(data.stock).sort().reverse()

  // Create a table-friendly data structure
  const tableData = dates.map((date) => {
    const [year, month] = date.split("-")
    const formattedDate = `${month}/${year}`

    const rowData: Record<string, any> = { date: formattedDate }

    // Add data for each category
    const categoryData = data[dataType][date]
    if (categoryData) {
      categoryData.forEach(([category, value]) => {
        if (category !== "Real estate" && category !== "Hedge") {
          rowData[category] = value
        }
      })
    }

    return rowData
  })

  // Get visible categories
  const visibleCategories = Object.entries(showCategories)
    .filter(([_, isVisible]) => isVisible)
    .map(([category]) => category)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Κατηγορίες <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(showCategories).map(([category, isChecked]) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={isChecked}
                onCheckedChange={(checked) => setShowCategories((prev) => ({ ...prev, [category]: !!checked }))}
              >
                {category === "Equity"
                  ? "Μετοχές"
                  : category === "Bond"
                    ? "Ομόλογα"
                    : category === "Mixed"
                      ? "Μικτά"
                      : category === "Other"
                        ? "Άλλα"
                        : "Σύνολο"}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
          <Button variant={dataType === "stock" ? "default" : "outline"} onClick={() => setDataType("stock")}>
            Αξία
          </Button>
          <Button variant={dataType === "net_flow" ? "default" : "outline"} onClick={() => setDataType("net_flow")}>
            Καθαρές Ροές
          </Button>
        </div>
      </div>

      {/* Make the table header sticky when scrolling */}
      <div className="rounded-md border">
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="sticky left-0 bg-white z-20">Ημερομηνία</TableHead>
                {visibleCategories.map((category) => (
                  <TableHead key={category} className="text-right">
                    {category === "Equity"
                      ? "Μετοχές"
                      : category === "Bond"
                        ? "Ομόλογα"
                        : category === "Mixed"
                          ? "Μικτά"
                          : category === "Other"
                            ? "Άλλα"
                            : "Σύνολο"}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium sticky left-0 bg-white">{row.date}</TableCell>
                  {visibleCategories.map((category) => (
                    <TableCell key={category} className="text-right">
                      {formatCurrency(row[category] || 0)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
