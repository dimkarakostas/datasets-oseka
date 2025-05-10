"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvestmentDistributionChart } from "@/components/investment-distribution-chart"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import investmentData from "@/data/investments.json"

export default function AnnualDashboard() {
  // Get the latest date from the data
  const latestDate = Object.keys(investmentData.stock).sort().pop() || ""
  const [latestYear, latestMonth] = latestDate.split("-")

  const [selectedYear, setSelectedYear] = useState<string>(latestYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(latestMonth)

  const years = [...new Set(Object.keys(investmentData.stock).map((date) => date.split("-")[0]))].sort()
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))

  const selectedDate = `${selectedYear}-${selectedMonth}`

  // Get the selected data
  const currentData = investmentData.stock[selectedDate] || investmentData.stock[latestDate]
  const totalInvestment = currentData?.find((item) => item[0] === "Total")?.[1] || 0

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa]">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-[#2D3748]">Επενδύσεις Ελλήνων σε ΟΣΕΚΑ</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">Διαχρονική Εξέλιξη</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h2 className="text-xl font-semibold mb-4 md:mb-0">Μηνιαία Ανάλυση</h2>
            <div className="flex items-center gap-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Έτος" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Μήνας" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {new Date(`2020-${month}-01`).toLocaleString("el-GR", { month: "long" })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Two cards as requested */}
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            {/* First card for total */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Συνολικές Επενδύσεις</CardDescription>
                <CardTitle className="text-2xl font-bold">{formatCurrency(totalInvestment)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Στοιχεία{" "}
                  {new Date(`${selectedYear}-${selectedMonth}-01`).toLocaleString("el-GR", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Second card for category breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ανάλυση ανά Κατηγορία</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {currentData
                    ?.filter((item) => item[0] !== "Total" && item[0] !== "Real estate" && item[0] !== "Hedge")
                    .map(([category, value]) => (
                      <div key={category} className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                          {category === "Equity"
                            ? "Μετοχές"
                            : category === "Bond"
                              ? "Ομόλογα"
                              : category === "Mixed"
                                ? "Μικτά"
                                : "Άλλα"}
                        </span>
                        <span className="text-lg font-semibold">{formatCurrency(value as number)}</span>
                        <span className="text-xs text-muted-foreground">
                          {(((value as number) / totalInvestment) * 100).toFixed(1)}% του συνόλου
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribution chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Κατανομή Επενδύσεων</CardTitle>
              <CardDescription>Ποσοστιαία κατανομή επενδύσεων ανά κατηγορία</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <InvestmentDistributionChart data={currentData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
