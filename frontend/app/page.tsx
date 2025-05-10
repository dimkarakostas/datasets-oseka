"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvestmentStockChart } from "@/components/investment-stock-chart"
import { InvestmentFlowChart } from "@/components/investment-flow-chart"
import { InvestmentTable } from "@/components/investment-table"
import investmentData from "@/data/investments.json"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("2024")
  const [selectedMonth, setSelectedMonth] = useState<string>("12")

  const years = [...new Set(Object.keys(investmentData.stock).map((date) => date.split("-")[0]))].sort()
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))

  const selectedDate = `${selectedYear}-${selectedMonth}`
  const latestDate = Object.keys(investmentData.stock).sort().pop() || ""

  // Get the latest data or selected data
  const currentData = investmentData.stock[selectedDate] || investmentData.stock[latestDate]
  const totalInvestment = currentData?.find((item) => item[0] === "Total")?.[1] || 0

  // Get profit data
  const profitData = investmentData.profit || {}
  const profitYears = Object.keys(profitData).sort().reverse()

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa]">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-[#2D3748]">Επενδύσεις ΟΣΕΚΑ (UCITS)</h1>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/annual">Μηνιαία Ανάλυση</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Διαχρονική Εξέλιξη Επενδύσεων</h2>
            <p className="text-muted-foreground">
              Παρακολουθήστε την εξέλιξη των επενδύσεων φορολογικών κατοίκων Ελλάδας σε ΟΣΕΚΑ από το 2019 έως σήμερα
            </p>
          </div>

          {/* Annual Profit Cards */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Ετήσια κέρδη</h3>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {profitYears.map((year) => {
                const profit = profitData[year]
                const isPositive = profit > 0
                return (
                  <Card key={year} className={isPositive ? "border-green-200" : "border-red-200"}>
                    <CardHeader className="pb-2">
                      <CardDescription>{year}</CardDescription>
                      <CardTitle className={`text-xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(profit)}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>

          <Tabs defaultValue="stock" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="stock">Αξία Επενδύσεων</TabsTrigger>
              <TabsTrigger value="flow">Καθαρές Ροές</TabsTrigger>
              <TabsTrigger value="table">Πίνακας Δεδομένων</TabsTrigger>
            </TabsList>
            <TabsContent value="stock" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Διαχρονική Εξέλιξη Επενδύσεων</CardTitle>
                  <CardDescription>Αξία επενδύσεων σε ΟΣΕΚΑ ανά κατηγορία (σε €)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <InvestmentStockChart data={investmentData.stock} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="flow" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Καθαρές Ροές Επενδύσεων</CardTitle>
                  <CardDescription>Μηνιαίες καθαρές ροές ανά κατηγορία επένδυσης (σε €)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <InvestmentFlowChart data={investmentData.net_flow} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="table" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Αναλυτικά Δεδομένα</CardTitle>
                  <CardDescription>Πίνακας με όλα τα δεδομένα επενδύσεων</CardDescription>
                </CardHeader>
                <CardContent>
                  <InvestmentTable data={investmentData} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
