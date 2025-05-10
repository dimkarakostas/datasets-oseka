"use client"

import { useRef } from "react"
import { Chart, ArcElement, Title, Tooltip, Legend, Colors } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(ArcElement, Title, Tooltip, Legend, Colors)

interface InvestmentDistributionChartProps {
  data: Array<[string, number]>
}

export function InvestmentDistributionChart({ data }: InvestmentDistributionChartProps) {
  const chartRef = useRef<Chart | null>(null)

  // Filter out Total, Real estate, and Hedge categories
  const filteredData = data.filter(
    (item) => item[0] !== "Total" && item[0] !== "Real estate" && item[0] !== "Hedge" && item[1] > 0,
  )

  // Calculate total for percentage
  const total = filteredData.reduce((sum, item) => sum + (item[1] as number), 0)

  // Prepare data for pie chart
  const labels = filteredData.map((item) =>
    item[0] === "Equity" ? "Μετοχές" : item[0] === "Bond" ? "Ομόλογα" : item[0] === "Mixed" ? "Μικτά" : "Άλλα",
  )

  const values = filteredData.map((item) => item[1])

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        borderWidth: 1,
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
        ],
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw
            const percentage = ((value / total) * 100).toFixed(1)

            let valueFormatted
            if (value >= 1000000000) {
              valueFormatted = (value / 1000000000).toFixed(2) + " δις €"
            } else if (value >= 1000000) {
              valueFormatted = (value / 1000000).toFixed(2) + " εκ €"
            } else {
              valueFormatted = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(value)
            }

            return `${context.label}: ${valueFormatted} (${percentage}%)`
          },
        },
      },
    },
  }

  return <Pie data={chartData} options={options} />
}
